import { ClassAssigner } from "./ClassAssigner.js";

class Tokenizer {
    constructor(editor, lineCountElement, lineCountStr, count, braceCount) {
        const Assigner = new ClassAssigner();
        const symbols = new RegExp(/[-!$%^&*()+|~=`{}\[\]:";'<>?,\. \/]/g);
        let tokenTemp = '';
        editor.addEventListener("input", changedData => {
            count = changedData.target.childNodes.length;
            tokenTemp += changedData.data;
            if (changedData.data !== null && changedData.inputType !== 'deleteContentBackward') {
                const suggestionsPane = document.getElementById('suggestions');
                Assigner.openSuggestions(tokenTemp, suggestionsPane);
            }
            if ((count === 0) || (count === 1 && editor.innerHTML === '<br>')) {
                if (count !== 0) {
                    editor.removeChild(editor.childNodes[0]);
                }
                editor.innerHTML += `<div><br>${('&nbsp;').repeat(braceCount)}</div>`;
            }
            for (let i = 2; i <= count; i++) {
                lineCountStr += `${i}.<br>`;
            }
            if (changedData.data === ' ' || (changedData.data === null && changedData.inputType === 'insertParagraph') || (changedData.data === null && changedData.inputType === 'deleteContentBackward')) {
                tokenTemp = '';
            }
            if (document.getElementById('autoformat').checked && changedData.data === null && changedData.inputType === 'insertParagraph') {
                if (braceCount !== 0)
                    editor.lastChild.innerHTML = `${('<span class="indentation">&nbsp;&nbsp;</span>').repeat(braceCount)}`;
                if (editor.lastChild.lastChild.innerHTML.length === 0) {
                    editor.lastChild.lastChild.innerHTML += '<br>'
                }
                Assigner.setEndOfContenteditable(editor.lastChild.lastChild);
            }

            const divs = [...editor.getElementsByTagName("div")];
            for (let j = 0; j < divs.length; j++) {
                const div = divs[j];
                div.id = `line-${j + 1}`;
                div.className = `line`;
                div.tableindex = `${j + 1}`;
            }
            if ((changedData.data !== null && changedData.inputType !== 'deleteContentBackward') || (changedData.data === null && changedData.inputType === 'insertFromPaste')) {
                let tokens = [];
                let string
                let token = '';
                if (changedData.data === ' ' || !(/[A-Za-z0-9]/).test(changedData.data)) {
                    string = editor.lastChild.innerText;
                } else if (changedData.data === null && changedData.inputType === 'insertParagraph') {
                    string = editor.lastChild.previousSibling.innerText;
                } else {
                    string = editor.lastChild.innerText;
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

                        if (char === '{') {
                            braceCount++;
                        } else if (char === '}') {
                            if (editor.innerText.length !== 0) {
                                braceCount--;
                            }
                            else
                                braceCount = 0;
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
                        } else if (char === '/') {
                            let strCloser = char;
                            if (string[l + 1] === '/') {
                                strCloser = '\n';
                            } else if (string[l + 1] === '*') {
                                strCloser = '*/'
                            } else {
                                tokens.push(char);
                                token = '';
                                continue;
                            }

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
                Assigner.Assign(editor, changedData, tokens, symbols, braceCount)
            }
            lineCountElement.innerHTML = lineCountStr;
            lineCountElement.scrollTo(lineCountElement.scrollWidth, lineCountElement.scrollHeight);
            editor.scrollTo(editor.scrollWidth, editor.scrollHeight)
            lineCountStr = '1.<br>';
        })
    }
}

export { Tokenizer };