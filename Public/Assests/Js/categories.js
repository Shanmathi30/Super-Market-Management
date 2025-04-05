$(document).ready(function() {
    fetchProducts();

    $('.smcs-category-item').click(function () {
        let category = $(this).attr('data-category');
        let productList = $('#product-list');
        $('#category-title').text(category);

        // Hide all products first
        $(".category").addClass("d-none");

        // Show products for the selected category
        let filteredProducts = productList.find(`div[data-product-category='${category}']`);
        if (filteredProducts.length > 0) {
            filteredProducts.removeClass("d-none");
            $('#no-products').hide(); // Hide "No items available" message
        } else {
            $('#no-products').show(); // Show "No items available" message
        }
    });

    $(document).on("click", ".add-to-cart-btn", function () {
        let productId = $(this).attr("data-id");
        let productCard = $(this).closest(".card");
        let productName = productCard.find(".card-title").text();
        let productPrice = productCard.find(".card-text b").text().replace("₹", "");
        let productImage = productCard.find(".product-image").attr("src");
        let quantity = parseInt(productCard.find(".quantity-input").val());

        let userDetails = JSON.parse(localStorage.getItem("customer"));
        if (!userDetails) {
            alert("Please log in to add items to the cart.");
            return;
        }
        
        let userId = userDetails.customerId; // Assuming customerId is stored in localStorage
        let cartKey = `cart_${userId}`;
        let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];

        // Check if product already exists in cart
        let existingProduct = cartData.find(item => item.name === productName);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cartData.push({
                name: productName,
                price: productPrice,
                image: productImage,
                // quantity: 1 
                quantity: quantity +1
            });
        }

        // Save cart data to local storage
        localStorage.setItem(cartKey, JSON.stringify(cartData));

    // Load cart count from localStorage
    updateCartBadge();

});

// Store category images
const categoryImages = {
    "Fruits And Vegetables": "../../Public/Assests/Images/fruit.jpg",
    "Staples": "../../Public/Assests/Images/staples.jpg",
    "Snacks": "../../Public/Assests/Images/snacks.jpg",
    "Beverages": "../../Public/Assests/Images/Beverages.jpg",
    "Chilled & Dairy Foods": "../../Public/Assests/Images/dairyandchillproduct.jpg",
    "Ready To Cook": "../../Public/Assests/Images/Ready To Cook.jpg",
    "Ready To Eat": "../../Public/Assests/Images/Ready To Cook.jpg",
    "Baby Care": "../../Public/Assests/Images/baby care.jpg",
    "Household": "../../Public/Assests/Images/household.jpg",
    "Feminine Care": "../../Public/Assests/Images/Feminine Care.jpg",
    "Cleaning Needs": "../../Public/Assests/Images/cleaning.jpg",
    "Personal Care": "../../Public/Assests/Images/personal care.jpg",
    "Health Care": "../../Public/Assests/Images/health care.jpg",
    "Crockeries": "../../Public/Assests/Images/Crockeries.jpg"
};

// Fetch Products
function fetchProducts() {
    $.ajax({
        url: 'https://dev-api.humhealth.com/SuperMarketAPI/products/list',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            start: "0",
            length: "100",
            searchValue: "",
            searchColumn: "",
            order: { column: "productPrice", type: "asc" },
            productFilterModel: {}
        }),
        success: function(response) {
            if (response.status === "SUCCESS") {
                let productList = $('#product-list');
                productList.empty();

                productList.append(`<div id="no-products" class="col-12 text-center text-muted mt-3" style="display: none;">
                    <p>No items available in this category.</p>
                </div>`);

                response.listOfProducts.forEach(product => {
                    let productCategory = product.productCategory;
                    let categoryImage = categoryImages[productCategory] || "../../Public/Assets/Images/default.jpg";

                    productList.append(`
                        <div class="col-md-4 category d-none" data-product-category="${productCategory}">
                            <div class="card mb-4">
                                <img src="${categoryImage}" alt="${productCategory}" class="product-image">
                                <div class="card-body">
                                    <h5 class="card-title">${product.productName}</h5>
                                    <p class="card-text">Price: <b>₹${product.productPrice}</b></p>
                                    <p class="card-text">Stock: <span class="text-danger">${product.productStockQuantity}</span></p>
                                    <p class="card-text">Pack: ${product.productPackQuantity}</p>

                                    <div class="quantity-container">
                                        <button class="quantity-btn decrease-qty">-</button>
                                        <input type="text" class="quantity-input" value="1" readonly>
                                        <button class="quantity-btn increase-qty">+</button>
                                    </div>

                                    <button class="add-to-cart-btn mt-3" 
                                        data-id="${product.productId}" 
                                        data-name="${product.productName}" 
                                        data-price="${product.productPrice}" 
                                        data-image="${categoryImage}">
                                         Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    `);
                });

                // Quantity Increment & Decrement
                $('.increase-qty').click(function() {
                    let qtyInput = $(this).siblings('.quantity-input');
                    let qty = parseInt(qtyInput.val());
                    qtyInput.val(qty + 1);
                });

                $('.decrease-qty').click(function() {
                    let qtyInput = $(this).siblings('.quantity-input');
                    let qty = parseInt(qtyInput.val());
                    if (qty > 1) {
                        qtyInput.val(qty - 1);
                    }
                });

                // Add to Cart Event ----function (success)
                $('.add-to-cart-btn').click(function() {
                    let productId = $(this).attr("data-id");
                    let productName = $(this).attr("data-name");
                    let productPrice = $(this).attr("data-price");
                    let productImage = $(this).attr("data-image");
                    let quantity = parseInt($(this).siblings('.quantity-container').find('.quantity-input').val());

                    addToCart(productId, productName, productPrice, productImage, quantity);
                });
            }
        },
        error: function(err) {
            console.error("Error fetching products", err);
        }
    });
}

// Function to add item to cart
function addToCart(id, name, price, image, quantity) {
    let cart = JSON.parse(localStorage.getItem(`cart`)) || [];

    let existingProduct = cart.find(item => item.id === id);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ id, name, price, image, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
    updateCartPreview();
}

// Function to update cart badge count
function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    $(".cart-badge").text(totalItems);
}

// Function to update cart preview
function updateCartPreview() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartPreview = $("#cartPreview");
    let cartHTML = "";

    if (cart.length > 0) {
        cartHTML += `<ul class="list-group">`;
        cart.forEach(item => {
            cartHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <img src="${item.image}" alt="${item.name}" width="40">
                    <span>${item.name} (x${item.quantity})</span>
                    <b>₹${item.price * item.quantity}</b>
                </li>`;
        });
        cartHTML += `</ul>`;
    } else {
        cartHTML = `<p>You have no items in your shopping cart</p>`;
    }
    cartPreview.html(cartHTML);
}

function updateCartBadge(userId) {
        const cartKey = `cart_${userId}`;
        const cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
        const totalItems = cartData.reduce((total, item) => total + item.quantity, 0);
        $(".cart-badge").text(totalItems);
    }

    function loadCartBadge() {
        const userDetails = JSON.parse(localStorage.getItem("customer"));
        if (userDetails) {
            updateCartBadge(userDetails.customerId);
        }
    }

    loadCartBadge(); // Load cart count on page refresh
});





