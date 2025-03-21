class SuperMarketTopNavigation extends HTMLElement{
    constructor(){
        super();
        const clonedNode=document.getElementById("sm_supermarket_topnavigation_template").
        content.cloneNode(true);
        this.appendChild(clonedNode);
    }

    connectedCallback(){
        const urlParams = new URLSearchParams(window.location.search);
        let userDetails = urlParams.get("isAdmin") === "N" ? localStorage.getItem("customer"): localStorage.getItem("admin");
        
        $(this).find("#avatarIcon").on("click",function() {
            $("#profileCard").toggle();
            
        });
    }    
}
customElements.define("supermarket-topnavigation", SuperMarketTopNavigation);
