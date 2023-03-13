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
    const settingsSvg = `
    <svg height="30" width="30">
        <line x1="5" y1="5" x2="28" y2="5" stroke-linecap="round" stroke-width="1"/>
        <circle cx="12" cy="5" r="3" stroke-width="1"/>
        <line x1="5" y1="15" x2="28" y2="15" stroke-linecap="round" stroke-width="1"/>
        <circle cx="19" cy="15" r="3" stroke-width="1"/>
        <line x1="5" y1="25" x2="28" y2="25" stroke-linecap="round" stroke-width="1"/>
        <circle cx="12" cy="25" r="3" stroke-width="1"/>
    </svg>`
    const closeSvg = `
    <svg height="30" width="30">
        <line x1="5" y1="5" x2="25" y2="25" stroke-width="1" stroke-linecap="round" stroke="white"/>
        <line x1="5" y1="25" x2="25" y2="5" stroke-width="1" stroke-linecap="round" stroke="white"/>
    </svg>`
    const runSvg = `
    <svg height="30" width="30">
    <path d="M 5 5 L 25 15 5 25" stroke-linecap="round" stroke-width="1"/>
    </svg>
    `
    protonWrapper.innerHTML = `
    <nav id="Proton-options">
    <button id="runCode" title="Run your code">${runSvg}</button>
    <button id="showOptions" title="options">${settingsSvg}</button>
    </nav>
    <div id="options" class="pr-front">
    <div id="pr-close-holder">
    <h1>Settings:</h1>
    <button id="pr-closeOptions">${closeSvg}</button></div>
    <div id="settings_holder"><h3>Editor:</h3><label for="autoformat">Auto format
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
    </div></div>
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
    const protonOptions = document.getElementById("options");
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
      protonOptions.style.display = "block";
    });

    document.getElementById("pr-closeOptions").addEventListener("click", () => {
      protonOptions.style.display = "none";
    })

    document.getElementById("save").addEventListener("click", () => {
      consoleStarter = document.getElementById("consoleStartPointer").value;
      document.getElementById(
        "console"
      ).innerHTML = `<p class="console-starter">${consoleStarter} </p>`;
      editor.style.fontFamily = `'${document.getElementById("font").value
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
        ].innerHTML += "Running...";
        protonConsole.innerHTML += `<p>code successfully executed!</p>`;
        protonConsole.innerHTML += `<p class="console-starter" contenteditable="true">${consoleStarter} </p>`;
      } catch (error) {
        output = `${error.stack
          .split("at")
          .join("<br>at")
          .split("(")
          .join(`<br>(`)}`;
        document.getElementsByClassName("console-starter")[
          document.getElementsByClassName("console-starter").length - 1
        ].className = 'console-error'
        protonConsole.innerHTML += `<p class="console-error">${output}</p>`;
        protonConsole.innerHTML += `<p class="console-error">code executed with an error!</p>`;
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

    protonEditorWrapper.addEventListener("mousedown", (e) => {
      if (e.altKey) {
        document.addEventListener("mousemove", dragProtonEditor);
        protonEditorWrapper.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", dragProtonEditor)
          protonEditorWrapper.className = "";
        })
      }
    })

    protonConsoleWrapper.addEventListener("mousedown", (e) => {
      if (e.altKey) {
        document.addEventListener("mousemove", dragProtonConsole);
        protonConsoleWrapper.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", dragProtonConsole)
          protonConsoleWrapper.className = "";
        })
      }
    })

    protonOptions.addEventListener("mousedown", (e) => {
      if (e.altKey) {
        document.addEventListener("mousemove", dragProtonOptions);
        protonOptions.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", dragProtonOptions)
          protonOptions.className = "";
        })
      }
    })

    function dragProtonEditor(event) {
      protonEditorWrapper.style.transform = `translate(
        ${event.clientX - protonEditorWrapper.offsetWidth / 2}px,
        ${event.clientY - protonEditorWrapper.offsetHeight / 2}px
        )`;
      protonEditorWrapper.className = "reposition";
    }
    function dragProtonConsole(event) {
      protonConsoleWrapper.style.transform = `translate(
        ${event.clientX - protonConsoleWrapper.offsetWidth / 2}px,
        ${event.clientY - protonConsoleWrapper.offsetTop - protonConsoleWrapper.offsetHeight / 2}px
        )`;
      protonConsoleWrapper.className = "reposition";
    }
    function dragProtonOptions(event) {
      protonOptions.style.transform = `translate(
        ${event.clientX - protonOptions.offsetWidth / 2}px,
        ${event.clientY - protonOptions.offsetTop - protonOptions.offsetHeight / 2}px
        )`;
      protonOptions.className = "reposition";
    }
  }
}

export { Proton };
