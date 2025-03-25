const SELECTORS={

};
const productDataTableConfig = {
    order: [0, 'asc'],
    processing: true,
    serverSide: true,
    dom: '<"top" <"col-md-12 pr-none smp-product-table-buttons text-right"p>>'+
        '<"scroll_table"tr>' +
        '<"bottom row"<"col-md-6 pl-none"<"details"><"change"i>>' +
        '<"col-md-6 pr-none text-right"p>>',
    ajax:{
        url:`https://dev-api.humhealth.com/SuperMarketAPI/products/list`,
        type:"post",
        dataType:"json",
        beforeSend:function(request){
            request.setRequestHeader("Content-type","application/json");
        },
        data:(dataObject)=>productDataTable.getProductDataTableObject(dataObject),
        dataSrc:(jsonListResponse)=>productDataTable.displayProductList(jsonListResponse)
    },
    columns : [
        {"data" : "sno", "searchable": false, "orderable": true},
        {"data" : "productId", "searchable": true, "orderable": true},
        {"data" : "productName", "searchable": false, "orderable": true},
        {"data" : "productPackQuantity", "searchable": true, "orderable": true},
        {"data" : "productCategory", "searchable": true, "orderable": true},
        {"data" : "productPrice", "searchable": true, "orderable": true},
        {"data" : "productStockQuantity", "searchable": true, "orderable": true},
        {"data" : "productEffectiveDate", "searchable": false, "orderable": false},
        {"data" : "action", "searchable": false, "orderable": false},
    ],

    initComplete : () => productDataTable.initializeProductTable(), //initial load
    drawCallback : (settings) => productDataTable.showProductListPanelSectionAfterDraw(), //executes for every draw
}

const ProductDataTable= function () {

    let productDataTableObject;

    this.initializeProductTable = function () {
        $(".smp-product-table-buttons").prepend(`<div class="d-inline-block" style="width:68%;"><button class="smps-supermarket-product-save btn btn-success float-end"> + Add Product</button></div>`)

        $(".smps-supermarket-product-save").on("click", _addProductDetails);

    }

    function _addProductDetails  () {
        $("#sm_product_update_modal_id").modal("show");
    }
    this.showProductListPanelSectionAfterDraw =function () {
        $(".smc-product-edit").on("click",_editProductDetails)
        $(".smc-product-view").on("click",_viewProduct)
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
                for (const index in productListResponse.listOfproduct) {
                    if (productListResponse.listOfProduct.hasOwnProperty(index)) {
                        // Create an empty patient info array
                        let productInfo = []

                        let  { productId, productName, productPackQuantity, productCategory, productPrice, productStockQuantity, productEffectiveDate, sno } = productListResponse.listOfProduct[index];

                        productInfo["sno"] = sno;
                        productInfo["productId"] = productId;
                        productInfo["productName"] = productName;
                        productInfo["productPackQuantity"]= productPackQuantity;
                        productInfo["productCategory"]=productCategory;
                        productInfo["productPrice"]=productPrice;
                        productInfo["productStockQuantity"]=productStockQuantity;
                        productInfo["productEffectiveDate"]=productEffectiveDate;
                        productInfo["action"]= _getProductListActionIcons(productListResponse.listOfProduct[index]);

                        productList.push(productInfo);
                    }
                }
            }catch(error) {

            }
            return productList;
        }
    }

    function _getProductListActionIcons (productDetails) {
        return `<div>
                <span class="p-1 smp-product-edit" data-id="${productDetails.productId}"><i class="fa-solid fa-pen-to-square"></i></span>
                <span class="p-1 smp-product-view" data-id="${productDetails.productId}"><i class="fa-solid fa-eye"></i></span>
                <span class="p-1 smp-product-view" data-id="${productDetails.productId}"><i class="fa-solid fa-user-times"></i></span>
            </div>`
    }

    this.bindProductListEvents = function () {
        _initializeProductDataTable();

        $("#btn_submit").on("click",_drawProductTableBasedOnFilter);
        $("#btn_reset").on("click",_resetProductTableFilter);
   
    }

    function _initializeProductDataTable () {
        let pageLength =parseInt($("#product_length").val());
        if(productDataTableObject) {
            productDataTableObject.page.len(pageLength).draw();
        }
        else {
            productDataTableObject = $("#product_list_table").DataTable(productDataTableConfig)
        }
    }

    function _drawProductTableBasedOnFilter(){
        _initializeProductDataTable();
    }

    function _resetProductTableFilter(){
       $("#product_filter_id")[0].reset();
    } 

    function _editProductDetails() {
        let productId = $(this).attr("data-id");
        $.ajax({
            url: `https://dev-api.humhealth.com/SuperMarketAPI/products/view/${productId}`,
            type: 'GET',
            success: function(response) {
                if (response.status === "SUCCESS") {
                    $("#sm_product_update_form").attr("data-id", productId);
                    $('#product_name').val(response.data.productName);
                    $('#product_')
                   
                    // Store initial values
                    $("#sm_product_update_form").data("original", {
                        customerName: response.data.customerName,
                        customerEmail: response.data.customerEmail,
                        customerMobileNo: response.data.customerMobileNo
                    });
    
                    $("#updateMessage").text("").hide(); // Hide success message initially
                    $('#sm_product_update_modal_id').modal("show");
                }
            }
        });
    }

}
const productDataTable = new ProductDataTable();
productDataTable.bindProductListEvents();



