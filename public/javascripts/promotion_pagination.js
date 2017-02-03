// init bootpag
$('#pager').bootpag({
    total: Math.ceil($("#totalRecords").val()/$("#size").val()),
    page : 1,
    maxVisible : 10,
    href: "#page-{{number}}",
}).on("page", function(event, /* page number here */ num) {
    populateTable(num);

});

var template = "<form action='/areas/vendors' method='get'>" +
                    "<textarea style='display:none;' name='vendorName'>vendor_Name</textarea>"+
                    "<button type='submit' class='list-group-item'>"+
                        "<div class='media'>" +
                            "<div class='media-left'>"+
                                "<img class='media-object' width='100' height='100' src='http://localhost:3000/uploads/image'  >"+
                            "</div>"+
                            "<div class='media-body'>"+
                                "<h3 class='media-heading'>vendor_name</h3>"+
                                "<h4>活動名稱:activity_name</h4>"+
                                "<h4>日期:date</h4>"+
                                "<h4>content</h4>"+
                            "</div>"+
                        "</div>"+
                    "</button>"+
                "</form>";

var populateTable = function (page) {
    var html = '';
    $.getJSON('/promotion/getData?page='+page+'&size='+ $("#size").val(), function(data){
        data = data.data;
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            html += template.replace('vendor_name', d.vendor_name)
                .replace('vendor_Name',d.vendor_name)
                .replace('activity_name', d.activity_name)
                .replace('image', d.image)
                .replace('date', d.start_time+" ~ "+d.end_time)
                .replace('content', d.content);
        }
        $('.list-group').html(html);
    });
};

// load first page data
populateTable(1);