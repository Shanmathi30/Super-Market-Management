const customerListViewDataTableConfig={
    order:[0,'asc'],
    processing:true,
    serverside:true,
    dom:'<"top" <"col-md-12 pr-none>'+'<scroll_table"tr>'+'<"col-md-6 pr-none text-right"p>>',
    ajax:{
        url:'/listorview',
        type:"post",
        dataType:"json",
        beforeSend:function(request){
            request.setRequestHeader("content-type","appliaction/json");
        },
        data:(dataObject)=>Document,
        datasrc:(jsonRequest)=>document,
    },
    columns : [
        {"data" : "sno", "searchable": false, "orderable": true, "visible": true},
        {"data" : "name","searchable":false,"orderable":true,"visible":true},
        {"data" : "email", "searchable":false,"orderable":true,"visible":true},
        {"data" : "location","searchable":false,"orderable":true,"visible":true},
        {"data" : "address","searchable":false,"orderable":true,"visible":true},
        {"data" : "city","searchable":false,"orderable":true,"visible":true},
        {"data" : "pincode","searchable":false,"orderable":true,"visible":true},
        {"data" : "","searchable":false,"orderable":true,"visible":true}
    ]
}