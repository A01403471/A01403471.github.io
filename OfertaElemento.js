const template = document.createElement("template");
template.innerHTML = "<div><h1>Oferta: <span id='nombreOferta'></span></h1></div><input type='text' id='myInput'>";

class OfertaElemento extends HTMLElement {

    constructor() {
    super();
    const shadow = this.attachShadow({mode: "open"})
    const templateContent = template.content.cloneNode(true);
    shadow.appendChild(templateContent);
    console.log("Constructor ", this);

    this.input = shadow.querySelector("#myInput");
    this.input.addEventListener("input", (e) => this.handleInput(e));
    }

    static get observedAttributes() {
        return ["value"];
    }

    attributeChangedCallback(name, old, nw) {
        console.log('Cambió ' + name + ' de ' + old + ' a ' + nw);
        if (name === "value") {
            const span = this.shadowRoot.querySelector('#nombreOferta');
            if (span) {
                span.textContent = nw;
            }
        } 
    }

    handleInput(){
        console.log("Tecleaste...'");
        this.setAttribute("value", this.input.value);
    }

    connectedCallback() {
        const span = this.shadowRoot.querySelector('#nombreOferta');
        if (span) {
            span.textContent = this.getAttribute('nombre') || this.textContent.trim();
        }
    }

}

customElements.define("oferta-elemento", OfertaElemento);