import domSearch from 'dom-search';
import isRegexp from 'is-regexp';


function domSearchReplace(doc, pattern, replacement, options){
    const search = typeof options === 'object' ?  Object.create(options) : {};
    search.type = getPatternType(pattern);

    let result = domSearch(doc, pattern, options);

    if(!result.length){
        return doc;
    }

    if(result.length === 1){
        replaceNode(result[0], pattern, replacement, search);
    }else{
        replaceNodes(result, pattern, replacement, search);
    }

    return doc;
}

function replaceNode(result, pattern, replacement, search){
    let str = result.textNode.nodeValue;

    if(search.type === 'string'){
        let start = str.indexOf(pattern);
        let end = start + pattern.length;
        let before = str.slice(0, start);
        let after = str.slice(end, str.length);

        if(typeof replacement === 'string'){
            result.textNode.nodeValue = before + replacement + after;
        }else{
            const frag = document.createDocumentFragment();
            frag.appendChild(document.createTextNode(before));
            frag.appendChild(replacement);
            frag.appendChild(document.createTextNode(after));
            result.parent.replaceChild(frag, result.textNode);
        }

    }else if(search.type === 'regexp'){
        result.textNode.nodeValue = str.replace(pattern, replacement);
    }
}

function replaceNodes(result, pattern, replacement, search){
    for(let info of result){
        replaceNode(info, pattern, replacement, search);
    }
}

function getPatternType(pattern){
    if(isRegexp(pattern)){
        return 'regexp';
    }

    return typeof pattern;
}

export default domSearchReplace;

/*
git remote add origin https://github.com/hollowdoor/dom_search_replace.git
git push -u origin master
*/
