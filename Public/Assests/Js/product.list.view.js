const productDataTableConfig = {
    order: [0, 'asc'],
    processing: true,
    serverSide: true,
    dom: '<"top" <"col-md-12 pr-none smp-product-table-buttons text-right"p>>' +
        '<"scroll_table"tr>' +
        '<"bottom row"<"col-md-6 pl-none"<"details"><"change"i>>' +
        '<"col-md-6 pr-none text-right"p>>',
    ajax: {
        url: `https://dev-api.humhealth.com/SuperMarketAPI/products/list`,
        type: "post",
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader("Content-type", "application/json");
        },
        data: (dataObject) => productDataTable.getProductDataTableObject(dataObject),
        dataSrc: (jsonListResponse) => productDataTable.displayProductList(jsonListResponse)
    },
    columns: [
        { "data": "sno", "searchable": false, "orderable": true },
        { "data": "productName", "searchable": false, "orderable": true },
        { "data": "productPackQuantity", "searchable": true, "orderable": true },
        { "data": "productCategory", "searchable": true, "orderable": true },
        { "data": "productPrice", "searchable": true, "orderable": true },
        { "data": "productStockQuantity", "searchable": true, "orderable": true },
        { "data": "productEffectiveDate", "searchable": false, "orderable": false },
        { "data": "action", "searchable": false, "orderable": false },
    ],
    initComplete: () => productDataTable.initializeProductTable(),
    drawCallback: (settings) => productDataTable.showProductListPanelSectionAfterDraw(),
};

