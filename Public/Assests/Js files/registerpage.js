const RegisterPage = function () {

    this.registerCustomer = function () {
        const customerData = {
            firstName: $("#firstName").val().trim(),
            middleName: $("#middleName").val().trim(),
            lastName: $("#lastName").val().trim(),
            customerMobileNo: $("#mobileNo").val().trim(),
            customerAddress: $("#address").val().trim(),
            customerLocation: $("#location").val().trim(),
            customerCity: $("#city").val().trim(),
            customerPincode: $("#pincode").val().trim(),
            customerEmail: $("#email").val().trim(),
            customerPassword: $("#password").val().trim()
        };

        $.ajax({
            url: "https://dev-api.humhealth.com/SuperMarketAPI/customer/saveOrUpdate",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(customerData),
            success: function (response) {
                if (response.status === "SUCCESS") {
                    showToast("success", "Customer registered successfully!");
                    window.location.href = "login.html";
                } else {
                    showToast("Registration failed: " + response.message);
                }
            },
            error: function () {
                showToast("Error connecting to the server!");
            }
        });
    };

    this.validateUserInputFields = function () {
        $("#scf-customer-form").validate({
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
                mobileNo: { 
                    required: true, 
                    minlength: 10, 
                    maxlength: 17 
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
                email: 
                { 
                    required: true, 
                    email: true 
                },
                password: 
                { 
                    required: true, 
                    minlength: 6 
                }
            },
            messages: {
                firstName: { 
                    required: "First name is required.", 
                    minlength: "First name must be at least 2 characters long."
                },
                middleName: { 
                    minlength: "Middle name must be at least 1 character long."
                },
                lastName: { 
                    required: "Last name is required.", 
                    minlength: "Last name must be at least 2 characters long."
                },
                mobileNo: { 
                    required: "Mobile number is required.", 
                    minlength: "Mobile number must be at least 10 digits.", 
                    maxlength: "Mobile number must be at most 17 characters."
                },
                address: { 
                    required: "Address is required.", 
                    minlength: "Address must be at least 10 characters long."
                },
                location: { 
                    required: "Location is required."
                },
                city: { 
                    required: "City is required."
                },
                pincode: { 
                    required: "Pincode is required.", 
                    digits: "Only numbers are allowed.", 
                    minlength: "Pincode must be exactly 6 digits.", 
                    maxlength: "Pincode must be exactly 6 digits."
                },
                email: { 
                    required: "Email is required.", 
                    email: "Enter a valid email address."
                },
                password: { 
                    required: "Password is required.", 
                    minlength: "Password must be at least 6 characters long."
                }
            },
        });
    };

    this.bindRegisterPageEvents = function () {
        $("#scb_cancel_btn").click(function () {
            $("#scf-customer-form")[0].reset(); //trigger(used) jquery object,0->actual form element
        });
    
        // Bind click event to Register button
        $("#scb_register_btn").click(function () {
            if ($("#scf-customer-form").valid()) {
                registerPage.registerCustomer();
            } else {
                showToast("Please correct the errors before submitting.");
            }
        });
    };
    
    $(document).ready(function () {
        const defaultAvatar = "../../Public/Assets/Images/general_avatar.png"; // Check path!
        const storedAvatar = localStorage.getItem("selectedAvatar") || defaultAvatar;
    
        // Set the stored or default avatar
        $("#avatarPreview").attr("src", storedAvatar);
    
        // Open the modal when avatar is clicked
        $(".avatar-container").click(function () {
            $("#avatarModal").modal("show");
        });
    
        // Select avatar from predefined images
        $(".avatar-selection img").click(function () {
            const selectedSrc = $(this).attr("src");
            $("#avatarPreview").attr("src", selectedSrc);
            localStorage.setItem("selectedAvatar", selectedSrc);
            $("#avatarModal").modal("hide"); 
        });
    
        // Select avatar from file
        $("#chooseFile").click(function () {
            $("#avatarUpload").click();
        });
    
        $("#avatarUpload").change(function (event) {
            let reader = new FileReader();
            reader.onload = function () {
                $("#avatarPreview").attr("src", reader.result);
                localStorage.setItem("selectedAvatar", reader.result);
                $("#avatarModal").modal("hide"); 
            };
            reader.readAsDataURL(event.target.files[0]);
        });
    });
    
    // Bootstrap Toast Function
    function showToast(message) {
        $("#toastBody").text(message).addClass("fw-bold text-danger"); // Bold & Red Color
    
        let toastInstance = new bootstrap.Toast($("#liveToast")[0]);
        toastInstance.show();
    }
    
};

