class SuperMarketCategoriesCustomer extends HTMLElement {
    constructor () {
        super ();
        const clonedNode = document.getElementById("sm_supermarket_product_information_template").content.cloneNode(true);
        this.appendChild(clonedNode); 

        this.products = {
            fruitsVegetables: [
                { name: "Apple", price: 120, discount: 10, icon: "fas fa-apple-alt" },
                { name: "Banana", price: 60, discount: 15, icon: "fas fa-lemon" }
            ],
            staples: [
                { name: "Sugar", price: 50, discount: 10, icon: "fas fa-seedling" },
                { name: "Rice", price: 80, discount: 5, icon: "fas fa-bread-slice" }
            ],
            snacks: [
                { name: "Chips", price: 30, discount: 20, icon: "fas fa-cookie-bite" },
                { name: "Biscuits", price: 40, discount: 10, icon: "fas fa-cookie" }
            ],
            beverages: [
                { name: "Orange Juice", price: 90, discount: 12, icon: "fas fa-wine-glass" },
                { name: "Milkshake", price: 120, discount: 15, icon: "fas fa-mug-hot" }
            ],
            dairy: [
                { name: "Cheese", price: 250, discount: 8, icon: "fas fa-cheese" },
                { name: "Butter", price: 200, discount: 12, icon: "fas fa-ice-cream" }
            ],
            readyCook: [
                { name: "Frozen Paratha", price: 50, discount: 5, icon: "fas fa-hotdog" },
                { name: "Instant Noodles", price: 30, discount: 10, icon: "fas fa-bowl-rice" },
                {name:"maggi",price:14,icon:"fas fa-hotdog"}
            ],
            readyEat: [
                { name: "Pasta", price: 150, discount: 18, icon: "fas fa-pizza-slice" },
                { name: "Curry Pack", price: 100, discount: 12, icon: "fas fa-drumstick-bite" }
            ],
            babyCare: [
                { name: "Baby Wipes", price: 150, discount: 10, icon: "fas fa-baby" },
                { name: "Baby Lotion", price: 250, discount: 15, icon: "fas fa-pump-medical" }
            ],
            household: [
                { name: "Laundry Detergent", price: 200, discount: 5, icon: "fas fa-tshirt" },
                { name: "Air Freshener", price: 120, discount: 8, icon: "fas fa-spray-can" }
            ],
            feminineCare: [
                { name: "Sanitary Napkins", price: 90, discount: 12, icon: "fas fa-venus" },
                { name: "Feminine Wash", price: 180, discount: 10, icon: "fas fa-bath" }
            ],
            cleaning: [
                { name: "Toilet Cleaner", price: 140, discount: 12, icon: "fas fa-pump-soap" },
                { name: "Floor Cleaner", price: 170, discount: 10, icon: "fas fa-broom" }
            ],
            personalCare: [
                { name: "Shampoo", price: 250, discount: 15, icon: "fas fa-bath" },
                { name: "Face Wash", price: 150, discount: 10, icon: "fas fa-smile" }
            ],
            healthCare: [
                { name: "Vitamin Tablets", price: 300, discount: 20, icon: "fas fa-pills" },
                { name: "First Aid Kit", price: 500, discount: 10, icon: "fas fa-briefcase-medical" },
                {name: ""}
            ],
            crockeries: [
                { name: "Dinner Set", price: 800, discount: 18, icon: "fas fa-utensils" },
                { name: "Tea Cups", price: 250, discount: 12, icon: "fas fa-coffee" }
            ]
        };
    }
    connectedCallback () {
        this.bindCustomerCategoriesEvents();
    }

    bindCustomerCategoriesEvents () {
        $(".smcs-category-item").click(function(){
            let category = $(this).data("category");
            let categoryTitle = $(this).text();
            
            // Remove active class from all categories and add to clicked one
            $(".smcs-category-item").removeClass("active");
            $(this).addClass("active");
    
            $("#category-title").text(categoryTitle);
            $("#product-list").html(products[category]?products[category].reduce((prevElement,currentElement) => {
                let discountPrice = currentElement.price - (currentElement.price * currentElement.discount / 100);
                return `${prevElement} <div class="col-md-4">
                        <div class="product-card position-relative">
                            <span class="discount-badge">${currentElement.discount}% OFF</span>
                            <i class="${currentElement.icon} product-icon"></i>
                            <h5>${currentElement.name}</h5>
                            <p><s>₹${currentElement.price}</s> <b style="color:red;">₹${discountPrice.toFixed(0)}</b></p>
                        </div>
                    </div>`
            },"") :"")
        });
    }
}
customElements.define("supermarket-customer-categories-list",SuperMarketCategoriesCustomer);