$(document).ready(function () {
    // Open "Add Product" modal
    $(document).on("click", "#openAddProductModal", function () {
        $("#addProductModal").modal("show");
    });

    // Open "Reset Confirmation" modal
    $(document).on("click", "#openResetModal", function () {
        $("#resetModal").modal("show");
    });

    // Confirm Reset and Clear Form
    $(document).on("click", "#confirmReset", function () {
        $("#productForm")[0].reset(); // Reset form fields
        $("#resetModal").modal("hide"); // Close reset confirmation modal
    });

    // Initialize Date Picker for Effective Dates
    $(".datepicker").datepicker({
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true
    });

    // Validate and Submit Form
    $(document).on("click", "#submitProduct", function () {
        let isValid = $("#productForm").valid();
        if (isValid) {
            saveProduct();
        }
    });

    // jQuery Validation
    $("#productForm").validate({
        rules: {
            productName: 
            { 
                required: true, 
                minlength: 3 
            },
            productPackQuantity: 
            { 
                required: true, 
                number: true, 
                min: 1 
            },
            productCategory: 
            { 
                required: true 
            },
            productPrice: 
            { 
                required: true, 
                number: true, 
                min: 0.1 
            },
            productStockQuantity: 
            { 
                required: true, 
                number: true, 
                min: 1 
            },
            productEffectiveDate: 
            { 
                required: true, 
                date: true 
            },
            productLastEffectiveDate: 
            { 
                required: true, 
                date: true 
            }
        },
        messages: {
            productName: 
            { 
                required: "Please enter the product name", 
                minlength: "Name must be at least 3 characters" 
            },
            productPackQuantity: 
            { 
                required: "Please enter pack quantity", number: "Enter a valid number", min: "Must be at least 1" },
            productCategory: 
            { 
                required: "Please select a category" 
            },
            productPrice: 
            { 
                required: "Please enter product price", 
                number: "Enter a valid price", 
                min: "Must be at least 0.1" 
            },
            productStockQuantity: 
            { 
                required: "Please enter stock quantity", 
                number: "Enter a valid number", min: "Must be at least 1" 
            },
            productEffectiveDate: 
            { 
                required: "Please select an effective date", 
                date: "Enter a valid date" 
            },
            productLastEffectiveDate: 
            { 
                required: "Please select a last effective date", 
                date: "Enter a valid date" 
            }
        }
    });

    // Save Product Function
    function saveProduct() {
        let productData = {
            productId: null,
            productName: $("#productName").val().trim(),
            productPackQuantity: $("#productPackQuantity").val().trim(),
            productCategory: $("#productCategory").val().trim(),
            productPrice: $("#productPrice").val().trim(),
            productStockQuantity: $("#productStockQuantity").val().trim(),
            productEffectiveDate: $("#productEffectiveDate").val().trim(),
            productLastEffectiveDate: $("#productLastEffectiveDate").val().trim()
        };

        $.ajax({
            url: "/products/saveOrUpdate",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(productData),
            dataType: "json",
            success: function (response) {
                if (response.status === "SUCCESS") {
                    $("#responseMessage").html(`<div class="alert alert-success">${response.message}</div>`);
                    $("#productForm")[0].reset(); // Reset form after successful save
                    $("#addProductModal").modal("hide"); // Close modal after successful save
                } else {
                    $("#responseMessage").html(`<div class="alert alert-danger">Error: ${response.message}</div>`);
                }
            },
            error: function () {
                $("#responseMessage").html(`<div class="alert alert-danger">Error saving product!</div>`);
            }
        });
    }
});

























// const SELECTORS = {
//     productFormId: "#productForm"
// ,
//     openAddProductModalBtn: "#openAddProductModal",
//     openResetModalBtn: "#openResetModal",
//     confirmResetBtn: "#confirmReset",
//     submitProductBtn: "#submitProduct",
//     addProductModal: "#addProductModal",
//     resetModal: "#resetModal",
//     responseMessage: "#responseMessage"
// };

// $(document).ready(function () {
//     // Open "Add Product" modal
//     $(document).on("click", SELECTORS.openAddProductModalBtn, function () {
//         $(SELECTORS.addProductModal).modal("show");
//     });

//     // Open "Reset Confirmation" modal
//     $(document).on("click", SELECTORS.openResetModalBtn, function () {
//         $(SELECTORS.resetModal).modal("show");
//     });

//     // Confirm Reset and Clear Form
//     $(document).on("click", SELECTORS.confirmResetBtn, function () {
//         $(SELECTORS.productFormId)[0].reset();
//         $(SELECTORS.resetModal).modal("hide");
//     });

//     // Initialize Date Picker
//     $(".datepicker").datepicker({
//         dateFormat: "yy-mm-dd",
//         changeMonth: true,
//         changeYear: true
//     });

//     // Validate and Submit Form
//     $(document).on("click", SELECTORS.submitProductBtn, function () {
//         if ($(SELECTORS.productFormId).valid()) {
//             saveProduct();
//         }
//     });

//     // Form Validation
//     $(SELECTORS.productFormId).validate({
//         rules: {
//             productName: { required: true, minlength: 3 },
//             productPackQuantity: { required: true, number: true, min: 1 },
//             productCategory: { required: true },
//             productPrice: { required: true, number: true, min: 0.1 },
//             productStockQuantity: { required: true, number: true, min: 1 },
//             productEffectiveDate: { required: true, date: true },
//             productLastEffectiveDate: { required: true, date: true }
//         },
//         messages: {
//             productName: { required: "Please enter the product name", minlength: "At least 3 characters" },
//             productPackQuantity: { required: "Enter pack quantity", number: "Enter a valid number", min: "Must be at least 1" },
//             productCategory: { required: "Select a category" },
//             productPrice: { required: "Enter product price", number: "Enter a valid price", min: "Must be at least 0.1" },
//             productStockQuantity: { required: "Enter stock quantity", number: "Enter a valid number", min: "Must be at least 1" },
//             productEffectiveDate: { required: "Select an effective date", date: "Enter a valid date" },
//             productLastEffectiveDate: { required: "Select a last effective date", date: "Enter a valid date" }
//         }
//     });
// });

// // Save Product Function
// function saveProduct() {
//     let productData = {
//         productId: null,
//         productName: $("#productName").val().trim(),
//         productPackQuantity: $("#productPackQuantity").val().trim(),
//         productCategory: $("#productCategory").val().trim(),
//         productPrice: $("#productPrice").val().trim(),
//         productStockQuantity: $("#productStockQuantity").val().trim(),
//         productEffectiveDate: $("#productEffectiveDate").val().trim(),
//         productLastEffectiveDate: $("#productLastEffectiveDate").val().trim()
//     };

//     $.ajax({
//         url: "/products/saveOrUpdate",
//         type: "POST",
//         contentType: "application/json",
//         data: JSON.stringify(productData),
//         dataType: "json",
//         success: function (response) {
//             if (response.status === "SUCCESS") {
//                 $(SELECTORS.responseMessage).html(`<div class="alert alert-success">${response.message}</div>`);
//                 $(SELECTORS.productFormId)[0].reset();
//                 $(SELECTORS.addProductModal).modal("hide");
//             } else {
//                 $(SELECTORS.responseMessage).html(`<div class="alert alert-danger">Error: ${response.message}</div>`);
//             }
//         },
//         error: function () {
//             $(SELECTORS.responseMessage).html(`<div class="alert alert-danger">Error saving product!</div>`);
//         }
//     });
// }
