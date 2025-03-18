$(document).ready(function () {
    $("#productForm").submit(function (event) 
    {
        event.preventDefault();

        // Collect form data
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

        this.validateUserInputFields = function () {
            $("#scf-product-save").validate({
                rules: {
                    productName: { 
                        required: true, 
                    },
                    productPackQuantity:{
                        required:true,
                        number:true
                    },
                    productCategory:{
                        required:true
                    }

                },
                messages: {
                    productName: 
                    {
                    required: "Please enter your product name"
                    },
                    productPackQuantity:
                    {
                        required:"please enter the pack quality"
                    }
                },
                submitHandler: function () {
                    registerPage.registerCustomer();
                }
            });
        // Send AJAX request
        $.ajax({
            url: "/products/saveOrUpdate",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(productData),
            dataType: "json",
            success: function (response) {
                if (response.status === "SUCCESS") {
                    $("#responseMessage").html(`<div class="alert alert-success">${response.message}</div>`);
                    $("#productForm")[0].reset();
                } else {
                    $("#responseMessage").html(`<div class="alert alert-danger">Error: ${response.message}</div>`);
                }
            },
            error: function () {
                $("#responseMessage").html(`<div class="alert alert-danger">Error saving product!!!</div>`);
            }
        });
}});
});
