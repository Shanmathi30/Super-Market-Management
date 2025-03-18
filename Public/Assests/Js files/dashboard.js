// // Get the current URL's query string
// const params = new URLSearchParams(window.location.search);

// // Get specific query parameter values
// const param1 = params.get('isAdmin');  // If the URL is like ?param1=value1

// if(param1 === "N") {
    
// }else {

// }


$(document).ready(function() {
    let username = "";

    // Check if admin is logged in (Retrieve from localStorage)
    let adminUser = JSON.parse(localStorage.getItem("admin")); // Example: { username: "Admin@gmail.com" }
    if (adminUser && adminUser.username) {
        username = adminUser.username;
        $("#userNameDisplay").text(username); // Update profile card
    } else {
        // If not admin, fetch customer username from API
        $.ajax({
            url: "https://your-api-url.com/customer/getDetails", // Replace with your actual API
            type: "GET",
            headers: { "Authorization": "Bearer your-auth-token" }, // If needed
            success: function(response) {
                if (response.status === "SUCCESS") {
                    username = response.data.customerName; // Extract from API response
                    $("#userNameDisplay").text(username); // Update profile card
                }
            },
            error: function() {
                $("#userNameDisplay").text("Guest"); // Fallback if API fails
            }
        });
    }

    // Toggle profile card when clicking the avatar
    $("#avatarIcon").on("click",function() {
        $("#profileCard").toggle();
    });

    // Close profile card when clicking outside
    $(document).click(function(event) {
        if (!$(event.target).closest("#avatarIcon, #profileCard").length) {
            $("#profileCard").hide();
        }
    });

    // Redirect to Update Profile page
    $("#updateProfileBtn").click(function() {
        window.location.href = "update-profile.html"; 
    });

    // Logout - Clear storage and redirect
    $("#logoutBtn").click(function() {
        localStorage.removeItem("admin"); // Remove admin login (if applicable)
        window.location.href = "login.html"; 
    });
});