const registerPage = new RegisterPage();
registerPage.validateUserInputFields();
registerPage.bindRegisterPageEvents();

// const RegisterPage = function () {
//     this.registerCustomer = function () {
//         const customerData = {
//             firstName: $("#firstName").val().trim(),
//             middleName: $("#middleName").val().trim(),
//             lastName: $("#lastName").val().trim(),
            
//             customerMobileNo: $("#mobileNo").val().trim(), // Fixed field name
//         customerAddress: $("#address").val().trim(), // Fixed field name
//         customerLocation: $("#location").val().trim(), // Fixed field name
//         customerCity: $("#city").val().trim(), // Fixed field name
//         customerPincode: $("#pincode").val().trim(), // Fixed field name
//         customerEmail: $("#email").val().trim(), // Fixed field name
//         customerPassword: $("#password").val().trim() // Fixed field name
//         };

//         $.ajax({
//             url: "https://dev-api.humhealth.com/SuperMarketAPI/customer/saveOrUpdate",
//             type: "POST",
//             contentType: "application/json",
//             data: JSON.stringify(customerData),
//             success: function (response) {
//                 if (response.status === "SUCCESS") {
//                     showToast("Customer registered successfully!", "success");
//                     setTimeout(() => { window.location.href = "login.html"; }, 2000);
//                 } else {
//                     showToast("Registration failed: " + response.message, "danger");
//                 }
//             },
//             error: function (xhr, status, error) {
//                 console.error("AJAX Error: ", xhr.responseText);
//                 showToast("Error connecting to the server! " + xhr.responseText, "danger");
//             }
//         });
//     };

  
//     this.validateUserInputFields = function () {
//         $("#scf-customer-form").validate({
//             rules: {
//                 firstName: { required: true, minlength: 2 },
//                 middleName: { minlength: 1 },
//                 lastName: { required: true, minlength: 2 },
//                 mobileNo: { required: true, digits: true, minlength: 10, maxlength: 17 },
//                 address: { required: true, minlength: 10 },
//                 location: { required: true },
//                 city: { required: true },
//                 pincode: { required: true, digits: true, minlength: 6, maxlength: 6 },
//                 email: { required: true, email: true },
//                 password: { required: true, minlength: 6 }
//             },
//             messages: {
//                 firstName: { required: "First name is required.", minlength: "At least 2 characters." },
//                 lastName: { required: "Last name is required.", minlength: "At least 2 characters." },
//                 mobileNo: { required: "Mobile number is required.", minlength: "Must be at least 10 digits.", maxlength: "Max 17 characters.", digits: "Only numbers allowed." },
//                 address: { required: "Address is required.", minlength: "At least 10 characters." },
//                 pincode: { required: "Pincode is required.", digits: "Only numbers allowed.", minlength: "Must be exactly 6 digits.", maxlength: "Must be exactly 6 digits." },
//                 email: { required: "Email is required.", email: "Enter a valid email address." },
//                 password: { required: "Password is required.", minlength: "At least 6 characters." }
//             }
//         });
//     };

   
    
//     this.bindRegisterPageEvents = function () {
//         $("#scb_cancel_btn").click(function () {
//             $("#scf-customer-form")[0].reset();
//         });

//         $("#scb_register_btn").click(function () {
//             if ($("#scf-customer-form").valid()) {
//                 registerPage.registerCustomer();
//             } else {
//                 showToast("Please correct the errors before submitting.", "danger");
//             }
//         });
//     };

//     function showToast(message, type) {
//         let toastBody = $("#toastBody");
//         toastBody.text(message);
//         toastBody.removeClass("text-success text-danger").addClass(type === "success" ? "text-success" : "text-danger");
        
//         let toastInstance = new bootstrap.Toast($("#liveToast")[0]);
//         toastInstance.show();
//     }
// };

// const registerPage = new RegisterPage();
// registerPage.validateUserInputFields();
// registerPage.bindRegisterPageEvents();