const ProductDataTable = function () {
    let productDataTableObject;
    
    this.initializeProductTable = function () 
    {
        $(".smp-product-table-buttons").prepend(
            `<div class="d-inline-block">
                <button class="smps-supermarket-product-list-download-button btn btn-success" style="margin-left:500px;"><i class="fa fa-download"></i> &nbsp;&nbsp;download</button>
                <button class="smps-supermarket-product-save btn btn-success" style="margin-left:30px;"><i class="fa fa-plus"></i>&nbsp;&nbsp;Product</button>
            </div>`);
        $(".smps-supermarket-product-save").on("click", _addProductDetails);

        $(".smps-supermarket-product-list-download-button").on("click",_downloadProductList);

        // Get today's date and two year from today using Moment.js
        let today = moment().format("MM-DD-YYYY hh:mm A");
        let maxDate = moment().add(2, 'years').format("MM-DD-YYYY hh:mm A");

        // Date & Time Picker Initialization
        $(".datetimepicker").datetimepicker({
            format: "m-d-Y h:i A",  
            minDate: moment().toDate(), 
            maxDate: moment().add(1, 'years').toDate(),  
            step: 30,  
            ampm: true,  
            showButtonPanel: true
        });

        $("#sm_product_form").validate({
            rules: {
                productName: { 
                    required: true, 
                    minlength: 1,
                    maxlength: 50
                },
                productPackQuantity: { 
                    required: true,
                    number: true,
                    min: 1
                },
                productCategory: { 
                    required: true 
                },
                productPrice: { 
                    required: true, 
                    number: true, 
                    min: 0.01
                },
                productStockQuantity: { 
                    required: true, 
                    number: true, 
                    min: 0
                },
                productEffectiveDate: { 
                    required: true, 
                    date: true 
                },
                productLastEffectiveDate: { 
                    required: true, 
                    date: true,
                    greaterThan: "#product_effective_date"
                }
            },
            messages: {
                productName: { 
                    required: "Product name is required.", 
                    minlength: "At least 1 character.", 
                    maxlength: "Maximum 50 characters allowed."
                },
                productPackQuantity: { 
                    required: "Pack quantity is required.",
                    number: "Enter a valid number.",
                    min: "Must be at least 1."
                },
                productCategory: { 
                    required: "Please select a category." 
                },
                productPrice: { 
                    required: "Price is required.",
                    number: "Enter a valid number.",
                    min: "Price must be greater than 0."
                },
                productStockQuantity: { 
                    required: "Stock quantity is required.",
                    number: "Enter a valid number.",
                    min: "Stock quantity cannot be negative."
                },
                productEffectiveDate: { 
                    required: "Effective date is required.", 
                    date: "Enter a valid date." 
                },
                productLastEffectiveDate: { 
                    required: "Last effective date is required.",
                    date: "Enter a valid date.",
                    greaterThan:"Last effective date must be after the effective date."
                }
            }
        });
       
        // Custom validation: Last Effective Date should be after Effective Date
        $.validator.addMethod("greaterThan", function (value, element, param) {
            let startDate = $(param).val();
            return moment(value, "MM-DD-YYYY hh:mm A").isAfter(moment(startDate, "MM-DD-YYYY hh:mm A"));
        }, "Last Effective Date must be after the Effective Date.");

        // Add dollar symbol before price input
        $("#product_price").before("<span class='input-group-text'>$</span>");
    };

    function _addProductDetails() {
        $("#sm_product_add_modal_id").modal("show");
    }    
    
    $("#sm_product_details_update").on("click", function () {
        if("#sm_product_form").valid(){
            let productData = {
                productId: null,
                productName: $("#product_name").val().trim(),
                productPackQuantity: $("#product_pack_quantity").val().trim(),
                productCategory: $("#product_category").val().trim(),
                productPrice: $("#product_price").val().trim(),
                productStockQuantity: $("#product_stock_quantity").val().trim(),
                productEffectiveDate: $("#product_effective_date").val().trim(),
                productLastEffectiveDate: $("#product_last_effective_date").val().trim()
            };
                                        
            $.ajax({
                url: "https://dev-api.humhealth.com/SuperMarketAPI/products/saveOrUpdate",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(productData),
                dataType: "json",
                success: function (response) {
                    if (response.status === "SUCCESS") {
                        alert(response.message); // Show success message
                        $("#sm_product_add_modal_id").modal("hide"); // Close modal after success
                        $("#product_list_table").DataTable().ajax.reload(); // Reload product list
                    } else {
                        alert("Error: " + response.message);
                    }
                },
                error: function () {
                    alert("An error occurred while adding the product.");
                }
            });
            }
        })
     
    this.showProductListPanelSectionAfterDraw = function () {
        $(".smp-product-edit").on("click", _editProductDetails);
        $(".smp-product-view").on("click", _viewProduct);
    }

    this.getProductDataTableObject = function(dataObject){
        const orderByColumnIndex = dataObject.order[0].column;          
        return JSON.stringify({
                start: dataObject.start,
                length: dataObject.length || $("#product_length").val(),
                searchValue : $("#search_product").val(),
                searchColumn : "productName",
                order : 
                {
                    column: dataObject.columns[orderByColumnIndex].data,
                    type: dataObject.order[0].dir
                },
                productFilterModel:
                {
                    productCategory:' ',
                }
        })
    }
    this.displayProductList = function(productListResponse) {
        const productList = [];
            if (productListResponse.status === "SUCCESS") {
                try {
                    for (const index in productListResponse.listOfProducts) {
                        if (productListResponse.listOfProducts.hasOwnProperty(index)) {
                            // Create an empty patient info array
                            let productInfo = []
        
                            let  { productId, productName, productPackQuantity, productCategory, productPrice, productStockQuantity, productEffectiveDate, sNo } = productListResponse.listOfProducts[index];
        
                            productInfo["sno"] = sNo;
                            productInfo["productName"] = productName;
                            productInfo["productPackQuantity"]= productPackQuantity;
                            productInfo["productCategory"]=productCategory;
                            productInfo["productPrice"]=productPrice;
                            productInfo["productStockQuantity"]=productStockQuantity;
                            productInfo["productEffectiveDate"]=productEffectiveDate;
                            productInfo["action"]= _getProductListActionIcons(productListResponse.listOfProducts[index]);
                            productList.push(productInfo);
                            }
                        }
                    }catch(error) {
                        console.error("Error processing product list:", error);
                    }
                    return productList;
                }
            }

    function _getProductListActionIcons(productDetails) {
        return `<div>
                    <span class="p-1 smp-product-edit" data-id="${productDetails.productId}"><i class="fa-solid fa-pen-to-square"></i></span>
                    <span class="p-1 smp-product-view" data-id="${productDetails.productId}"><i class="fa-solid fa-eye"></i></span>
                    <span class="p-1 smp-product-active-deactive" data-id="${productDetails.productId}"><i class="fa fa-user-plus"></i></span>
                </div>`;
    }

    this.bindProductListEvents = function () {
        _initializeProductDataTable();
        $("#btn_submit").on("click", _drawProductTableBasedOnFilter);
        $("#btn_reset").on("click", _resetProductTableFilter);
    };

    function _initializeProductDataTable() {
        let pageLength = parseInt($("#product_length").val());
        if (productDataTableObject) {
            productDataTableObject.page.len(pageLength).draw();
        } else {
            productDataTableObject = $("#product_list_table").DataTable(productDataTableConfig);
        }
    }

    function _drawProductTableBasedOnFilter() {
        _initializeProductDataTable();
    }

    function _resetProductTableFilter() {
        $("#product_filter_id")[0].reset();
    }
    function _viewProduct(){
        
    }
    function _downloadProductList(){

    }
    function _editProductDetails() {
        let productId = $(this).attr("data-id");
        $.ajax({
            url: `https://dev-api.humhealth.com/SuperMarketAPI/products/view/${productId}`,
            type: 'GET',
            success: function (response) {
                if (response.status === "SUCCESS") {
                    $("#sm_product_update_form").attr("data-id", productId);
                    $('#product_name').val(response.data.productName);
                    $('#product_pack_quantity').val(response.data.productPackQuantity);
                    $('#product_category').val(response.data.productCategory);
                    $('#product_price').val(response.data.productPrice);
                    $('#product_stock_quantity').val(response.data.productStockQuantity);
                    $('#product_effective_date').val(moment(response.data.productEffectiveDate, "MM-DD-YYYY hh:mm a").format("MM-DD-YYYY hh:mm a"));
                    $('#product_last_effective_date').val(moment(response.data.productLastEffectiveDate, "MM-DD-YYYY hh:mm a").format("MM-DD-YYYY hh:mm a"));
                    $("#sm_product_update_modal_id").modal("show");
                }
            },
            error: function () {
                console.error("Error fetching product details");dr
            }
        });
    }
};

const productDataTable = new ProductDataTable();
productDataTable.bindProductListEvents();

