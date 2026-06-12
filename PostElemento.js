const templatePost = document.createElement("template");
templatePost.innerHTML = `
  <div>
    <iframe 
    src="" 
    width="400" 
    height="480">
    </iframe>

    <iframe 
      id="reproductor" 
      width="560" 
      height="315" 
      src="" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
`;


class PostElemento extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        const templateContent = templatePost.content.cloneNode(true);

        // Obtenemos el identificador "KQSnNI1QlXk" desde el HTML
        const idPost = this.getAttribute("link");

        // Le asignamos la URL de YouTube al iframe usando ese identificador
        templateContent.querySelector("#reproductor").src = `${idPost}`;

        shadow.append(templateContent);
    }
}
customElements.define("post-elemento", PostElemento);