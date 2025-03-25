class SuperMarketCustomerInformation extends HTMLElement{
    constructor(){
        super();
        const clonedNode=document.getElementById("sm_supermarket_customer_information_template").
        content.cloneNode(true);
        this.appendChild(clonedNode);
    }

    connectedCallback(){

    }    
}
customElements.define("supermarket-customer-information",SuperMarketCustomerInformation);