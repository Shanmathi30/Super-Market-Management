const SELECTORS = {
    productFormId: "#productForm",
    productNameId:"#productName",
    productPackQuantityId:"#productPackQuantity",
    productCategoryId:"#productCategory",
    productPriceId:"#productPrice",
    productStockQuantityId:"#productStockQuantity",
    productEffectiveDateId:"#productEffectiveDate",
    productLastEffectiveDateId:"#productLastEffectiveDate",
    showProductModalBtnId: "#openAddProductModal",
    ResetModalBtnId: "#openResetModal",
    confirmResetBtnId: "#confirmReset",
    submitProductBtnId: "#submitProduct",
    addProductModalId: "#addProductModal",
    resetModalId: "#resetModal",
    responseMessageId: "#responseMessage",
    datepickerClass:".datepicker"


};
const ProductSave= function () {
    // Validation function
    this.validateProductSaveInputFields=function () {
        $(SELECTORS.productFormId).validate({
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
    };
    this.saveProduct=function()
    {
        let productData = {
            productId: null,
            productName: $(SELECTORS.productNameId).val().trim(),
            productPackQuantity: $(SELECTORS. productPackQuantityId).val().trim(),
            productCategory: $(SELECTORS.productCategoryId).val().trim(),
            productPrice: $(SELECTORS.productPriceId).val().trim(),
            productStockQuantity: $(SELECTORSproductStockQuantityId).val().trim(),
            productEffectiveDate: $(SELECTORS.productEffectiveDateId).val().trim(),
            productLastEffectiveDate: $(SELECTORS.productLastEffectiveDateId).val().trim()
        };
        $.ajax({
            url: "https://dev-api.humhealth.com/SuperMarketAPI/products/saveOrUpdate",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(productData),
            dataType: "json",
            success: function (response) {
                if (response.status === "SUCCESS") {
                    $(SELECTORS.resetModalId).html(`<div class="alert alert-success">${response.message}</div>`);
                    $(SELECTORS.productFormId)[0].reset(); // Reset form after successful save
                    $(SELECTORS.addProductModalId).modal("hide"); // Close modal after successful save
                } else {
                    $(SELECTORS.resetModalId).html(`<div class="alert alert-danger">Error: ${response.message}</div>`);
                }
            },
            error: function () {
                $(SELECTORS.resetModalId).html(`<div class="alert alert-danger">Error saving product!</div>`);
            }
        });
    };

    //Event Binding
    this.bindProductSaveEvents=function(){
        $(SELECTORS.showProductModalBtnId).on("click",_showProductModal);
        $(SELECTORS.ResetModalBtnId).on("click",_openResetButton);
        $(SELECTORS.confirmResetBtnId).on("click",_confirmResetButton);
        $(SELECTORS.submitProductBtnId).on("click",_validatingSubmitButton);
        $(SELECTORS.datepickerClass).datepicker({
            dateFormat: "yy-mm-dd",
            changeMonth: true,
            changeYear: true
        });

        function _showProductModal(){
            $(SELECTORS.addProductModalId).modal("show");
        }        
        function _openResetButton() {
            $(SELECTORS.resetModalId).modal("show");
        }
        function _confirmResetButton() {
            $(SELECTORS.productFormId)[0].reset();
            $(SELECTORS.resetModalId).modal("hide"); 
        }
        function _validatingSubmitButton() {
            let isValid = $(SELECTORS.productFormId).valid();
            if (isValid) {
                productSave.saveProduct();
            }
        } 
    }
}
const  productSave= new ProductSave();
productSave.validateProductSaveInputFields();
productSave.bindProductSaveEvents();
