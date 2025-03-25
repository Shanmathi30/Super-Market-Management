const SELECTORS={

};
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
        {"data" : "sno", "searchable": false, "orderable": true},
        {"data" : "customerName", "searchable": true, "orderable": true},
        {"data" : "customerAddress", "searchable": false, "orderable": true},
        {"data" : "customerLocation", "searchable": true, "orderable": true},
        {"data" : "customerCity", "searchable": true, "orderable": true},
        {"data" : "customerPincode", "searchable": true, "orderable": true},
        {"data" : "customerEmail", "searchable": true, "orderable": true},
        {"data" : "customerMobileNo", "searchable": false, "orderable": false},
        {"data" : "action", "searchable": false, "orderable": false},
    ],

    initComplete : () => customerDataTable.initializeCustomerTable(), //initial load
    drawCallback : (settings) => customerDataTable.showCustomerListPanelSectionAfterDraw(), //executes for every draw
} 
const CustomerDataTable= function () {

    let customerDataTableObject;

    this.initializeCustomerTable = function () {
        $(".smc-customer-table-buttons").prepend(`<div class="d-inline-block" style="width:68%;"><button class="smcr-supermarket-customer-register btn btn-success float-end">Register</button></div>`)

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
    
        $.ajax({
            url: "https://dev-api.humhealth.com/SuperMarketAPI/customer/update-customer",
            type: "POST",
            data: JSON.stringify({
                customerId: customerId,  
                customerName: $("#customer_name").val(),  // Include customer name
                customerMobileNumber: $("#mobileNo").val(),
                customerEmail: $("#customer_email").val(),
            }),
            dataType: "json",
            contentType: "application/json",
            success: function(response) {
                if (response.status === "SUCCESS") {
                    $("#updateMessage").text("Customer updated successfully!").css("color", "green");
            
                    // Close modal
                    $("#sm_customer_update_modal_id").modal("hide");
    
                    // Reload table to reflect changes immediately
                    customerDataTableObject.ajax.reload(); 
                } else {
                    $("#updateMessage").text(response.message || "Update failed!").css("color", "red");
                }
            },
            error: function(error) {
                $("#updateMessage").text("An error occurred: " + error.responseText).css("color", "red");
            }
        });
        let success = true; // Simulating success response
        if (success) {
            $("#updateMessage").text("Customer details updated successfully!")
                               .css("color", "green")
                               .show();
        } else {
            $("#updateMessage").text("Failed to update customer details.")
                               .css("color", "red")
                               .show();
        }
    }

    this.showCustomerListPanelSectionAfterDraw =function () {
        $(".smc-customer-edit").on("click",_editCustomerDetails)
        $(".smc-customer-view").on("click",_viewCustomer)
    }

    this.customerDataTableObject = function(dataObject){
        const orderByColumnIndex = dataObject.order[0].column;
        return JSON.stringify({
                start: dataObject.start,
                length: dataObject.length || $("#customer_length").val(),
                searchValue : $("#search_customer").val(),
                searchColumn : "customerName",
                order : 
                {
                    column: dataObject.columns[orderByColumnIndex].data,
                    type: dataObject.order[0].dir
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

            }
            return customerList;
        }
    }
    
    function _getCustomerListActionIcons (customerDetails) {
        return `<div>
                <span class="p-1 smc-customer-edit" data-id="${customerDetails.customerId}"><i class="fa-solid fa-pen-to-square"></i></span>
                <span class="p-1 smc-customer-view" data-id="${customerDetails.customerId}"><i class="fa-solid fa-eye"></i></span>
            </div>`
    }

    this.bindCustomerListEvents = function () {
        _initializeCustomerDataTable();

        $("#btn_submit").on("click",_drawCustomerTableBasedOnFilter);
        $("#btn_reset").on("click",_resetCustomerTableFilter);
    }

    function _initializeCustomerDataTable () {
        let pageLength =parseInt($("#customer_length").val());
        if(customerDataTableObject) {
            customerDataTableObject.page.len(pageLength).draw();
        }
        else {
            customerDataTableObject = $("#customer_list_table").DataTable(customerDataTableConfig)
        }
    }

    function _drawCustomerTableBasedOnFilter(){
        _initializeCustomerDataTable();
    }

    function _resetCustomerTableFilter(){
        // $("#customer_length").val(10);
        // $("#search_customer").val("");
        // $("#search_customer_city").val("");
        $("#customer_filter_id")[0].reset();
    }

    function _hideErrorMessageInModal() {
        $("#updateMessage").text("").hide();
    }

    function _viewCustomerRegister(){
        window.location="register-page.html";
    }
    
    function _editCustomerDetails() {
        let customerId = $(this).attr("data-id");
        $.ajax({
            url: `https://dev-api.humhealth.com/SuperMarketAPI/customer/view/${customerId}`,
            type: 'GET',
            success: function(response) {
                if (response.status === "SUCCESS") {
                    $("#sm_customer_update_form").attr("data-id", customerId);
                    $('#customer_name').val(response.data.customerName);
                    $('#customer_email').val(response.data.customerEmail);
                    $('#mobileNo').val(response.data.customerMobileNo);
                    $('#customer_password').val(response.data.customPassword);
    
                    // Store initial values
                    $("#sm_customer_update_form").data("original", {
                        customerName: response.data.customerName,
                        customerEmail: response.data.customerEmail,
                        customerMobileNo: response.data.customerMobileNo
                    });
    
                    $("#updateMessage").text("").hide(); // Hide success message initially
                    $('#sm_customer_update_modal_id').modal("show");
                }
            }
        });
    }
    // Detect changes in input fields
    $("#sm_customer_update_form input").on("input", function () {
        let originalData = $("#sm_customer_update_form").data("original");
        let hasChanged = (
            $('#customer_name').val() !== originalData.customerName ||
            $('#customer_email').val() !== originalData.customerEmail ||
            $('#mobileNo').val() !== originalData.customerMobileNo
        );
        $("#updateButton").prop("disabled", !hasChanged); // Enable/Disable button
    });
    
        this.showCustomerListPanelSectionAfterDraw =function () {
            $(".smc-customer-edit").on("click",_editCustomerDetails)
            $(".smc-customer-view").on("click",_viewCustomer)
        }
    }

    function _viewCustomer(){
        let customerId = $(this).attr("data-id");
        $.ajax({
            url: `https://dev-api.humhealth.com/SuperMarketAPI/customer/view/${customerId}`,
            type: 'GET',
            success: function(response) {
                if (response.status === "SUCCESS") {
                    $('#view_name').text(response.data.customerName);
                    $('#view_email').text(response.data.customerEmail);
                    $('#view_mobile').text(response.data.customerMobileNo);
                    $('#sm_customer_view_modal_id').modal("show");
                }
            }
        });
    }

const customerDataTable = new CustomerDataTable();
customerDataTable.bindCustomerListEvents();


