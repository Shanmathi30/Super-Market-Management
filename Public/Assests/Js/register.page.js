const SELECTORS = {
    userRegisterFormId: "#smrs_customer_form",
    userRegisterFirstNameId: "#firstName",
    userRegisterMiddleNameId: "#middleName",
    userRegisterLastNameId: "#lastName",
    userRegisterMobileNo: "#mobileNo",
    userRegisterAddressId: "#address",
    userRegisterLocationId: "#location",
    userRegisterCityId: "#city",
    userRegisterPincodeId: "#pincode",
    userRegisterEmailId: "#customer_email",
    userRegisterPasswordId: "#customer_password",
    userCancelButtonId: "#smrs_cancel_btn",
    userRegisterButtonId: "#smrs_register_btn",
    toastMessageId: "#toastBody",
    liveToastId: "#liveToast"
};

// Bootstrap Toast Function
function showToast(message) {
    let toastEl = $(SELECTORS.liveToastId);
    $(SELECTORS.toastMessageId).text(message).addClass("fw-bold text-danger");
    let toastInstance = new bootstrap.Toast(toastEl[0]);
    toastInstance.show();
}

const RegisterPage = function () {
    // Validation function
    this.validateUserInputFields = function () {
        $(SELECTORS.userRegisterFormId).validate({
            rules: {
                firstName: 
                { 
                    required: true, 
                    minlength: 2 
                },
                middleName: 
                { 
                    minlength: 1 
                },
                lastName: 
                { 
                    required: true, 
                    minlength: 2 
                },
                mobileNo: 
                { 
                    required: true, 
                    digits: true, 
                    minlength: 10,
                    maxlength: 10 
                },
                address: 
                { 
                    required: true, 
                    minlength: 10 
                },
                location: 
                { 
                    required: true 
                },
                city: 
                { 
                    required: true 
                },
                pincode: 
                { 
                    required: true, 
                    digits: true, 
                    minlength: 6, 
                    maxlength: 6 
                },
                customer_email: 
                { 
                    required: true, 
                    email: true 
                },
                customer_password: 
                { 
                    required: true, 
                    minlength: 6 
                }
            },
            messages: 
            {
                firstName: 
                { 
                    required: "First name is required.", 
                    minlength: "At least 2 characters." 
                },
                middleName: 
                { 
                    minlength: "At least 1 character." 
                },
                lastName: 
                { 
                    required: "Last name is required.", 
                    minlength: "At least 2 characters." 
                },
                mobileNo: 
                { 
                    required: "Mobile number is required.", 
                    digits: "Only digits allowed.", 
                    minlength: "Exactly 10 digits.", 
                    maxlength: "Exactly 10 digits." 
                },
                address: 
                { 
                    required: "Address is required.", 
                    minlength: "At least 10 characters." 
                },
                location: 
                { 
                    required: "Location is required." 
                },
                city: 
                { 
                    required: "City is required." 
                },
                pincode: 
                { 
                    required: "Pincode is required.", 
                    digits: "Only numbers allowed.", 
                    minlength: "Exactly 6 digits.", 
                    maxlength: "Exactly 6 digits." 
                },
                customer_email: 
                { 
                    required: "Email is required.", 
                    email: "Enter a valid email address." 
                },
                customer_password: 
                { 
                    required: "Password is required.", 
                    minlength: "At least 6 characters." 
                }
            }
        });
    };

    // Register Process
    this.registerCustomer = function () {
        let customerData = {
            firstName: $(SELECTORS.userRegisterFirstNameId).val().trim(),
            middleName: $(SELECTORS.userRegisterMiddleNameId).val().trim(),
            lastName: $(SELECTORS.userRegisterLastNameId).val().trim(),
            customerMobileNo: $(SELECTORS.userRegisterMobileNo).val().trim(),
            customerAddress: $(SELECTORS.userRegisterAddressId).val().trim(),
            customerLocation: $(SELECTORS.userRegisterLocationId).val().trim(),
            customerCity: $(SELECTORS.userRegisterCityId).val().trim(),
            customerPincode: $(SELECTORS.userRegisterPincodeId).val().trim(),
            customerEmail: $(SELECTORS.userRegisterEmailId).val().trim(),
            customerPassword: $(SELECTORS.userRegisterPasswordId).val().trim()
        };

        $.ajax({
            url: "https://dev-api.humhealth.com/SuperMarketAPI/customer/saveOrUpdate",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(customerData),
            success: function (response) {
                if (response.status === "SUCCESS") {
                    showToast("Customer registered successfully!");
                    window.location.href = "login-page.html";
                } else {
                    showToast("Registration failed: " + `${response.message ? response.message : "Failed to register"}`);
                }
            },
            error: function () {
                showToast("Error connecting to the server!");
            }
        });
    };

    // Event Binding
    this.bindRegisterPageEvents = function () {
        $(SELECTORS.userCancelButtonId).on("click",_handleCustomerRegisterationCancel);
        $(SELECTORS.userRegisterButtonId).on("click", _saveCustomerDetailsForRegisteration);
    };
    function _saveCustomerDetailsForRegisteration () {
        if ($(SELECTORS.userRegisterFormId).valid()) {
            registerPage.registerCustomer();
        }
    }
    function _handleCustomerRegisterationCancel() {
        $(SELECTORS.userRegisterFormId)[0].reset(); 
    }
};

const registerPage = new RegisterPage();
registerPage.validateUserInputFields();
registerPage.bindRegisterPageEvents();

   
    


