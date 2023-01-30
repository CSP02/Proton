import { ClassAssigner } from "./ClassAssigner.js";

class Tokenizer {
    constructor(editor, lineCountElement, lineCountStr, count) {
        const Assigner = new ClassAssigner();
        const symbols = new RegExp(/[-!$%^&*()+|~=`{}\[\]:";'<>?,\. \/]/g);
        editor.addEventListener("input", changedData => {
            count = changedData.target.childNodes.length;
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
                Assigner.Assign(editor, changedData, tokens, symbols)
            }
            lineCountElement.innerHTML = lineCountStr;
            lineCountElement.scrollTo(lineCountElement.scrollWidth, lineCountElement.scrollHeight);
            editor.scrollTo(editor.scrollWidth, editor.scrollHeight)
            lineCountStr = '1.<br>';
        })
    }
}

export { Tokenizer };