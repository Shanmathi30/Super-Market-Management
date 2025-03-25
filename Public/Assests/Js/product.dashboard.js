$(document).ready(function () {
    $("#toggleButton").click(function () {
        $("#extraCategories").slideToggle();
        $(this).text($(this).text() === "Show More" ? "Show Less" : "Show More");
    });
    $(".curated").on("click",function(){
        const urlParams = new URLSearchParams(window.location.search);
        let targetLocation =  urlParams.get("isAdmin") === "Y" ? "product-list-view.html" : "categories.html";
        window.location=targetLocation;
    }) 
});