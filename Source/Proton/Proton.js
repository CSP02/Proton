import { Tokenizer } from "./Tokenizer.js";
let logs = ''

class Proton {
    constructor() {
        let count = 1;
        let lineCountStr = '1.<br>';
        const protonEditor = document.getElementById('ProtonWrapper');
        protonEditor.innerHTML =
            `<div id="Proton-editor-Wrapper"><div id="options"><label for="autoformat">Auto format</label>
             <input type="checkbox" id="autoformat" name="autoformat">
             <button id="runCode">Run</button></div>
             <div id="Ph-line-count"></div>
             <div id="Proton-editor" spellcheck="false" contenteditable="true"></div>
             <div id="suggestions"></div></div>
             <div id="Proton-console-wrapper">
             <h3>Console:</h3>
             <div id="console"><p class="console-starter">> </p></div>
             </div>`;
        const linksTags = [document.head.getElementsByTagName('link')];
        document.getElementById("suggestions").style.left = document.getElementById("Proton-editor").offsetLeft;
        document.getElementById("suggestions").style.top = document.getElementById("Proton-editor").offsetTop + 20;
        document.head.innerHTML = `<link rel="stylesheet" href="Source/ProtonStyling/Proton.css">`;
        linksTags.forEach(linkTag => {
            document.head.append(linkTag);
        });
        const lineCountElement = document.getElementById("Ph-line-count");
        const editor = document.getElementById("Proton-editor");
        lineCountElement.innerHTML = '1.<br>';
        editor.innerHTML += '<div class="line" id="line-1" contenteditable><br></div>';
        new Tokenizer(editor, lineCountElement, lineCountStr, count);
        document.getElementById("runCode").addEventListener("click", () => {
            document.getElementsByClassName('console-starter')[document.getElementsByClassName('console-starter').length - 1].innerHTML += "Running your code..."
            let output = ''
            try {
                let result = new Function(`${editor.innerText}`);
                output = console.log(result());
                document.getElementById('console').innerHTML += output.replace('undefined', '');
                document.getElementById('console').innerHTML += '<p class="console-starter">> </p>';
            } catch (error) {
                output = `${error.stack.split('at').join('<br>at').split('(').join(`<br>(`)}`
                document.getElementById('console').innerHTML += `<p class="console-error">${output}</p>`;
                document.getElementById('console').innerHTML += '<p class="console-starter">> </p>';
            }
            document.getElementById('console').scrollTo(document.getElementById('console').scrollWidth, document.getElementById('console').scrollHeight)
            logs = ''
        });

        console.log = function (...values) {
            let output = ''
            values.forEach(value => {
                output += value + ' '
            })
            return logs += `<p>${output}</p>`;
        };
    }
}

export { Proton }