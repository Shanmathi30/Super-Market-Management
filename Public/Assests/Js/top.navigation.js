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

        // Cart icon hover effect
        $(".cart-container").hover(
            function () {
                $("#cartPreview").fadeIn(); // Show cart preview on hover
            },
            function () {
                $("#cartPreview").fadeOut(); // Hide cart preview when not hovering
            }
        );

        // Cart icon click event (redirect to cart page)
        $(".cart-container").on("click", function () {
            window.location= "/cart"; // Replace with actual cart page URL
        });
    }   
}
customElements.define("supermarket-top-navigation", SuperMarketTopNavigation);



