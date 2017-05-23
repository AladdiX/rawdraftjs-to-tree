function convertToHtml(treeArray) {
    return treeArray.reduce((acc, tree) => {
        acc += treeToHtml(tree);
        return acc;
    }, '');
}

function treeToHtml(tree) {
    const empty = '';
    if (!tree)
        return '';
    if (!tree.component)
        return tree.text || empty;
    switch (tree.component) {
        case 'header-one':
            return `<h1>${convertToHtml(tree.children)}</h1>`;
        case 'header-two':
            return `<h2>${convertToHtml(tree.children)}</h2>`;
        case 'header-three':
            return `<h3>${convertToHtml(tree.children)}</h3>`;
        case 'BOLD':
            return `<strong>${convertToHtml(tree.children)}</strong>`;
        case 'ITALIC':
            return `<i>${convertToHtml(tree.children)}</i>`;
        case 'UNDERLINE':
            return `<u>${convertToHtml(tree.children)}</u>`;
        case 'LINK':
            return `<a href="${tree.data.url}">${convertToHtml(tree.children)}</a>`;
        case 'IMAGE':
            return `<img src="${tree.data.src}" alt="${(tree.data.alt || '')}"/>`;
        case 'root':
            return `<div>${convertToHtml(tree.children)}</div>`;
        case 'unstyled':
        default:
            return `<p>${convertToHtml(tree.children)}</p>`;
    }
}

module.exports = {
    convertToHtml,
    treeToHtml
};
