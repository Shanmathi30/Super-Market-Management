class SuperMarketSideNavigation extends HTMLElement {
    constructor () {
        super ();
        const clonedNode = document.getElementById("sm_supermarket_side_navigation_template").content.cloneNode(true);
        this.appendChild(clonedNode); 
    }
    connectedCallback () {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.get("isAdmin") === "N" ? $(".customer").removeClass("d-none") : $(".admin").removeClass("d-none");

        $(".product").on("click",function(){
            window.location=`product-dashboard.html?isAdmin=${urlParams.get("isAdmin")}`;
        });
        $(".feature").on("click",function(){
            window.location="dashboard.html#feature-card"
        });
        $(".dashboard").on("click",function(){
            window.location="dashboard.html"
        });
        $(".categories").on("click",function(){
            window.location="categories.html"
        });
        $(".customerListView").on("click",function(){
            window.location="customer-list-view.html"
        })

    }
}
customElements.define("supermarket-side-navigation", SuperMarketSideNavigation);

