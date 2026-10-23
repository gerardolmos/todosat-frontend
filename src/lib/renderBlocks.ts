export function renderBlocks(blocks: any[], options: { images?: Map<number, any> } = {}) {
    if (!blocks || !Array.isArray(blocks)) {
        return '';
    }

    return blocks
        .map((block, index) => {
            if (block.type === 'image' && options.images) {
                const image = options.images.get(index);
                const url = image?.url;
                if (typeof url !== 'string' || !/^(https?:\/\/|\/(?!\/))/.test(url) || /[\u0000-\u0020\\]/.test(url)) return '';
                const escape = (value: string) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
                const caption = typeof image.caption === 'string' ? image.caption : '';
                const dimensions = ['width','height'].filter(k => Number.isFinite(image[k]) && image[k] > 0).map(k => ` ${k}="${image[k]}"`).join('');
                return `<figure class="my-6"><img src="${escape(url)}" alt="${escape(image.alt || '')}"${dimensions} class="block max-w-full h-auto mx-auto" loading="lazy">${caption.trim() ? `<figcaption style="font-size:14px;color:#475569;overflow-wrap:anywhere;white-space:pre-line" class="mt-2 leading-6">${escape(caption)}</figcaption>` : ''}</figure>`;
            }
            if (block.type === 'paragraph') {
                return `<p class="mb-4 text-[1.05rem] font-normal leading-8">${renderChildren(block.children)}</p>`;
            }

            if (block.type === 'heading') {
                const level = block.level || 2;

                if (level === 1) {
                    return `<h1 class="mt-8 mb-4 text-4xl font-bold">${renderChildren(block.children)}</h1>`;
                }

                if (level === 2) {
                    return `<h2 class="mt-8 mb-4 text-3xl font-bold">${renderChildren(block.children)}</h2>`;
                }

                if (level === 3) {
                    return `<h3 class="mt-6 mb-3 text-2xl font-bold">${renderChildren(block.children)}</h3>`;
                }

                return `<h${level} class="mt-6 mb-3 text-xl font-bold">${renderChildren(block.children)}</h${level}>`;
            }

            if (block.type === 'list') {
                const isOrdered = block.format === 'ordered';
                const tag = isOrdered ? 'ol' : 'ul';
                const className = isOrdered
                    ? 'mb-6 ml-6 list-decimal space-y-2'
                    : 'mb-6 ml-6 list-disc space-y-2';

                const items = block.children
                    .map((item: any) => `<li>${renderChildren(item.children)}</li>`)
                    .join('');

                return `<${tag} class="${className}">${items}</${tag}>`;
            }

            return '';
        })
        .join('');
}

function renderChildren(children: any[]) {
    if (!children || !Array.isArray(children)) {
        return '';
    }

    return children
        .map((child) => {
            let text = child.text || '';

            if (child.bold) {
                text = `<strong class="font-semibold">${text}</strong>`;
            }

            if (child.italic) {
                text = `<em class="italic">${text}</em>`;
            }

            if (child.underline) {
                text = `<u>${text}</u>`;
            }

            if (child.strikethrough) {
                text = `<s>${text}</s>`;
            }

            return text;
        })
        .join('');
}

export function getReadingTime(blocks: any[]) {
    if (!blocks || !Array.isArray(blocks)) {
        return null;
    }

    const text = blocks
        .map((block) => {
            if (!block.children || !Array.isArray(block.children)) {
                return "";
            }

            return block.children
                .map((child: any) => child.text || "")
                .join(" ");
        })
        .join(" ");

    const words = text.trim().split(/\s+/).filter(Boolean).length;

    if (words === 0) {
        return null;
    }

    return Math.max(1, Math.ceil(words / 200));
}