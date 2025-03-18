class SuperMarketTopNavigation extends HTMLElement{
    constructor(){
        super();
        const clonedNode=document.getElementById("sm_supermarket_topnavigation_template").
        content.cloneNode(true);
        this.appendChild(clonedNode);
    }

    connectedcallback(){
        $("#avatarIcon").on("click",function() {
            $("#profileCard").toggle();
        });
    }    
}
customElements.define("supermarket-topnavigation", SuperMarketTopNavigation);
