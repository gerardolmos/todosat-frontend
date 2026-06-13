export function renderBlocks(blocks: any[]) {
    if (!blocks || !Array.isArray(blocks)) {
        return '';
    }

    return blocks
        .map((block) => {
            if (block.type === 'paragraph') {
                return `<p class="mb-4 text-lg leading-relaxed">${renderChildren(block.children)}</p>`;
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
                text = `<strong class="font-bold">${text}</strong>`;
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