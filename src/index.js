import domSearch from 'dom-search';
import isRegexp from 'is-regexp';

function domSearchReplace(doc, pattern, replacement, options){
    const search = typeof options === 'object' ?  Object.create(options) : {};
    search.all = typeof search.all === 'boolean' ? search.all : false;
    search.replaceType = getReplacementType(replacement);

    let result = domSearch(doc, pattern, options);

    if(!result.length){
        return doc;
    }

    if(search.replaceType === 'node'){
        replaceWithNode(result[0], pattern, replacement, search);
        return doc;
    }else if(search.replaceType === 'appendTo'){
        replaceWithAppendTo(result[0], pattern, replacement, search);
        return doc;
    }

    replacement = String(replacement);

    if(!search.all){
        replaceWithText(result[0], pattern, replacement, search);
        return doc;
    }

    for(let res of result){
        replaceWithText(res, pattern, replacement, search);
    }

    return doc;
}



function replaceWithText(result, pattern, replacement, search){
    let str = result.textNode.nodeValue;
    let parts, collect = '';

    if(sameLength(pattern, str)){
        result.textNode.nodeValue = replacement;
        return;
    }

    if(search.all){
        parts = str.split(pattern);
    }else{
        parts = str.split(pattern, 2);
    }

    for(let i=0; i<parts.length; i++){
        collect += parts[i];
        if(i < parts.length - 1){
            collect += replacement;
        }
    }

    result.textNode.nodeValue = collect;
}

function replaceWithNode(result, pattern, replacement, search){
    let str = result.textNode.nodeValue;


    if(sameLength(pattern, str)){
        result.parent.replaceChild(replacement, result.textNode);
        return;
    }

    let [before, after] = str.split(pattern, 2);

    const frag = document.createDocumentFragment();

    frag.appendChild(document.createTextNode(before));
    frag.appendChild(replacement);
    frag.appendChild(document.createTextNode(after));

    result.parent.replaceChild(frag, result.textNode);

}

function replaceWithAppendTo(result, pattern, replacement, search){
    let str = result.textNode.nodeValue;
    let frag = document.createDocumentFragment();

    if(sameLength(pattern, str)){
        replacement.appendTo(frag);
    }else{
        let [before, after] = str.split(pattern, 2);

        frag.appendChild(document.createTextNode(before));
        replacement.appendTo(frag);
        frag.appendChild(document.createTextNode(after));
    }

    result.parent.replaceChild(frag, result.textNode);

}

function getReplacementType(replacement){
    if(isNode(replacement)){
        return 'node';
    }else if(typeof replacement === 'object' && typeof replacement.appendTo === 'function'){
        return 'appendTo';
    }
    return 'none';
}

function sameLength(pattern, str){
    if(typeof pattern === 'string' && pattern.length === str.length){
        return true;
    }else if(isRegexp(pattern)){
        let match = str.match(pattern);
        if(match[0].length === str.length){
            return true;
        }
    }

    return false;
}

function isNode(o){
  return (
    typeof Node === "object" ? o instanceof Node :
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}


export default domSearchReplace;

/*
git remote add origin https://github.com/hollowdoor/dom_search_replace.git
git push -u origin master
*/
