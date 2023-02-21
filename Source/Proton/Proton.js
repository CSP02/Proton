"use strict";
import { Tokenizer } from "./Tokenizer.js";

let logs = "";
let braceCount = 0;
let consoleStarter = ">";

class Proton {
  constructor() {
    let count = 1;
    let lineCountStr = "1.<br>";
    const protonWrapper = document.getElementById("ProtonWrapper");

    protonWrapper.innerHTML = `
    <nav id="Proton-options">
    <button id="runCode" title="Run your code">Run</button>
    <button id="showOptions" title="options"><hr id="linStr1" class="linStr1"><hr id="linStr2" class="linStr2"></button>
    </nav>
    <div id="options"><h3>Editor:</h3><label for="autoformat">Auto format
    <input type="checkbox" id="autoformat" name="autoformat" checked="true">
    <span id="customCheckbox"><div id="circle"></div></span>
    </label>
    <label for="Font">Font family:
    <select id="font" name="Font" value="Fira Code">
    <option class="fontFamilies">Fira code</option>
    <option class="fontFamilies">Roboto</option>
    <option class="fontFamilies">Poppins</option>
    </select>
    </label>
    <h3>Console:</h3><label for="consoleStartPointer">Starter symbol:
    <input type="Text" id="consoleStartPointer" name="consoleStartPointer" value=">" maxlength=3>
    </label>
    <button id="save">Save</button>
    </div>
    <div id="Proton-editor-Wrapper">
    <div id="Ph-line-count"></div>
    <div id="Proton-editor" spellcheck="false" contenteditable="true"></div>
    <div id="suggestions"></div></div>
    <div id="Proton-console-wrapper">
    <h3>Console:</h3>
    <div id="console"><p class="console-starter" contenteditable="true">${consoleStarter} </p></div>
    </div>`;

    const protonEditor = document.getElementById("Proton-editor");
    const protonEditorWrapper = document.getElementById(
      "Proton-editor-Wrapper"
    );
    const suggestionsPane = document.getElementById("suggestions");
    const protonConsoleWrapper = document.getElementById(
      "Proton-console-wrapper"
    );
    const protonConsole = document.getElementById("console");
    const linksTags = [document.head.getElementsByTagName("link")];
    suggestionsPane.style.left = protonEditor.offsetLeft;
    suggestionsPane.style.top = protonEditor.offsetTop + 20;
    document.head.innerHTML = `<link rel="stylesheet" href="Source/ProtonStyling/Proton.css">`;
    linksTags.forEach((linkTag) => {
      document.head.append(linkTag);
    });
    const lineCountElement = document.getElementById("Ph-line-count");
    const editor = protonEditor;
    lineCountElement.innerHTML = "1.<br>";
    editor.innerHTML +=
      '<div class="line" id="line-1" contenteditable><br></div>';
    new Tokenizer(editor, lineCountElement, lineCountStr, count, braceCount);
    
    document.getElementById("runCode").addEventListener("click", () => {
      runCode();
    });

    console.log = function (...values) {
      let output = "";
      values.forEach((value) => {
        output += value + " ";
      });
      return (logs += `<p>${output}</p>`);
    };

    document.getElementById("showOptions").addEventListener("click", () => {
      const toggler = new Toggler();
      toggler.toggleSlide("options", "top", 0.6);
      toggler.toggleClass("linStr1", "linStr1", "slopeStr1");
      toggler.toggleClass("linStr2", "linStr2", "slopeStr2");
    });

    document.getElementById("save").addEventListener("click", () => {
      consoleStarter = document.getElementById("consoleStartPointer").value;
      document.getElementById(
        "console"
      ).innerHTML = `<p class="console-starter">${consoleStarter} </p>`;
      editor.style.fontFamily = `'${
        document.getElementById("font").value
      }', monospace`;
    });

    function runCode() {
      document
        .getElementsByClassName("console-starter")
        [
          document.getElementsByClassName("console-starter").length - 1
        ].setAttribute("contenteditable", "false");
      let output = "";
      try {
        let result = new Function(`"use strict";\n${editor.innerText}`);
        output = console.log(result());
        protonConsole.innerHTML += output.replace("undefined", "");
        document.getElementsByClassName("console-starter")[
          document.getElementsByClassName("console-starter").length - 1
        ].innerHTML += "code successfully executed!";
        protonConsole.innerHTML += `<p class="console-starter" contenteditable="true">${consoleStarter} </p>`;
      } catch (error) {
        output = `${error.stack
          .split("at")
          .join("<br>at")
          .split("(")
          .join(`<br>(`)}`;
        document.getElementsByClassName("console-starter")[
          document.getElementsByClassName("console-starter").length - 1
        ].innerHTML += "code execution failed!";
        document.getElementsByClassName("console-starter")[
          document.getElementsByClassName("console-starter").length - 1
        ].className = 'console-error'
        protonConsole.innerHTML += `<p class="console-error">${output}</p>`;
        protonConsole.innerHTML += `<p class="console-starter" contenteditable="true">${consoleStarter} </p>`;
      }
      protonConsole.scrollTo(
        protonConsole.scrollWidth,
        protonConsole.scrollHeight
      );
      logs = "";
    }

    if (document.getElementById("ph-line-count"))
      document
        .getElementById("ph-line-count")
        .scrollTo(document.getElementById("ph-line-count").scrollHeight);
  }
}

export { Proton };
