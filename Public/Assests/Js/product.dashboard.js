$(document).ready(function () {
    $("#toggleButton").click(function () {
        $("#extraCategories").slideToggle();
        $(this).text($(this).text() === "Show More" ? "Show Less" : "Show More");
    });
    $(".curated").on("click",function(){
        const urlParams = new URLSearchParams(window.location.search);
        window.location=`categories.html?isAdmin=${urlParams.get("isAdmin")}`
    })
});