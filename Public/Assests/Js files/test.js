$(document).ready(function () {
    let categories = [
        { name: "Fruits & Vegetables", img: "fruits.jpg" },
        { name: "Staples", img: "staples.jpg" },
        { name: "Snacks", img: "snacks.jpg" },
        { name: "Beverages", img: "beverages.jpg" },
        { name: "Dairy & Chilled", img: "dairy.jpg" },
        { name: "Ready to Cook", img: "readytocook.jpg" },
        { name: "Cleaning Needs", img: "cleaning.jpg" },
        { name: "Health Care", img: "healthcare.jpg" },
        { name: "Skin Care", img: "skincare.jpg" },
        { name: "Oral Care", img: "oralcare.jpg" },
        { name: "Crockeries", img: "crockeries.jpg" }
    ];

    let categoryHTML = "";
    categories.forEach(cat => {
        categoryHTML += `
            <div class="col-md-3">
                <div class="card card-category shadow-sm">
                    <img src="assets/${cat.img}" class="card-img-top" alt="${cat.name}">
                    <div class="card-body">
                        <h6 class="card-title">${cat.name}</h6>
                    </div>
                </div>
            </div>
        `;
    });

    $("#categoryList").html(categoryHTML);

    // Scroll to Top Button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $("#scrollTopBtn").fadeIn();
        } else {
            $("#scrollTopBtn").fadeOut();
        }
    });

    $("#scrollTopBtn").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });
});
