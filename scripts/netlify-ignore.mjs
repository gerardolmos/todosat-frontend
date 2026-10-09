// Netlify: exit 0 = OMIT; exit 1 = BUILD. Uncertainty always permits build.
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', ['--no-optional-locks', ...args], {
  cwd: root, encoding: 'utf8', timeout: 10000, maxBuffer: 8 * 1024 * 1024,
  stdio: ['ignore', 'pipe', 'pipe'],
});
const documented = path => path === 'AGENTS.md'
  || path.startsWith('.specify/')
  || path.startsWith('specs/')
  || path.startsWith('docs/sdd/')
  || /^\.agents\/skills\/speckit-[^/]*\/.+/.test(path);

let result = 1;
let reason = 'comparison unavailable';
try {
  // Only non-secret Netlify Git metadata is read.
  const base = process.env.CACHED_COMMIT_REF;
  const head = process.env.COMMIT_REF;
  const isSha = value => typeof value === 'string' && /^[a-fA-F0-9]{40,64}$/.test(value);
  if (!isSha(base) || !isSha(head)) throw new Error('missing or invalid Git reference');
  for (const sha of [base, head]) git('cat-file', '-e', `${sha}^{commit}`);
  // Divergent/unreliable history must not suppress a build.
  git('merge-base', '--is-ancestor', base, head);
  // Disable rename detection: both old and new paths appear as delete/add.
  const raw = git('diff', '--no-ext-diff', '--no-textconv', '--no-renames',
    '--name-only', '-z', base, head, '--');
  if (raw && !raw.endsWith('\0')) throw new Error('incomplete Git output');
  const paths = raw ? raw.slice(0, -1).split('\0') : [];
  if (paths.length && paths.every(path => path && documented(path))) {
    result = 0;
    reason = 'all changed paths are approved documentation paths';
  } else {
    reason = paths.length ? 'functional or unknown path changed' : 'no classifiable changes';
  }
} catch {
  // Includes missing objects, Git errors, timeouts and output limits.
  reason = 'missing reliable base or Git comparison failed';
}
console.log(`${result === 0 ? 'OMIT' : 'BUILD'}: ${reason}`);
process.exitCode = result;
