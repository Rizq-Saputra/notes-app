// Custom element Input title
class CustomInputTitle extends HTMLElement {
  constructor() {
    super();

    const container = document.createElement("div");
    container.classList.add("row", "title");

    const label = document.createElement("label");
    label.textContent = this.getAttribute("label") || "Title"; // Menggunakan nilai atribut label atau default 'Title'
    const id = this.getAttribute("id") || "inputTitle"; // Menggunakan nilai atribut label atau default 'inputTitle'

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", id);
    input.setAttribute("spellcheck", "false");
    input.setAttribute("required", "");

    container.appendChild(label);
    container.appendChild(input);

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 20px;
        }
        label {
          font-size: 18px;
          display: block;
          margin-bottom: 6px;
          color: #002575;
        }
        input {
          height: 50px;
          width: 90%;
          outline: none;
          font-size: 17px;
          padding: 0 15px;
          border-radius: 4px;
          border: 1px solid #999;
        }
        input:focus {
          box-shadow: 0 2px 4px rgba(0,0,0,0.11);
        }
      </style>
    `;
    shadowRoot.appendChild(container);

    // Event listener untuk validasi waktu nyata
    input.addEventListener("input", function () {
      if (input.validity.valueMissing) {
        input.setCustomValidity("Wajib diisi.");
      } else {
        input.setCustomValidity("");
      }
    });
  }

  // Fungsi ini dipanggil ketika atribut diubah
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "label") {
      const label = this.shadowRoot.querySelector("label");
      if (label) {
        label.textContent = newValue || "Title";
      }
    }
  }

  // Daftar nama atribut yang ingin dipantau
  static get observedAttributes() {
    return ["label"];
  }
}
customElements.define("custom-input-title", CustomInputTitle);

// Custom element Button
class CustomButton extends HTMLElement {
  constructor() {
    super();

    const button = document.createElement("button");

    // Salin atribut dari elemen custom ke elemen button
    const attributes = this.attributes;
    for (let i = 0; i < attributes.length; i++) {
      button.setAttribute(attributes[i].name, attributes[i].value);
    }

    this.appendChild(button);
  }
}
customElements.define("custom-button", CustomButton);

class CustomTextArea extends HTMLElement {
  constructor() {
    super();

    const container = document.createElement("div");
    container.classList.add("row");

    const label = document.createElement("label");
    label.textContent = this.getAttribute("label") || "Label"; // Menggunakan nilai atribut label atau default 'Label'

    const textarea = document.createElement("textarea");
    textarea.setAttribute("spellcheck", "false");
    textarea.setAttribute("required", "");

    // Atur atribut id jika disediakan dalam atribut kustom
    const id = this.getAttribute("id");
    if (id) {
      textarea.setAttribute("id", id);
    }

    container.appendChild(label);
    container.appendChild(textarea);

    const shadowRoot = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
        :host {
          display: block;
          margin-bottom: 20px;
        }
        label {
          font-size: 18px;
          display: block;
          margin-bottom: 6px;
          color: #002575;
        }
        textarea {
          height: 150px;
          width: 90%;
          outline: none;
          font-size: 17px;
          padding: 8px 15px;
          border-radius: 4px;
          border: 1px solid #999;
          resize: none;
          margin-bottom: 10px;
          font-family: 'Poppins', sans-serif;
        }
        textarea:focus {
          box-shadow: 0 2px 4px rgba(0,0,0,0.11);
        }
      `;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(container);
  }
}

customElements.define("custom-textarea", CustomTextArea);

// Custom element Footer
class CustomFooter extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
    this.updateStyle();
  }

  updateStyle() {
    this._style.textContent = `
      :host {
          background-color: #35374B;
          width: 100%;
          text-align: center;
          display: block;
      }
  
      p {
          margin: 0;
          padding: 10px;
          color:white;
      }
      `;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `  
      <p>&copy; 2024 Muhammad Rizq Saputra</p>
      `;
  }
}
customElements.define("custom-footer", CustomFooter);
