class SuperMarketTopNavigation extends HTMLElement {
    constructor() {
        super();
        const clonedNode = document.getElementById("sm_supermarket_top_navigation_template").content.cloneNode(true);
        this.appendChild(clonedNode);
    }

    connectedCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        let isAdmin = urlParams.get("isAdmin") === "Y";
        let userDetails = isAdmin ? JSON.parse(localStorage.getItem("admin")) : JSON.parse(localStorage.getItem("customer"));

        if (isAdmin) {
            $(".cart-container").hide();
        } else {
            loadCartItems();
        }

        // Open Cart Offcanvas on Click
        $(".cart-container").on("click", function () {
            if (!isAdmin) {
                let cartOffcanvasEl = document.getElementById("cartOffcanvas");
                let cartOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartOffcanvasEl);
                cartOffcanvas.show();
            }
        });

        // Close Offcanvas with Close Button
        $(".btn-close").on("click", function () {
            let cartOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById("cartOffcanvas"));
            if (cartOffcanvas) {
                cartOffcanvas.hide();
            }
        });

        function loadCartItems() {
            let userDetails = JSON.parse(localStorage.getItem("customer"));
            if (!userDetails) return;

            let userId = userDetails.customerId;
            let cartKey = `cart_${userId}`;
            let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
            let cartPreviewContent = $("#cartPreviewContent");

            if (cartData.length === 0) {
                cartPreviewContent.html(`
                    <div class="text-center empty-cart p-4">
                        <img src="../../../Public/Assests/Images/cart-icon.png" alt="Empty Cart" class="img-fluid mb-3" style="max-width: 150px;">
                        <p class="text-muted">Your cart is empty</p>
                        <button class="btn btn-success btn-start-shopping">Start Shopping</button>
                    </div>
                `);
            } else {
                let cartHtml = `<ul class="list-group">`;
                cartData.forEach((item, index) => {
                    cartHtml += `
                        <li class="list-group-item d-flex justify-content-between align-items-center cart-item">
                            <div class="d-flex align-items-center">
                                <img src="${item.image}" alt="${item.name}" class="cart-item-img rounded">
                                <span class="ms-3 fw-bold">${item.name}</span>
                            </div>
                            <div class="cart-controls d-flex align-items-center">
                                <b class="cart-price text-primary fs-6">₹${item.price * item.quantity}</b>
                                <div class="qty-controls ms-3 d-flex">
                                    <button class="btn btn-sm btn-outline-secondary decrease-qty" data-index="${index}">-</button>
                                    <input type="text" class="cart-qty mx-2 text-center" value="${item.quantity}" data-index="${index}" readonly style="width: 35px;">
                                    <button class="btn btn-sm btn-outline-secondary increase-qty" data-index="${index}">+</button>
                                </div>
                                <button class="btn btn-danger btn-sm remove-item ms-3" data-index="${index}">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </li>
                    `;
                });
                cartHtml += `</ul>`;
                cartPreviewContent.html(cartHtml);
            }

            updateCartBadge(userId);
        }

        function updateCartBadge(userId) {
            let cartKey = `cart_${userId}`;
            let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
            let totalItems = cartData.reduce((total, item) => total + item.quantity, 0);
            $(".cart-badge").text(totalItems);
        }

        //  Click handler for "Start Shopping"
        $(document).on("click", ".btn-start-shopping", function () {
            window.location.href = "categories.html"; // Replace with your actual categories page
        });

        // Event Delegation for Dynamic Elements
        $(document).on("click", ".increase-qty", function () {
            let index = $(this).data("index");
            let userDetails = JSON.parse(localStorage.getItem("customer"));
            let userId = userDetails.customerId;
            let cartKey = `cart_${userId}`;
            let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];

            if (cartData[index]) {
                cartData[index].quantity += 1;
                localStorage.setItem(cartKey, JSON.stringify(cartData));
                loadCartItems();
            }
        });

        $(document).on("click", ".decrease-qty", function () {
            let index = $(this).data("index");
            let userDetails = JSON.parse(localStorage.getItem("customer"));
            let userId = userDetails.customerId;
            let cartKey = `cart_${userId}`;
            let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];

            if (cartData[index] && cartData[index].quantity > 1) {
                cartData[index].quantity -= 1;
                localStorage.setItem(cartKey, JSON.stringify(cartData));
                loadCartItems();
            }
        });

        $(document).on("click", ".remove-item", function () {
            let userDetails = JSON.parse(localStorage.getItem("customer"));
            if (!userDetails) return;

            let userId = userDetails.customerId;
            let cartKey = `cart_${userId}`;
            let cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
            let itemIndex = $(this).data("index");

            if (itemIndex !== undefined && cartData.length > itemIndex) {
                cartData.splice(itemIndex, 1);
                localStorage.setItem(cartKey, JSON.stringify(cartData));
                loadCartItems();
            }
        });

        // Avatar toggle
        $("#avatarIcon").on("click", function () {
            $("#profileCard").toggle();
            $("#profileCard").find(".user-name").text(`${userDetails.username}`);
        });       
    }
}

customElements.define("supermarket-top-navigation", SuperMarketTopNavigation);
