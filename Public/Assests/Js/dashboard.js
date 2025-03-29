$(document).ready(function() {
    // Toggle profile card when clicking the avatar
    $("#avatarIcon").on("click",function() {
        $("#profileCard").toggle();
    });

    // Close profile card when clicking outside
    $(document).on("click",function(event) {
        if (!$(event.target).closest("#avatarIcon, #profileCard").length) {
            $("#profileCard").hide();
        }
    });

    // Logout - Clear storage and redirect
    $("#logout_button").on("click",function() {
        window.location= "login-page.html"; 
    });

});
