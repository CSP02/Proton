"use strict";
import { Tokenizer } from "./Tokenizer.js";

let logs = "";
let braceCount = 0;
let consoleStarter = ">";

class Proton {
  constructor() {
    let count = 1;
    let lineCountStr = "1.<br>";
    const protonEditor = document.getElementById("ProtonWrapper");
    protonEditor.innerHTML = `
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
        <div id="console"><p class="console-starter">${consoleStarter} </p></div>
        </div>`;
    const linksTags = [document.head.getElementsByTagName("link")];
    document.getElementById("suggestions").style.left =
      document.getElementById("Proton-editor").offsetLeft;
    document.getElementById("suggestions").style.top =
      document.getElementById("Proton-editor").offsetTop + 20;
    document.head.innerHTML = `<link rel="stylesheet" href="Source/ProtonStyling/Proton.css">`;
    linksTags.forEach((linkTag) => {
      document.head.append(linkTag);
    });
    const lineCountElement = document.getElementById("Ph-line-count");
    const editor = document.getElementById("Proton-editor");
    lineCountElement.innerHTML = "1.<br>";
    editor.innerHTML +=
      '<div class="line" id="line-1" contenteditable><br></div>';
    new Tokenizer(editor, lineCountElement, lineCountStr, count, braceCount);
    document.getElementById("runCode").addEventListener("click", () => {
      document.getElementsByClassName("console-starter")[
        document.getElementsByClassName("console-starter").length - 1
      ].innerHTML += "Running your code...";
      let output = "";
      try {
        let result = new Function(`${editor.innerText}`);
        output = console.log(result());
        document.getElementById("console").innerHTML += output.replace(
          "undefined",
          ""
        );
        document.getElementById(
          "console"
        ).innerHTML += `<p class="console-starter">${consoleStarter} </p>`;
      } catch (error) {
        output = `${error.stack
          .split("at")
          .join("<br>at")
          .split("(")
          .join(`<br>(`)}`;
        document.getElementById(
          "console"
        ).innerHTML += `<p class="console-error">${output}</p>`;
        document.getElementById(
          "console"
        ).innerHTML += `<p class="console-starter">${consoleStarter} </p>`;
      }
      document
        .getElementById("console")
        .scrollTo(
          document.getElementById("console").scrollWidth,
          document.getElementById("console").scrollHeight
        );
      logs = "";
    });

    console.log = function (...values) {
        let output = ''
        values.forEach(value => {
            output += value + ' '
        })
        return logs += `<p>${output}</p>`;
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

    if (document.getElementById("ph-line-count"))
      document
        .getElementById("ph-line-count")
        .scrollTo(document.getElementById("ph-line-count").scrollHeight);
  }
}

export { Proton };
