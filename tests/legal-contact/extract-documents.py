"""Read approved OOXML only; output QA data, never modify original documents."""
import argparse, hashlib, json, re, unicodedata
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as E
ROOT=Path(__file__).resolve().parents[2]
NS={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
W='{'+NS['w']+'}'
def extract():
    spec=(ROOT/'specs/002-cookies-legal-contact/spec.md').read_text()
    expected=dict(re.findall(r'Documento base `([^`]+)` SHA-256: `([a-f0-9]{64})`',spec))
    result={}
    for name,digest in expected.items():
        p=ROOT.parent/'documentos-legales'/name
        assert hashlib.sha256(p.read_bytes()).hexdigest()==digest, 'Original changed: '+name
        with ZipFile(p) as z:
            doc=E.fromstring(z.read('word/document.xml'))
            rel=E.fromstring(z.read('word/_rels/document.xml.rels'))
            assert not any(x.get('TargetMode')=='External' for x in rel),'Unexpected external relationship'
            blocks=[]
            for par in doc.find('w:body',NS):
                if par.tag==W+'sectPr':continue
                assert par.tag==W+'p','Unexpected block'
                style=par.find('w:pPr/w:pStyle',NS)
                kind={'Heading1':'h1','Heading2':'h2'}.get(style.get(W+'val') if style is not None else '', 'p')
                if par.find('w:pPr/w:numPr',NS) is not None:kind='li'
                runs=[]
                for run in par:
                    if run.tag in (W+'pPr',W+'bookmarkStart',W+'bookmarkEnd'):continue
                    assert run.tag==W+'r','Unexpected inline element'
                    bold=run.find('w:rPr/w:b',NS)
                    strong=bold is not None and bold.get(W+'val','1') not in ('0','false','off')
                    for t in run:
                        if t.tag==W+'rPr':continue
                        assert t.tag in (W+'t',W+'br'),'Unexpected run element'
                        runs.append({'text':t.text or '' if t.tag==W+'t' else '\n','bold':strong,'break':t.tag==W+'br'})
                if any(x['text'] for x in runs):blocks.append({'tag':kind,'runs':runs})
            result[name]={'sha256':digest,'blocks':blocks}
    assert len(result)==5
    return result

from html.parser import HTMLParser
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.main=0;self.blocks=[];self.current=None;self.strong=0;self.links=[];self.ul=0
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='main':self.main+=1
        if not self.main:return
        if tag=='ul':self.ul+=1
        if tag in ('h1','h2','p','li'):
            assert self.current is None
            if tag=='li':assert self.ul>0
            self.current={'tag':tag,'chars':[]}
        if tag=='strong':self.strong+=1
        if tag=='br' and self.current:self.current['chars'].append(('\n',False))
        if tag=='a':self.links.append(attrs.get('href'))
    def handle_endtag(self,tag):
        if tag=='strong':self.strong-=1
        if tag=='ul':self.ul-=1
        if self.main and self.current and tag==self.current['tag']:
            self.blocks.append(self.current);self.current=None
        if tag=='main':self.main-=1
    def handle_data(self,data):
        if self.main and self.current:
            self.current['chars'].extend((c,bool(self.strong) if self.current['tag'] not in ('h1','h2') else True) for c in data)
def verify(name,html):
    expected=extract()[name]['blocks'];page=Page();page.feed(html)
    wanted=[]
    for b in expected:
        chars=[]
        for run in b['runs']:
            chars.extend((c,False if run['break'] else (run['bold'] if b['tag'] not in ('h1','h2') else True)) for c in run['text'])
        wanted.append({'tag':b['tag'],'chars':chars})
    assert page.blocks==wanted, 'Literal text/structure/bold/break mismatch: '+name
    assert all(h=='mailto:hola@todosatcom.com' for h in page.links),page.links
    emails=sum(''.join(x['text'] for x in b['runs']).count('hola@todosatcom.com') for b in expected)
    assert len(page.links)==emails, 'Missing email links'
    print('PASS '+name)
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--output');parser.add_argument('--verify',nargs=2);a=parser.parse_args()
    if a.verify:verify(a.verify[0],Path(a.verify[1]).read_text())
    else:
        assert a.output
        out=Path(a.output);out.mkdir(parents=True,exist_ok=True)
        (out/'documents.json').write_text(json.dumps(extract(),ensure_ascii=False,indent=2))
        print('Five original hashes verified; OOXML extracted to temporary QA directory')
