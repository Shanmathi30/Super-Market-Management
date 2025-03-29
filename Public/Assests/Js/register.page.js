const SELECTORS = {
    userRegisterFormId: "#smrs_customer_form",
    userRegisterFirstNameId: "#firstName",
    userRegisterMiddleNameId: "#middleName",
    userRegisterLastNameId: "#lastName",
    userRegisterEmailId:"#customer_email",
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
    userResetButtonId: "#smrs_reset_btn",
    userRegisterButtonId: "#smrs_register_btn",
    toastMessageId: "#toastBody",
    liveToastId: "#liveToast",
    userCustomerAddModalId:"#sm_customer_add_modal_id",
    togglePasswordIcon: ".toggle-password"
};

// Bootstrap Toast Function
function showToast(message) {
    let toastEl = $(SELECTORS.liveToastId);
    $(SELECTORS.toastMessageId).text(message).addClass("fw-bold text-danger");
    let toastInstance = new bootstrap.Toast(toastEl[0]); //toast class--plain JavaScript DOM element, jQuery object ($("#liveToast")) to a regular JavaScript element.
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
                    minlength: 1,
                    maxlength: 25
                },
                middleName: 
                { 
                    minlength: 1 
                },
                lastName: 
                { 
                    required: true, 
                    minlength: 1,
                    maxlength: 25
                },
                customerEmail: 
                { 
                    required: true, 
                    email: true,
                    validEmail: true
                },
                customerConfirmEmail:{
                    required:true,
                    email:true,
                    validEmail:true,
                    matchEmail:true
                },
                customerPassword: 
                { 
                    required: true, 
                    minlength: 5
                },
                customerConfirmPassword: 
                { 
                    required: true, 
                    minlength: 5,
                    matchPassword: true
                },
                customerMobileNo: 
                { 
                    required: true, 
                    minlength: 10,
                    maxlength: 16 
                },
                customerAddressLineOne:{
                    required:true
                },
                customerAddressLineTwo:{
                    required:true
                },
                customerState:{
                    required:true
                },
                customerCity: 
                { 
                    required: true 
                },
                customerPincode: 
                { 
                    required: true, 
                    digits: true, 
                    minlength: 5, 
                    maxlength: 5 
                }
            },
            messages: 
            {
                firstName: 
                { 
                    required: "First name is required.", 
                    minlength: "At least 2 characters.",
                    maxlength:"At least 10 characters."
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
                customerEmail: 
                { 
                    required: "Email is required.", 
                    email: "Enter a valid email address." 
                },
                customerConfirmEmail:{
                    required: "Email is required.", 
                },
                customerPassword: 
                { 
                    required: "Password is required.", 
                    minlength: "At least 8 characters should have uppercase,lowercase,number and special character" 
                },
                customerConfirmPassword:{
                    required: "Password is required.", 
                    minlength: "At least 8 characters should have uppercase,lowercase,number and special character"  
                },
               customerMobileNo: 
                { 
                    required: "Mobile number is required.",  
                    minlength: "Exactly 10 digits.", 
                    maxlength: "Exactly 15 digits." 
                },
               customerAddressLineOne: 
                { 
                    required: "Address Line 1 is required."
                },
                customerAddressLineTwo: 
                { 
                    required: "Address Line 2 is required."
                },
                customerState:{
                    required:"state is required"
                },
                customerCity: 
                { 
                    required: "City is required." 
                },
                customerPincode: 
                { 
                    required: "zipcode is required.", 
                    digits: "Only numbers allowed.", 
                    minlength: "Exactly 5 digits.", 
                    maxlength: "Exactly 5 digits." 
                }
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
            } else {
                $(this).next(".error-message").remove();
            }
        });
        // Apply input mask for Mobile Number: (___)-___-____
        $(SELECTORS.userRegisterMobileNo).inputmask("(999)-999-9999");
    
        // Reset Button Click - Show Confirmation Modal
        $(SELECTORS.userResetButtonId).on("click", function () {
            $("#resetConfirmationModal").modal("show");
        });
        
        // Confirm Reset - Clear Form
        $("#confirmReset").on("click", function () {
            $("#smrs_customer_form")[0].reset(); // Reset form
            $("#resetConfirmationModal").modal("hide"); // Hide modal
        });
    };

    // Register Process
    this.registerCustomer = function (event) {
        let registerButtonElement = event.currentTarget;
        let customerData = {
            firstName: $(SELECTORS.userRegisterFirstNameId).val().trim(),
            middleName: $(SELECTORS.userRegisterMiddleNameId).val().trim(),
            lastName: $(SELECTORS.userRegisterLastNameId).val().trim(),
            customerMobileNo: $(SELECTORS.userRegisterMobileNo).val().trim(),
            customerAddressLineOne:$(SELECTORS.userRegisterAddressLineOneId).val().trim(),
            customerAddressLineTwo:$(SELECTORS.userRegisterAddressLineTwoId).val().trim(),
            customerCity: $(SELECTORS.userRegisterCityId).val().trim(),
            customerState:$(SELECTORS.userRegisterStateId).val().trim(),
            customerCountry:$(SELECTORS.userRegisterCountryId).val().trim(),
            customerPincode: $(SELECTORS.userRegisterZipcodeId).val().trim(),
            customerEmail:$(SELECTORS.userRegisterEmailId).val().trim(),
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
                   if(registerButtonElement.closest(".modal"))
                    {
                        $(SELECTORS.userRegisterFormId)[0].reset();
                        $(SELECTORS.userCustomerAddModalId).modal("hide");
                        customerDataTable.initializeCustomerDataTable();
                    } 
                    else 
                    {
                        window.location.href = "login-page.html";
                    }
                   
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
        $(SELECTORS.userRegisterConfirmPasswordId).on("input",_checkConfirmPasswordValidate);
    };
    function _saveCustomerDetailsForRegisteration (event) {
        if ($(SELECTORS.userRegisterFormId).valid()) {
            registerPage.registerCustomer(event);
        }
    }
    function _handleCustomerRegisterationCancel() {
        $(SELECTORS.userRegisterFormId)[0].reset(); 
    }
    function _checkConfirmPasswordValidate() {
        if ($(this).val() !== $(SELECTORS.userRegisterPasswordId).val()) 
        {
            $(this).next(".error-message").remove();
            // $(this).after('<span class="text-danger error-message">Passwords do not match!</span>');
        } else {
            $(this).next(".error-message").remove();
        }
    }
};

const registerPage = new RegisterPage();
registerPage.validateUserInputFields();
registerPage.bindRegisterPageEvents();



   
    


