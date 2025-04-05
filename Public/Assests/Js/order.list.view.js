const orderDataTableConfig = {
    order: [0, 'asc'],
    processing: true,
    serverSide: true,
    dom: '<"top" <"col-md-12 pr-none smo-order-table-buttons text-right"p>>'+
        '<"scroll_table"tr>' +
        '<"bottom row"<"col-md-6 pl-none"<"details"><"change"i>>' +
        '<"col-md-6 pr-none text-right"p>>',
    ajax: {
        url: `https://dev-api.humhealth.com/SuperMarketAPI/order/list`,
        type: "POST",
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader("Content-type", "application/json");
        },
        data: (dataObject) => orderDataTable.orderDataTableObject(dataObject),
        dataSrc: (jsonListResponse) => orderDataTable.displayOrderList(jsonListResponse)
    },
    columns : [
        {"data" : "sno", "searchable": false,"orderable": true},
        {"data" : "orderId", "searchable": true,"orderable": true},
        {"data" : "orderCreatedDate", "searchable": true,"orderable": true},
        {"data" : "customerName", "searchable": true,"orderable": true},
        {"data" : "orderStatus", "searchable": true,"orderable": true},
        {"data" : "action", "searchable": false, "orderable": false},

    ],
    initComplete : () => orderDataTable.initializeOrderTable(), //initial load
    drawCallback : () => orderDataTable.showOrderListPanelSectionAfterDraw(), //executes for every draw
} 
const OrderDataTable= function () {

    let orderDataTableObject;

    this.initializeOrderTable = function () {
        $(".smo-order-table-buttons").prepend(`<div class="d-inline-block" style="width:73%;"><button class="smoi-supermarket-order-invoice btn btn-success float-end">Invoice</button></div>`)
    }
    
    this.showOrderListPanelSectionAfterDraw =function () {
          // Initialize Bootstrap tooltips
        $('[data-bs-toggle="tooltip"]').tooltip(); ///regular ha naddaknum 
        $(".smo-view-single-order-customerId").on("click",_viewSingleOrderByCustomerId)
        $(".smo-view-single-order-orderId").on("click",_viewSingleOrderByOrderId)
        $(".smoi-supermarket-order-invoice").on("click",_downloadOrderInvoice)
        // $("").on("click",_updateOrderStatus)

        // function _updateOrderStatus(){
        //     $.ajax({
            
        //     url: `https://dev-api.humhealth.com/SuperMarketAPI/order/updateStatus?orderId=${orderId}&orderStatus=${orderStatus}`,
        //     type: "GET",
        //     contentType: "application/json",
        //     success: function (response) {
        //         if (response.status === "SUCCESS") {
        //             localStorage.setItem("customer", JSON.stringify({ username:username , password:password, customerId: response.data.customerId }));
        //             window.location.href = "dashboard.html?isAdmin=N";
        //         } else {
        //             showToast("Invalid Customer Credentials!");
        //         }
        //     },
        //     error: function () {
        //         showToast("Error connecting to server!");
        //     }
        // });
        // }
        function _downloadOrderInvoice() {
            let orderId = $(this).attr("data-id");
            
            if (!orderId) {
                console.error("Order ID not found");
                return;
            }
            
            $.ajax({
                url: `/order/download_invoice/${orderId}`,
                type: 'GET',
                xhrFields: {
                    responseType: 'blob' // Ensure response is treated as a file
                },
                success: function(response) {
                    let blob = new Blob([response], { type: 'application/pdf' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = `Order_Invoice_${orderId}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                },
                error: function(error) {
                    console.error("Error downloading invoice:", error);
                }
            });
        }
    }

    this.orderDataTableObject = function(dataObject) {
        const orderByColumnIndex = dataObject.order[0].column; // Sorting process
        return JSON.stringify({
            start: dataObject.start,
            length: dataObject.length || $("#order_length").val(),
            searchValue: $("#search_customer").val(),
            searchColumn: "customerId", // Updated to match requirement
            order: {
                column: dataObject.columns[orderByColumnIndex].data || "orderCreatedDate", // Defaulting to orderCreatedDate
                type: dataObject.order[0].dir // Order type asc, desc
            }
        })
    }
    

    this.displayOrderList = function(orderListResponse) {
        const orderList = [];
        if (orderListResponse.status === "SUCCESS") {
            try {
                for (const index in orderListResponse.listOfOrder) {
                    if (orderListResponse.listOfOrder.hasOwnProperty(index)) {
                        // Create an empty patient info array
                        let orderInfo = []
                        //destrucing the object
                        let  { orderId, orderCreatedDate, customerName, orderStatus,sno } = customerListResponse.listOfCustomer[index];

                        orderInfo["sno"] = sno;
                        orderInfo["orderId"] = orderId;
                        orderInfo["orderCreatedDate"] = orderCreatedDate;
                        orderInfo["customerName"]=customerName;
                        orderInfo["orderStatus"]=orderStatus;
                        orderInfo["action"]= _getOrderListActionIcons(orderListResponse.listOfOrder[index]);
                        orderList.push(orderInfo);
                    }
                }
            }catch(error) {
                console.error("Error processing order list:", error);
            }
            return orderList;
        }
    }
    
    function _getOrderListActionIcons (orderDetails) {
        return `<div>
                <span class="smc-update-order" data-id="${orderDetails.orderId}" data-bs-toggle="tooltip" title="Update Order" data-bs-placement="top">
                    <i class="fa-solid fa-pen-to-square"></i>
                </span>
                <span class="smc-update-order-status" data-id="${orderDetails.orderId}" data-bs-toggle="tooltip" title="Update Order Status" data-bs-placement="top">
                    <i class="fa-solid fa-pen-to-square"></i>
                </span>
                <span class="smc-customer-view-order-id" data-id="${orderDetails.orderId}" data-bs-toggle="tooltip" title="view order by order ID" data-bs-placement="top">
                    <i class="fa-solid fa-pen-to-square"></i>
                </span>
                <span class="p-1 smc-customer-view-customer-id" data-id="${orderDetails.orderId}" data-bs-toggle="tooltip" title="View order by Customer ID" data-bs-placement="top">
                    <i class="fas fa-expand-arrows-alt"></i>
                </span>
            </div>`
    }

    this.bindOrderListEvents = function () {
        orderDataTable.initializeOrderDataTable();
        $("#btn_submit").on("click",_drawOrderTableBasedOnFilter);
        $("#btn_reset").on("click",_resetOrderTableFilter);
    }

    this.initializeOrderDataTable = function () {
        let pageLength =parseInt($("#order_length").val());
        if(orderDataTableObject) {
            orderDataTableObject.page.len(pageLength).draw();
        }
        else {
            orderDataTableObject = $("#order_list_table").DataTable(orderDataTableConfig)
        }
    }

    function _drawOrderTableBasedOnFilter(){
        orderDataTable.initializeOrderDataTable(); //refresh
    }
        
    function _resetOrderTableFilter(){
        $("#order_filter_id")[0].reset();
    }

    function _viewSingleOrderByCustomerId(){

        let customerId = $(this).attr("data-id");
        
        $.ajax({
            url: `https://dev-api.humhealth.com/SuperMarketAPI/order/view?customerId=${customerId}`,
            type: 'GET',
            success: function(response) {
                if (response.status === "SUCCESS" && response.data) {
                    $('#view_customer_name').text(response.data.customerName);
                    $('#view_customer_address').text(response.data.customerAddress);
                    $('#view_customer_location').text(response.data.customerLocation);
                    $('#view_customer_city').text(response.data.customerCity);
                    $('#view_customer_pincode').text(response.data.customerPincode);
                    $('#view_customer_mobile').text(response.data.customerMobile);
                    
                    let ordersHtml = "";
                    response.data.orderList.forEach(order => {
                        ordersHtml += `<tr>
                            <td>${order.orderId}</td>
                            <td>${order.orderCreatedDate}</td>
                            <td>${order.orderExpectedDeliveryDate || 'N/A'}</td>
                            <td>${order.orderStatus}</td>
                            <td>$${order.orderTotal}</td>
                        </tr>`;
                    });
                    
                    $('#view_customer_orders').html(ordersHtml);
                    $('#sm_order_view_customer_modal_id').modal("show");
                }
            },
            error: function(error) {
                console.error("Error fetching orders by customer ID:", error);
            }
        });

    }

    function _viewSingleOrderByOrderId(){
        let orderId = $(this).attr("data-id");
    
        $.ajax({
            url: `https://dev-api.humhealth.com/SuperMarketAPI/order/view?orderId=${orderId}`,
            type: 'GET',
            success: function(response) {
                if (response.status === "SUCCESS" && response.data) {
                    $('#view_customer_name').text(response.data.customerName);
                    $('#view_customer_address').text(response.data.customerAddress);
                    $('#view_customer_state').text(response.data.customerState);
                    $('#view_customer_country').text(response.data.customerState);
                    $('#view_customer_city').text(response.data.customerCity);
                    $('#view_customer_pincode').text(response.data.customerPincode);
                    $('#view_customer_mobile').text(response.data.customerMobile);
                    $('#view_order_created_date').text(response.data.orderCreatedDate);
                    $('#view_order_expected_delivery_date').text(response.data.orderExpectedDeliveryDate);
                    $('#view_order_status').text(response.data.orderStatus);
                    $('#view_order_total').text(response.data.orderTotal);
                    
                    let productsHtml = "";
                    response.data.listOfProductsOrdered.forEach(product => {
                        productsHtml += `<tr>
                            <td>${product.orderLineProductName}</td>
                            <td>${product.orderLineProductCategory}</td>
                            <td>${product.orderLineProductQuantity}</td>
                            <td>$${product.orderLineProductPrice}</td>
                        </tr>`;
                    });
                    
                    $('#view_order_products').html(productsHtml);
                    $('#sm_order_view_modal_id').modal("show");
                }
            },
            error: function(error) {
                console.error("Error fetching order details:", error);
            }
        });
    }
 
}
const orderDataTable = new OrderDataTable();
orderDataTable.bindOrderListEvents();