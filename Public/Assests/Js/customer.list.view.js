const customerDataTableConfig = {
    order: [0, 'asc'],
    processing: true,
    serverSide: true,
    dom: '<"top" <"col-md-12 pr-none smc-customer-table-buttons text-right"p>>'+
        '<"scroll_table"tr>' +
        '<"bottom row"<"col-md-6 pl-none"<"details"><"change"i>>' +
        '<"col-md-6 pr-none text-right"p>>',
    ajax: {
        url: `https://dev-api.humhealth.com/SuperMarketAPI/customer/list`,
        type: "POST",
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader("Content-type", "application/json");
        },
        data: (dataObject) => customerDataTable.customerDataTableObject(dataObject),
        dataSrc: (jsonListResponse) => customerDataTable.displayCustomerList(jsonListResponse)
    },
    columns : [
        {"data" : "sno", "searchable": false,"orderable": true},
        {"data" : "customerName", "searchable": true,"orderable": true},
        {"data" : "customerAddress", "searchable": false,"orderable": true},
        {"data" : "customerEmail", "searchable": true,"orderable": true},
        {"data" : "customerMobileNo", "searchable": false,"orderable": true},
        {"data" : "action", "searchable": false, "orderable": false},
    ],
    initComplete : () => customerDataTable.initializeCustomerTable(), //initial load
    drawCallback : () => customerDataTable.showCustomerListPanelSectionAfterDraw(), //executes for every draw
} 
const CustomerDataTable= function () {

    let customerDataTableObject;

    this.initializeCustomerTable = function () {
        $(".smc-customer-table-buttons").prepend(`<div class="d-inline-block" style="width:73%; padding:2px"><button class="smcr-supermarket-customer-register btn btn-success float-end">+ customer</button></div>`)

        $(".smcr-supermarket-customer-register").on("click",_viewCustomerRegister);

        $("#sm_customer_details_update").on("click", _updateCustomerDetails);
        
        $("#sm_customer_update_modal_id").on("hidden.bs.modal",_hideErrorMessageInModal);
    }

    function _updateCustomerDetails() { 
        let customerId = $("#sm_customer_update_form").attr("data-id");
    
        if (!customerId) {
            $("#updateMessage").text("Error: Customer ID is missing!").css("color", "red");
            return; // Stop execution
        }
    
        // Construct request payload with additional fields
        let requestData = {
            customerId: customerId,
            firstName: $("#update_customer_first_name").val().trim(),  // New field
            middleName: $("#update_customer_middle_name").val().trim(), // New field
            lastName: $("#update_customer_last_name").val().trim(),  // New field
            customerMobileNumber: $("#update_customer_mobileNo").val().trim(),
            customerEmail: $("#update_customer_email").val().trim(),
            password: $("#update_customer_password").val().trim() // New field
        };
    
        $.ajax({
            url: "https://dev-api.humhealth.com/SuperMarketAPI/customer/update-customer",
            type: "POST",
            data: JSON.stringify(requestData),
            dataType: "json",
            contentType: "application/json",
            success: function(response) {
                if (response.status === "SUCCESS") {
                    $("#sm_customer_update_modal_id").modal("hide"); // Close modal
                    customerDataTableObject.ajax.reload(); // Reload table
                    $("#updateMessage").text("Customer details updated successfully!")
                                       .css("color", "green").show();
                } else {
                    $("#updateMessage").text(response.message || "Update failed!").css("color", "red").show();
                }
            },
            error: function(error) {
                $("#updateMessage").text("An error occurred: " + error.responseText).css("color", "red").show();
            }
        });
    }
    
    this.showCustomerListPanelSectionAfterDraw =function () {
          // Initialize Bootstrap tooltips
        $('[data-bs-toggle="tooltip"]').tooltip(); ///regukar ha naddaknum 
        $(".smc-customer-edit").on("click",_editCustomerDetails)
        $(".smc-customer-view").on("click",_viewCustomerDetails)
    }

    this.customerDataTableObject = function(dataObject){
        const orderByColumnIndex = dataObject.order[0].column; //sorting process 
        return JSON.stringify({
                start: dataObject.start,
                length: dataObject.length || $("#customer_length").val(),
                searchValue : $("#search_customer").val(),
                searchColumn : "customerName",
                order : 
                {
                    column: dataObject.columns[orderByColumnIndex].data,
                    type: dataObject.order[0].dir //order type asc,des
                },
                customerFilterModel:
                {
                    customerCity:'',
                }
        })
    }

    this.displayCustomerList = function(customerListResponse) {
        const customerList = [];
        if (customerListResponse.status === "SUCCESS") {
            try {
                for (const index in customerListResponse.listOfCustomer) {
                    if (customerListResponse.listOfCustomer.hasOwnProperty(index)) {
                        // Create an empty patient info array
                        let customerInfo = []
                        //destrucing the object
                        let  { customerId, customerName, customerAddress, customerLocation, customerCity, customerPincode, customerEmail, customerMobileNo, sno } = customerListResponse.listOfCustomer[index];

                        customerInfo["sno"] = sno;
                        customerInfo["customerName"] = customerName;
                        customerInfo["customerAddress"] = customerAddress;
                        customerInfo["customerLocation"]=customerLocation;
                        customerInfo["customerCity"]=customerCity;
                        customerInfo["customerPincode"]=customerPincode;
                        customerInfo["customerEmail"]=customerEmail;
                        customerInfo["customerMobileNo"]=customerMobileNo;
                        customerInfo["action"]= _getCustomerListActionIcons(customerListResponse.listOfCustomer[index]);
                        customerList.push(customerInfo);
                    }
                }
            }catch(error) {
                console.error("Error processing product list:", error);
            }
            return customerList;
        }
    }
    
    function _getCustomerListActionIcons (customerDetails) {
        return `<div>
                <span class="smc-customer-edit" data-id="${customerDetails.customerId}" data-bs-toggle="tooltip" title="Edit Customer" data-bs-placement="top">
                    <i class="fa-solid fa-pen-to-square"></i>
                </span>
                <span class="p-1 smc-customer-view" data-id="${customerDetails.customerId}" data-bs-toggle="tooltip" title="View Customer" data-bs-placement="top">
                    <i class="fa-solid fa-eye"></i>
                </span>
            </div>`
    }

    this.bindCustomerListEvents = function () {
        customerDataTable.initializeCustomerDataTable();
        $("#btn_submit").on("click",_drawCustomerTableBasedOnFilter);
        $("#btn_reset").on("click",_resetCustomerTableFilter);
    }

    this.initializeCustomerDataTable = function () {
        let pageLength =parseInt($("#customer_length").val());
        if(customerDataTableObject) {
            customerDataTableObject.page.len(pageLength).draw();
        }
        else {
            customerDataTableObject = $("#customer_list_table").DataTable(customerDataTableConfig)
        }
    }

    function _drawCustomerTableBasedOnFilter(){
        customerDataTable.initializeCustomerDataTable(); //refresh
    }
        
    function _resetCustomerTableFilter(){
        $("#customer_filter_id")[0].reset();
    }

    function _hideErrorMessageInModal() {
        $("#updateMessage").text("").hide();
    }

    function _viewCustomerRegister(){
        $('#sm_customer_add_modal_id').modal("show");   
    }
    
    function _editCustomerDetails() {
        let customerId = $(this).attr("data-id");
        $.ajax({
            url: `https://dev-api.humhealth.com/SuperMarketAPI/customer/view/${customerId}`,
            type: 'GET',
            success: function(response) {
                if (response.status === "SUCCESS") {
                    $("#sm_customer_update_form").attr("data-id", customerId);
                    $('#update_customer_first_name').val(response.data.customerFirstName);
                    $('#update_customer_middle_name').val(response.data.customerMiddleName);
                    $('#update_customer_last_name').val(response.data.customerLastName);
                    $('#update_customer_name').val(response.data.customerFullName); // Updated to use full name
                    $('#update_customer_email').val(response.data.customerEmail); 
                    $('#update_customer_mobileNo').val(response.data.customerMobileNo);
                    $('#sm_customer_update_modal_id').modal("show");
                }
            },
            error: function () {
                console.error("Error fetching customer details");
            }
        });
    }
    
    function _viewCustomerDetails() {
        let customerId = $(this).attr("data-id");
        $.ajax({
            url: `https://dev-api.humhealth.com/SuperMarketAPI/customer/view/${customerId}`,
            type: 'GET',
            success: function(response) {
                if (response.status === "SUCCESS" && response.data) {
                    $('#view_name').text(response.data.customerFullName);
                    $('#view_email').text(response.data.customerEmail);
                    $('#view_mobile').text(response.data.customerMobileNo);
                    $('#view_address').text(response.data.customerAddress);
                    $('#view_city').text(response.data.customerCity);
                    $('#view_state').text(response.data.customerState);
                    $('#view_country').text(response.data.customerCountry);
                    $('#view_pincode').text(response.data.customerPincode);
                    $('#sm_customer_view_modal_id').modal("show");
                }
            },
            error: function(error) {
                console.error("Error fetching customer details:", error);
            }
        });
    }
}
const customerDataTable = new CustomerDataTable();
customerDataTable.bindCustomerListEvents();

