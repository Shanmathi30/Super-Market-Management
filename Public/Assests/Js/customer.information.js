class SuperMarketCustomerInformation extends HTMLElement{
    constructor(){
        super();
        const clonedNode=document.getElementById("sm_supermarket_customer_information_template").
        content.cloneNode(true);
        this.appendChild(clonedNode);
    }

    connectedCallback(){
    // Apply input mask to Mobile Number field
    $("#mobileNo").inputmask({
        mask: "(999)-999-9999", 
        placeholder: " ",
        showMaskOnHover: false,
        showMaskOnFocus: true
    });
    
    //password and confirm password icon
    $(document).on("click", "#togglePassword", function() {
        let passwordField = $("#customer_password");
        let type = passwordField.attr("type") === "password" ? "text" : "password";
        passwordField.attr("type", type);
        $(this).toggleClass("fa-eye fa-eye-slash");
    });
    
    $(document).on("click", "#toggleConfirmPassword", function() {
        let passwordField = $("#customer_confirm_password");
        let type = passwordField.attr("type") === "password" ? "text" : "password";
        passwordField.attr("type", type);
        $(this).toggleClass("fa-eye fa-eye-slash");
    });
    }    
}
customElements.define("supermarket-customer-information",SuperMarketCustomerInformation);