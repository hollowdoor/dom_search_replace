import nodeToString from './node_tostring';
import isElement from './is_element';
import appendChild from 'append-child';

export default function replaceInTextNode(dNode, replaceText, node){

    let str = nodeToString(dNode);
    let index = str.indexOf(replaceText);

    if(index === -1){
        return node;
    }

    let start = index;
    let end = index + replaceText.length;
    let before = str.slice(0, start);
    let after = str.slice(end, str.length);

    if(typeof node === 'string'){
        return document.createTextNode(before + node + after);
    }

    if(node.nodeType === Node.TEXT_NODE){
        let newText = nodeToString(node);
        return document.createTextNode(before + newText + after);
    }

    const frag = document.createDocumentFragment();
    frag.appendChild(document.createTextNode(before));
    append(frag, node);
    frag.appendChild(document.createTextNode(after));
    return frag;
};
