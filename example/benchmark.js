'use strict';
//Please do not use this for any references,
//The comparison output is to make sure the conversion to richtext 
//is somewhat consistent with other libraries
//and is fast enough when it comes to converting to the tree format and to html
const fs = require('fs');
const path = require('path');
const content = require('./example.json');
const getContentTree = require('../index');
const {convertToHtml, treeToHtml} = require('./convert-to-html');
const draftConvert = require('draft-convert').convertToHTML;
const draftToHtml = require('draftjs-to-html').default;
const {stateToHTML} = require('draft-js-export-html');
const {convertFromRaw} = require('draft-js');
let t0, t1;

t0 = new Date().getTime();
const converted = getContentTree(content);
t1 = new Date().getTime();
const conversionToTreeTime = t1 - t0;

t0 = new Date().getTime();
const contentState = convertFromRaw(content);
t1 = new Date().getTime();
const conversionToContentStateTime = t1 - t0;

t0 = new Date().getTime();
const html = treeToHtml(converted);
t1 = new Date().getTime();
const htmlConversionTime = t1 - t0;

t0 = new Date().getTime();
const draftConvertHtml = draftConvert(contentState);
t1 = new Date().getTime();
const draftConvertConversionTime = t1 - t0;

t0 = new Date().getTime();
const stateToHTMLOutput = stateToHTML(contentState);
t1 = new Date().getTime();
const stateToHTMLConversionTime = t1 - t0;

t0 = new Date().getTime();
const draftToHtmlOutput = draftToHtml(content);
t1 = new Date().getTime();
const draftToHtmlConversionTime = t1 - t0;

let output = '';

output += '<head>\n';
output += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n';
output += '</head>\n';
output += '<div style="display:flex;">\n';
output += '<div style="width:25%">\n';
output += 'New Method Total (to Tree => to HTML) ' + (conversionToTreeTime + htmlConversionTime) + 'ms\n';
output += '</div>\n';
output += '<div style="width:25%">\n';
output += 'First library Total (to Content State => to HTML) ' + (conversionToContentStateTime + draftConvertConversionTime) + 'ms\n';
output += '</div>\n';
output += '<div style="width:25%">\n';
output += 'Second library Total (to Content State => to HTML) ' + (conversionToContentStateTime + stateToHTMLConversionTime) + 'ms\n';
output += '</div>\n';
output += '<div style="width:25%">\n';
output += 'Third library Total (directly to HTML) ' + draftToHtmlConversionTime + 'ms\n';
output += '</div>\n';
output += '</div>\n';
output += '<div style="display:flex">\n';
output += '<div style="width:25%">\n';
output += html;
output += '</div>\n';
output += '<div style="width:25%">\n';
output += draftConvertHtml;
output += '</div>\n';
output += '<div style="width:25%">\n';
output += stateToHTMLOutput;
output += '</div>\n';
output += '<div style="width:25%">\n';
output += draftToHtmlOutput;
output += '</div>\n';
output += '</div>\n';

fs.writeFile(path.resolve(__dirname, 'output.html'), output, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log("The comparison output was saved to example/output.html");
});

console.log('New Method Total (to Tree => to HTML) ' + (conversionToTreeTime + htmlConversionTime) + 'ms');
console.log('First library Total (to Content State => to HTML) ' + (conversionToContentStateTime + draftConvertConversionTime) + 'ms');
console.log('Second library Total (to Content State => to HTML) ' + (conversionToContentStateTime + stateToHTMLConversionTime) + 'ms');
console.log('Third library Total (directly to HTML) ' + draftToHtmlConversionTime + 'ms');
