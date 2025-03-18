class SuperMarketNavigation extends HTMLElement {
    constructor () {
        super ();
        const clonedNode = document.getElementById("sm_supermarket_navigation_template").content.cloneNode(true);
        this.appendChild(clonedNode); 
    }
    connectedCallback () {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.get("isAdmin") === "N" ? $(".customer").removeClass("d-none") : $(".admin").removeClass("d-none");
    }
}
customElements.define("supermarket-navigation", SuperMarketNavigation);

