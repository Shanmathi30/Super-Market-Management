const SELECTORS = {
    userLoginFormId: "#smls_login_form",
    userLoginUserNameId: "#username",
    userLoginPasswordId: "#password",
    userLoginButtonId: ".login-btn",
    userRegisterButtonClass: ".register-btn",
    toastMessageId: "#toastMessage",
    toastElementId: "#toastElement"
};

// Function to show Bootstrap toast
function showToast(message) {
    $(SELECTORS.toastMessageId).text(message);
    let toastElement = document.getElementById("toastElement");
    let toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Constructor
const LoginPage = function () {
    this.setUsersCredentialsInLocalStorage = function () {
        localStorage.setItem("admin", JSON.stringify({ username: "Admin@gmail.com", password: "Admin@123" }));
    };

    // Validation function
    this.validateUserInputFields = function () {
        $(SELECTORS.userLoginFormId).validate({
            rules: {
                username:
                {
                    required: true
                },
                password:
                {
                    required: true
                }
            },
            messages: {
                username:
                {
                    required: "Please enter your username"
                },
                password:
                {
                    required: "Please enter your password"
                }
            }
        });
    };

    // Login process
    this.processLogin = function () {
        let username = $(SELECTORS.userLoginUserNameId).val().trim();
        let password = $(SELECTORS.userLoginPasswordId).val().trim();
        let storedAdmin = JSON.parse(localStorage.getItem("admin"));

        if (storedAdmin && username === storedAdmin.username && password === storedAdmin.password) {
            window.location.href = "dashboard.html?isAdmin=Y";
            return;
        }

        // API call for customer login
        $.ajax({
            url: `https://dev-api.humhealth.com/SuperMarketAPI/customer/login?username=${username}&password=${password}`,
            type: "GET",
            contentType: "application/json",
            success: function (response) {
                if (response.status === "SUCCESS") {
                    window.location.href = "dashboard.html?isAdmin=N";
                } else {
                    showToast("Invalid Customer Credentials!");
                }
            },
            error: function () {
                showToast("Error connecting to server!");
            }
        });
    };
    
    // Event binding
    this.bindLoginPageEvents = function () {
        $(SELECTORS.userLoginButtonId).on("click",_logingToDashboard);
        $(SELECTORS.userRegisterButtonClass).on("click",_redirectingRegisterPage);
    };
    function _logingToDashboard() {
        if ($(SELECTORS.userLoginFormId).valid()) {
            loginPage.processLogin();
        } 
    }
    function _redirectingRegisterPage() {
        window.location.href = "registerpage.html";
    }
};

const loginPage = new LoginPage();
loginPage.setUsersCredentialsInLocalStorage();
loginPage.validateUserInputFields();
loginPage.bindLoginPageEvents();
