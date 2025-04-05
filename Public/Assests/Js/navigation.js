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
            // window.location="product-dashboard.html"
        });
        $(".feature").on("click",function(){
            window.location=`dashboard.html?isAdmin=${urlParams.get("isAdmin")}#feature-card`
        });
        $(".dashboard").on("click",function(){
            window.location=`dashboard.html?isAdmin=${urlParams.get("isAdmin")}`
        });
        $(".categories").on("click",function(){
            window.location=`categories.html?isAdmin=${urlParams.get("isAdmin")}`
        });
        $(".customerListView").on("click",function(){
            window.location=`customer-list-view.html?isAdmin=${urlParams.get("isAdmin")}`
        });
        $(".productListView").on("click",function(){
            window.location=`product-list-view.html?isAdmin=${urlParams.get("isAdmin")}`
        });
        $(".orderListView").on("click",function(){
            window.location=`order-list-view.html?isAdmin=${urlParams.get("isAdmin")}`
        });
        $(".order").on("click",function(){
            window.location=`order.html?isAdmin=${urlParams.get("isAdmin")}`
        });
        $(".cart").on("click",function(){
            window.location=`cart.html?isAdmin=${urlParams.get("isAdmin")}`
        });
        $(".offers").on("click",function(){
            window.location=`offers.html?isAdmin=${urlParams.get("isAdmin")}`
        })
    }
}
customElements.define("supermarket-side-navigation", SuperMarketSideNavigation);

