$(document).ready(function () {
    $("#toggleButton").click(function () {
        $("#extraCategories").slideToggle();
        $(this).text($(this).text() === "Show More" ? "Show Less" : "Show More");
    });
});