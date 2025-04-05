$(document).ready(function () {
    const customer = JSON.parse(localStorage.getItem("customer"));
    if (!customer) return;

    const userId = customer.customerId;
    const cartKey = `cart_${userId}`;
    let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
    const $cartContainer = $(".smc-cart-container");

    function renderCartItems() {
        if (cartData.length === 0) {
            $cartContainer.html(`
                <div class="empty-cart-container">
                    <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart">
                    <h4 class="text-muted">Your cart is empty</h4>
                    <button class="btn btn-success btn-continue-shopping mt-3">Continue Shopping</button>
                </div>
            `);
        } else {
            let cartHtml = `<h3 class="mb-4">Your Cart</h3><ul class="list-group mb-4">`;
            let totalPrice = 0;

            cartData.forEach((item, index) => {
                let itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;

                cartHtml += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" alt="${item.name}" class="rounded me-3" style="width: 60px; height: 60px;">
                            <div>
                                <h6 class="mb-1">${item.name}</h6>
                                <small class="text-muted">Price: ₹${item.price} x <span class="item-qty">${item.quantity}</span></small>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary decrease-qty" data-index="${index}">-</button>
                            <input type="text" class="cart-qty mx-2 text-center" value="${item.quantity}" data-index="${index}" readonly style="width: 35px;">
                            <button class="btn btn-sm btn-outline-secondary increase-qty" data-index="${index}">+</button>
                        </div>
                        <div>
                            <strong class="text-primary">₹${itemTotal}</strong>
                        </div>
                        <button class="btn btn-danger btn-sm remove-item ms-3" data-index="${index}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </li>
                `;
            });

            cartHtml += `</ul>
                <div class="d-flex justify-content-between align-items-center">
                    <h5>Total</h5>
                    <h5 class="text-success">₹${totalPrice}</h5>
                </div>
                <div class="mt-4 text-end">
                    <button class="btn btn-success btn-continue-shopping">Continue Shopping</button>
                    <button class="btn btn-primary ms-2">Proceed to Checkout</button>
                </div>
            `;

            $cartContainer.html(cartHtml);
            scrollToBottom();
        }
    }

    function scrollToBottom() {
        $('.smc-cart-container').animate({ scrollTop: $('.smc-cart-container')[0].scrollHeight }, 500);
    }

    //  Increase Quantity
    $(document).on("click", ".increase-qty", function () {
        let index = $(this).data("index");
        if (cartData[index]) {
            cartData[index].quantity += 1;
            localStorage.setItem(cartKey, JSON.stringify(cartData));
            renderCartItems();
        }
    });

    // Decrease Quantity
    $(document).on("click", ".decrease-qty", function () {
        let index = $(this).data("index");
        if (cartData[index] && cartData[index].quantity > 1) {
            cartData[index].quantity -= 1;
            localStorage.setItem(cartKey, JSON.stringify(cartData));
            renderCartItems();
        }
    });

    //  Remove Item from Cart
    $(document).on("click", ".remove-item", function () {
        let index = $(this).data("index");
        if (index !== undefined && cartData.length > index) {
            cartData.splice(index, 1);
            localStorage.setItem(cartKey, JSON.stringify(cartData));
            renderCartItems();
        }
    });

    // Continue Shopping
    $(document).on("click", ".btn-continue-shopping", function () {
        window.location.href = "categories.html";
    });

    //  Proceed to Checkout
$(document).on("click", ".btn-primary", function () {
    if (cartData.length === 0) return;

    const orderPayload = {
        orderId: null,
        customerId: userId,
        orderStatus: "NEW",
        listOfProducts: cartData.map(item => ({
            productId: item.productId,
            productQuantity: item.quantity
        }))
    };

    $.ajax({
        url: "https://dev-api.humhealth.com/SuperMarketAPI/order/saveOrUpdate",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(orderPayload),
        success: function (response) {
            if (response.status === "SUCCESS") {
                toastr.success("Order placed successfully! Order ID: " + response.data.orderId);
                localStorage.removeItem(cartKey);
                cartData = [];
                renderCartItems();
            } else {
                toastr.warning("Failed to place order. Please try again.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Order error:", error);
            toastr.error("Something went wrong while placing the order.");
        }
    });
});


    renderCartItems();
});
