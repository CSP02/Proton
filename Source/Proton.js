let count = 1;
let lineCountStr = '1.<br>';

window.onload = function () {
    const protonEditor = document.getElementById('ProtonWrapper');
    protonEditor.innerHTML =
        `<div id="Ph-line-count"></div>
         <div id="Proton-editor" spellcheck="false" contenteditable="true"></div>`;
    const linksTags = [document.head.getElementsByTagName('link')];
    document.head.innerHTML = `<link rel="stylesheet" href="Source/Proton.css">`;
    linksTags.forEach(linkTag => {
        document.head.append(linkTag);
    });
    const lineCountElement = document.getElementById("Ph-line-count");
    const editor = document.getElementById("Proton-editor");
    lineCountElement.innerHTML = '1.<br>';
    editor.innerHTML += '<div class="line" id="line-1" tableindex=1><br></div>';
    start(editor, lineCountElement, lineCountStr, count);
}

function start(editor, lineCountElement, lineCountStr, count) {
    editor.addEventListener("input", changedData => {
        count = changedData.target.childNodes.length;
        const symbols = new RegExp(/[-!$%^&*()+|~=`{}\[\]:";'<>?,\. \/]/g);
        const keywords = ['new', 'undefined', 'null', 'if', 'for', 'continue', 'break', 'switch', 'case', 'else', 'return',
            'do', 'while', 'void', 'export', 'import', 'async', 'await',
            'return', 'try', 'const', 'var', 'let'
        ];
        if ((count === 0) || (count === 1 && editor.innerHTML === '<br>')) {
            if (count !== 0) {
                editor.removeChild(editor.childNodes[0]);
            }
            editor.innerHTML += '<div><br></div>';
        }
        for (let i = 2; i <= count; i++) {
            lineCountStr += `${i}.<br>`;
        }
        const divs = [...editor.getElementsByTagName("div")];
        for (let j = 0; j < divs.length; j++) {
            const div = divs[j];
            div.id = `line-${j + 1}`;
            div.className = `line`;
            div.tableindex = `${j + 1}`;
        }
        if (changedData.data !== null && changedData.inputType !== 'deleteContentBackward') {
            let tokens = [];
            let string
            let token = '';
            if (changedData === ' ') {
                string = editor.childNodes[editor.childNodes.length - 1].innerText;
            } else if (changedData.data === null && changedData.inputType === 'insertParagraph') {
                string = editor.childNodes[editor.childNodes.length - 2].innerText;
            } else {
                string = editor.childNodes[editor.childNodes.length - 1].innerText;
            }
            for (let l = 0; l < string.length; l++) {
                const char = string[l];
                if (l === string.length - 1) {
                    if (symbols.test(char)) {
                        tokens.push(token);
                        tokens.push(char);
                    } else {
                        token += char;
                        tokens.push(token);
                    }
                    token = ''
                }
                else if ((/[A-Za-z0-9]/).test(char)) {
                    token += char;
                } else {
                    tokens.push(token);
                    if (char === '"' || char === "'" || char === '`') {
                        let strCloser = char;
                        for (l; l < string.length; l++) {
                            if (string[l + 1] !== strCloser) {
                                token += string[l];
                            } else {
                                token += string[l];
                                token += string[l + 1];
                                l++;
                                break;
                            }
                        }
                        tokens.push(token)
                    } else {
                        tokens.push(char)
                    }
                    token = '';
                }
            }
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
                    if (keywords[keywords.indexOf(token.trim())]) {
                        span.className = "keyword";
                    } else if (symbols.test(token.trim())) {
                        span.className = "symbol";
                    } else if (!isNaN(token.trim())) {
                        span.className = 'number';
                    } else if (token.includes('PRO-')) { 
                        console.log(token)
                    } else {
                        if (tokens[k + 1] !== undefined && tokens[k + 1].includes('(')) {
                            span.className = "function";
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
            setEndOfContenteditable(editor)
        }
        lineCountElement.innerHTML = lineCountStr;
        lineCountElement.scrollTo(lineCountElement.scrollWidth, lineCountElement.scrollHeight);
        editor.scrollTo(editor.scrollWidth, editor.scrollHeight)
        lineCountStr = '1.<br>';
    })
}

function checkSymbol(token) {
    if (token !== undefined) {
        return (/[-!"'`{}()\.;+*<>/]/).test(token);
    } else {
        return;
    }
}

function setEndOfContenteditable(contentEditableElement) {
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