class SuperMarketNavigation extends HTMLElement {
    constructor () {
        super ();
        const clonedNode = document.getElementById("sm_supermarket_navigation_template").content.cloneNode(true);
        this.appendChild(clonedNode); 
    }
    connectedCallback () {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.get("isAdmin") === "N" ? $(".customer").removeClass("d-none") : $(".admin").removeClass("d-none");
        $(".product").on("click",function(){
            window.location="productdashboard.html";
        });
        $(".feature").on("click",function(){
            window.location="dashboard.html#feature-card"
        });
        $(".dashboard").on("click",function(){
            window.location="dashboard.html"
        })
        
    }
}
customElements.define("supermarket-navigation", SuperMarketNavigation);

