$(document).ready(function () {
    $("#toggleButton").click(function () {
        $("#extraCategories").slideToggle();
        $(this).text($(this).text() === "Show More" ? "Show Less" : "Show More");
    });
    $(".curated").on("click",function(){
        window.location="categories.html"
    });
    $(".fruits-vegetables").on("click",function(){
        window.location="categories.html#fruits_vegetables"
    });
    $(".crockeries").on("click",function(){
        window.location="categories.html#crockeries"
    });
});