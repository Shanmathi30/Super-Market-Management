const SELECTORS = {
    userRegisterFormId: "#smrs_customer_form",
    userRegisterFirstNameId: "#firstName",
    userRegisterMiddleNameId: "#middleName",
    userRegisterLastNameId: "#lastName",
    userRegisterEmailId: "#customer_email",
    userRegisterConfirmEmailId: "#customer_confirm_email",
    userRegisterPasswordId: "#customer_password",
    userRegisterConfirmPasswordId: "#customer_confirm_password",
    userRegisterMobileNo: "#mobileNo",
    userRegisterAddressLineOneId: "#address_line_one",
    userRegisterAddressLineTwoId: "#address_line_two",
    userRegisterCountryId: "#country",
    userRegisterCityId: "#city",
    userRegisterStateId: "#state",
    userRegisterZipcodeId: "#zipcode",
    userCancelButtonId: "#smrs_cancel_btn",
    userRegisterButtonId: "#smrs_register_btn",
    toastMessageId: "#toastBody",
    liveToastId: "#liveToast",
    userCustomerAddModalId: "#sm_customer_add_modal_id",
    togglePasswordIcon: ".toggle-password"
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
                firstName: { required: true, minlength: 2 },
                middleName: { minlength: 1 },
                lastName: { required: true, minlength: 2 },
                customerEmail: { required: true, email: true, validEmail: true },
                customerConfirmEmail: { required: true, email: true, validEmail: true, matchEmail: true },
                customerPassword: { required: true, minlength: 5 },
                customerConfirmPassword: { required: true, minlength: 5, matchPassword: true },
                customerMobileNo: { required: true, digits: true, minlength: 10, maxlength: 10 },
                customerAddressLineOne: { required: true },
                customerAddressLineTwo: { required: true },
                customerState: { required: true },
                customerCity: { required: true },
                customerPincode: { required: true, digits: true, minlength: 5, maxlength: 5 }
            },
            messages: {
                firstName: { required: "First name is required.", minlength: "At least 2 characters." },
                middleName: { minlength: "At least 1 character." },
                lastName: { required: "Last name is required.", minlength: "At least 2 characters." },
                customerEmail: { required: "Email is required.", email: "Enter a valid email address." },
                customerConfirmEmail: { required: "Confirm email is required." },
                customerPassword: { required: "Password is required.", minlength: "At least 5 characters." },
                customerConfirmPassword: { required: "Confirm password is required.", minlength: "At least 5 characters." },
                customerMobileNo: { required: "Mobile number is required.", digits: "Only digits allowed.", minlength: "Exactly 10 digits.", maxlength: "Exactly 10 digits." },
                customerAddressLineOne: { required: "Address Line 1 is required." },
                customerAddressLineTwo: { required: "Address Line 2 is required." },
                customerState: { required: "State is required." },
                customerCity: { required: "City is required." },
                customerPincode: { required: "ZIP Code is required.", digits: "Only numbers allowed.", minlength: "Exactly 5 digits.", maxlength: "Exactly 5 digits." }
            }
        });

         // Custom Email Validation Regex
    $.validator.addMethod("validEmail", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    }, "Enter a valid email address.");

    // Custom Confirm Password Validation (Immediate)
    $.validator.addMethod("matchPassword", function (value, element) {
        return value === $(SELECTORS.userRegisterPasswordId).val();
    }, "Passwords do not match.");

    // Custom Confirm Email Validation (Immediate)
    $.validator.addMethod("matchEmail", function (value, element) {
        return value === $(SELECTORS.userRegisterEmailId).val();
    }, "Emails do not match.");
    
        // Immediate validation for email & password mismatch
        $(SELECTORS.userRegisterConfirmEmailId).on("input", function () {
            if ($(this).val() !== $(SELECTORS.userRegisterEmailId).val()) {
                $(this).next(".error-message").remove();
                // $(this).after('<span class="text-danger error-message">Emails do not match!</span>');
            } else {
                $(this).next(".error-message").remove();
            }
        });

        $(SELECTORS.userRegisterConfirmPasswordId).on("input", function () {
            if ($(this).val() !== $(SELECTORS.userRegisterPasswordId).val()) {
                $(this).next(".error-message").remove();
                // $(this).after('<span class="text-danger error-message">Passwords do not match!</span>');
            } else 
            {
                $(this).next(".error-message").remove();
            }
        });
    };

    // Register Process
    this.registerCustomer = function (event) {
        let registerButtonElement = event.currentTarget;
        if (!$(SELECTORS.userRegisterFormId).valid()) return;

        let customerData = {
            firstName: $(SELECTORS.userRegisterFirstNameId).val().trim(),
            middleName: $(SELECTORS.userRegisterMiddleNameId).val().trim(),
            lastName: $(SELECTORS.userRegisterLastNameId).val().trim(),
            customerMobileNo: $(SELECTORS.userRegisterMobileNo).val().trim(),
            customerAddressLineOne: $(SELECTORS.userRegisterAddressLineOneId).val().trim(),
            customerAddressLineTwo: $(SELECTORS.userRegisterAddressLineTwoId).val().trim(),
            customerCity: $(SELECTORS.userRegisterCityId).val().trim(),
            customerState: $(SELECTORS.userRegisterStateId).val().trim(),
            customerCountry: $(SELECTORS.userRegisterCountryId).val().trim(),
            customerPincode: $(SELECTORS.userRegisterZipcodeId).val().trim(),
            customerEmail: $(SELECTORS.userRegisterEmailId).val().trim(),
            customerPassword: $(SELECTORS.userRegisterPasswordId).val().trim()
        };

        $.ajax({
            url: "https://dev-api.humhealth.com/SuperMarketAPI/customer/saveOrUpdate",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(customerData),
            success: function (response) {
                showToast(response.status === "SUCCESS" ? "Customer registered successfully!" : `Registration failed: ${response.message || "Failed to register"}`);
                if (response.status === "SUCCESS") window.location.href = "login-page.html";
            },
            error: function () { showToast("Error connecting to the server!"); }
        });
    };

    this.bindRegisterPageEvents = function () {
        $(SELECTORS.userCancelButtonId).on("click", () => $(SELECTORS.userRegisterFormId)[0].reset());
    };
};

const registerPage = new RegisterPage();
registerPage.validateUserInputFields();
registerPage.togglePasswordVisibility();
registerPage.bindRegisterPageEvents();
