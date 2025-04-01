const orderDataTableConfig = {
    order: [0, 'asc'],
    processing: true,
    serverSide: true,
    dom: '<"top" <"col-md-12 pr-none smp-order-table-buttons text-right"p>>' +
        '<"scroll_table"tr>' +
        '<"bottom row"<"col-md-6 pl-none"<"details"><"change"i>>' +
        '<"col-md-6 pr-none text-right"p>>',
    ajax: {
        url: `https://dev-api.humhealth.com/SuperMarketAPI/order/list`,
        type: "post",
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader("Content-type", "application/json");
        },
        data: (dataObject) => orderDataTable.getorderDataTableObject(dataObject),
        dataSrc: (jsonListResponse) => orderDataTable.displayorderList(jsonListResponse)
    },
    columns: [
        { "data": "sno", "searchable": false, "orderable": true },
        { "data": "orderName", "searchable": false, "orderable": true },
        { "data": "orderPackQuantity", "searchable": true, "orderable": true },
        { "data": "orderCategory", "searchable": true, "orderable": true },
        { "data": "orderPrice", "searchable": true, "orderable": true },
        { "data": "orderStockQuantity", "searchable": true, "orderable": true },
        { "data": "orderEffectiveDate", "searchable": false, "orderable": false },
        { "data": "action", "searchable": false, "orderable": false },
    ],
    initComplete: () => orderDataTable.initializeorderTable(),
    drawCallback: (settings) => orderDataTable.showorderListPanelSectionAfterDraw(),
};
const orderDataTable = function () {
    let orderDataTableObject;

    this.initializeorderTable = function () {
        $(".smp-order-table-buttons").prepend(`<div class="d-inline-block"><button class="smps-supermarket-order-list-download-button btn btn-success" style="margin-left:500px;">download</button></div>`);
        $(".smp-order-table-buttons").append(`<div class="d-inline-block"><button class="smps-supermarket-order-save btn btn-success" style="margin-left:30px;"> + Add order</button></div>`);
        $(".smps-supermarket-order-save").on("click", _addorderDetails);
        $(".smps-supermarket-order-list-download-button").on("click",_downloadorderList);
    };

    function _addorderDetails() {
        $("#sm_order_add_modal_id").modal("show");
    }    
        
    function _downloadorderList(){
            $.ajax({
                url: "https://dev-api.humhealth.com/SuperMarketAPI/download/orderDetails",
                type: "GET",
                xhrFields: {
                    responseType: 'blob' // Important for downloading files
                },
                success: function(response, status, xhr) {
                    // Get filename from content-disposition header
                    let filename = "order_Details.xlsx";
                    let disposition = xhr.getResponseHeader('Content-Disposition');
                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        let match = disposition.match(/filename="?([^"]+)"?/);
                        if (match && match[1]) filename = match[1];
                    }
        
                    // Create a URL for the blob
                    let blob = new Blob([response], { type: xhr.getResponseHeader('Content-Type') });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                },
                error: function(xhr, status, error) {
                    alert("Failed to download order list. Please try again.");
                    console.error("Download error:", error);
                }
            });
    } }