import { JSTOKENS } from "../LangTokens/JSTOKENS.js";

class ClassAssigner {
    Assign(editor, changedData, tokens, symbols) {
        const JsTokens = new JSTOKENS();
        const keywords = JsTokens.keywords;
        const inbuilt = JsTokens.inBuilt;
        const operators = JsTokens.operators;
        const types = JsTokens.types;

        let children = [...editor.childNodes];
        tokens = tokens.filter(token => token !== '');
        const spansHolder = document.createElement("div");
        for (let k = 0; k < tokens.length; k++) {
            const token = tokens[k];
            const span = document.createElement("span");
            children = children.filter(el => el.className.includes('line'));
            children.forEach(child => {
                child.addEventListener('focus', () => {
                    this.style.outline = '1px solid red';
                })
            })
            if (symbols.test(token)) {
                if (token.includes('"') || token.includes("'") || token.includes('`')) {
                    span.className = 'string';
                }
                else {
                    span.className = 'symbol';
                }
            }
            else {
                if (keywords.includes(token.trim())) {
                    span.className = "keyword";
                } else if (symbols.test(token.trim())) {
                    if (operators.includes(token.trim())) {
                        span.className = "operator";
                    } else {
                        span.className = "symbol";
                    }
                } else if (!isNaN(token.trim())) {
                    span.className = 'number';
                } else {
                    if (tokens[k + 1] !== undefined && tokens[k + 1].includes('(')) {
                        span.className = "function";
                    } else if (types.includes(token.trim())) {
                        span.className = "type";
                    } else if (inbuilt.includes(token.trim())) { 
                        span.className = "inbuilt";
                    } else
                        span.className = "text";
                }
            }
            span.innerText = token;
            spansHolder.appendChild(span);
        }

        if (changedData === ' ') {
            children[children.length - 1].innerHTML = spansHolder.innerHTML;
        } else if (changedData.data === null && changedData.inputType === 'insertParagraph') {
            children[children.length - 2].innerHTML = spansHolder.innerHTML;
        } else {
            children[children.length - 1].innerHTML = spansHolder.innerHTML;
        }
        this.setEndOfContenteditable(editor)
    }

    setEndOfContenteditable(contentEditableElement) {
        let range, selection;
        if (document.createRange) {
            range = document.createRange();
            range.selectNodeContents(contentEditableElement);
            range.collapse(false);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
        else if (document.selection) {
            range = document.body.createTextRange();
            range.moveToElementText(contentEditableElement);
            range.collapse(false);
            range.select();
        }
    }
}

export { ClassAssigner }