$(document).ready(function() {
    // Toggle profile card when clicking the avatar
    $("#avatarIcon").on("click", function() {
        $("#profileCard").toggle();
    });

    // Close profile card when clicking outside
    $(document).on("click", function(event) {
        if (!$(event.target).closest("#avatarIcon, #profileCard").length) {
            $("#profileCard").hide();
        }
    });

    // Logout function
    $(document).on("click", "#logout_button", function() {
        // Show the logout toast message
        let toastElement = document.getElementById("logoutToast");
        let toast = new bootstrap.Toast(toastElement);
        toastElement.style.top = "80px";  // Ensure proper positioning
        toast.show();

        // Redirect after 2 seconds
        setTimeout(function() {
            window.location = "login-page.html";
        }, 2000);
    });
});

