class SuperMarketTopNavigation extends HTMLElement{
    constructor(){
        super();
        const clonedNode=document.getElementById("sm_supermarket_top_navigation_template").
        content.cloneNode(true);
        this.appendChild(clonedNode);
    }

    connectedCallback(){
        const urlParams = new URLSearchParams(window.location.search);
        let userDetails = urlParams.get("isAdmin") === "N" ? JSON.parse(localStorage.getItem("customer")): JSON.parse(localStorage.getItem("admin"));

        
        $(this).find("#avatarIcon").on("click",function() {
            $("#profileCard").toggle(); 
            $("#profileCard").find(".user-name").text(`${userDetails.username}`)  
        });
    }    
}
customElements.define("supermarket-top-navigation", SuperMarketTopNavigation);



