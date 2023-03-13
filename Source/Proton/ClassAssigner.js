"use strict";
import { JSTOKENS } from "../LangTokens/JSTOKENS.js";

class ClassAssigner {
  Assign(editor, changedData, tokens, symbols, braceCount) {
    const JsTokens = new JSTOKENS();
    const keywords = JsTokens.keywords;
    const inbuilt = JsTokens.inBuilt;
    const operators = JsTokens.operators;
    const types = JsTokens.types;

    let children = [...editor.childNodes];
    const autoFormat = document.getElementById("autoformat").checked;
    tokens = tokens.filter((token) => token !== "");
    const spansHolder = document.createElement("div");
    for (let k = 0; k < tokens.length; k++) {
      const token = tokens[k];
      const span = document.createElement("span");
      children = children.filter((el) => el.className.includes("line"));
      if (symbols.test(token) || (/["'`]/).test(token)) {
        if (token.includes('"') || token.includes("'") || token.includes("`")) {
          span.className = "string";
        } else if (
          token.includes("/") &&
          (tokens[k + 1].includes("*") || tokens[k + 1].includes("/"))
        ) {
          span.className = "comment";
        } else {
          if (operators.includes(token.trim())) {
            span.className = "operator";
          } else {
            span.className = "symbol";
          }
        }
      } else {
        if (keywords.includes(token.trim())) {
          span.className = "keyword";
        } else if (symbols.test(token.trim())) {
          if (operators.includes(token.trim())) {
            span.className = "operator";
          } else {
            span.className = "symbol";
          }
        } else if (!isNaN(token.trim())) {
          span.className = "number";
        } else {
          if (tokens[k + 1] !== undefined && tokens[k + 1].includes("(")) {
            span.className = "function";
          } else if (types.includes(token.trim())) {
            span.className = "type";
          } else if (inbuilt.includes(token.trim())) {
            span.className = "inbuilt";
          } else span.className = "text";
        }
      }
      span.innerText = token;
      spansHolder.appendChild(span);
    }

    if (changedData === " ") {
      children[children.length - 1].innerHTML = spansHolder.innerHTML;
    } else if (
      changedData.data === null &&
      changedData.inputType === "insertParagraph"
    ) {
      children[children.length - 2].innerHTML = spansHolder.innerHTML;
    } else {
      children[children.length - 1].innerHTML = spansHolder.innerHTML;
    }

    if (autoFormat) {
      if (changedData.data === "}") {
        const firstBraceChilds = [];
        const indents = editor.lastChild.getElementsByTagName("span");
        let loopSize = braceCount * 2;
        if (braceCount == 0) {
          loopSize = 2;
        }
        for (let h = 0; h < loopSize; h++) {
          firstBraceChilds.push(indents[h]);
        }
        firstBraceChilds.forEach((firstBraceChild) => {
          firstBraceChild.remove();
        });
      }
    }
    this.setEndOfContenteditable(changedData.target.lastChild);
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
  }

  openSuggestions(tokenTemp, suggestionsPane) {
    suggestionsPane.innerHTML = "";
    suggestionsPane.visibility = "hidden";
    let suggestions = [];
    const JsTokens = new JSTOKENS();
    const keywords = JsTokens.keywords;
    const inbuilt = JsTokens.inBuilt;
    const types = JsTokens.types;

    keywords.forEach((keyword) => {
      if (keyword.includes(tokenTemp)) {
        suggestions.push(`${keyword}-keyword`);
      }
    });
    inbuilt.forEach((inbuilt) => {
      if (inbuilt.includes(tokenTemp)) {
        suggestions.push(`${inbuilt}-inbuilt`);
      }
    });
    types.forEach((type) => {
      if (type.includes(tokenTemp)) {
        suggestions.push(`${type}-type`);
      }
    });

    suggestions.forEach((suggestion) => {
      const suggestionButton = document.createElement("button");
      suggestionButton.innerText = suggestion.split("-")[0];
      suggestionButton.className = "suggestions-list";
      suggestionButton.addEventListener("click", () => {
        document.getElementById("Proton-editor").lastChild.lastChild.innerText =
          suggestionButton.innerText;
        document.getElementById("Proton-editor").lastChild.lastChild.className =
          suggestion.split("-")[1];
        suggestions = [];
        suggestionsPane.style.display = "none";
        document.getElementById("Proton-editor").focus();
        this.setEndOfContenteditable(document.getElementById("Proton-editor"));
      });
      suggestionsPane.appendChild(suggestionButton);
    });

    suggestionsPane.style.display = "grid";
    suggestionsPane.style.left =
      document.getElementById("Proton-editor").lastChild.lastChild.offsetLeft;
    suggestionsPane.style.top =
      document.getElementById("Proton-editor").lastChild.lastChild.offsetTop +
      20;
  }
}

export { ClassAssigner };
