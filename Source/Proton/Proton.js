import { Tokenizer } from "./Tokenizer.js";

class Proton {
    constructor() {
        let count = 1;
        let lineCountStr = '1.<br>';
        const protonEditor = document.getElementById('ProtonWrapper');
        protonEditor.innerHTML =
            `<div id="Ph-line-count"></div>
         <div id="Proton-editor" spellcheck="false" contenteditable="true"></div>`;
        const linksTags = [document.head.getElementsByTagName('link')];
        document.head.innerHTML = `<link rel="stylesheet" href="Source/ProtonStyling/Proton.css">`;
        linksTags.forEach(linkTag => {
            document.head.append(linkTag);
        });
        const lineCountElement = document.getElementById("Ph-line-count");
        const editor = document.getElementById("Proton-editor");
        lineCountElement.innerHTML = '1.<br>';
        editor.innerHTML += '<div class="line" id="line-1" tableindex=1><br></div>';
        new Tokenizer(editor, lineCountElement, lineCountStr, count);
    }
}

export { Proton }