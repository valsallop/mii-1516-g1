var arr = new ReactiveArray();
var arrDateSales = new ReactiveArray();
var arrDatePopu = new ReactiveArray();


function eliminateDuplicates(array) {
    var flags = [], output = [], l = array.length, i;
    for( i=0; i<l; i++) {
        if( flags[array[i].dataPopu.name]) continue;
        flags[array[i].dataPopu.name] = true;
        output.push(array[i]);
    }
    return output;
}

function sumarDias(fecha,days){
    milisegundos=parseInt(35*24*60*60*1000);
    tiempo=fecha.getTime();
    milisegundos=parseInt(days*24*60*60*1000);
    fecha.setTime(tiempo+milisegundos);
    day=fecha.getDate();
    month=fecha.getMonth()+1;
    year=fecha.getFullYear();
    total = "'"+month+"/"+day+"/"+year+"'";
    return total;
}


Template.productsSelect.helpers({
  listProducts: function(){
    var arr2 = eliminateDuplicates(arr);
    var len = arr2.length;
    arr.clear();

    for (var i=0;i<len;i++){
        arr.push(arr2[i]);
    }
    if(arr.length>0){
        document.getElementById("charts").disabled = false;
    }
    if(arr.length == 1){
        document.getElementById("report").disabled = false;
    };
    
    return arr.list();
  }
});

AdminProductsPages = new Meteor.Pagination(Products, {
    itemTemplate: "productAdmin",
    templateName: "proSocialNet",
    perPage: 10
});

Template.productAdmin.events({

    'click .showProduct': function(event, template){
        
        var datestart = document.getElementById("start").value;
        var dateend = document.getElementById("end").value;
        
        if(datestart =="" || dateend == ""){
            var t=TAPi18n.__("toastr_needDate", lang_tag=null);
            alert(t);
            //toastr.error(t);
        }else{
            var str = this.name;
            var nameProduct = str.slice(0,10)+"...";
            var dataProduct = [];

            //Transform to ISODate
            var d1 = new Date('"'+datestart+'"');
            var d2 = new Date('"'+dateend+'"');
            var d3 = new Date(sumarDias(new Date('"'+datestart+'"'),1));
            var timeDiff = Math.abs(d2.getTime() - d1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
            var e = new Date(d2.toISOString());
            var s = new Date(d1.toISOString());
            var dataSales = [];

            for(var i = 1;i<=diffDays;i++){
                arrDateSales.push(i);
                var sum = new Date('"'+sumarDias(d1,1)+'"');
                var sum2 = new Date('"'+sumarDias(d3,1)+'"');
                var s1 = new Date(sum.toISOString());
                var e1 = new Date(sum2.toISOString());
                
                dataSales.push(ShoppingCarts.find({active:false,paymentDate: {$gte: s1,$lt: e1},items:{$elemMatch: {productCode: this.code}}}).count());
            };

            HTTP.call( 'POST', 'http://localhost:4242/analytics/trending', {
              data: {
                "code": this.code,
                "ts_init": s,
                "ts_end": e
              }
            }, function( error, response ) {
              if ( error ) {
                console.log( error );
              } else {
                console.log( response );
                var len = response.data.trending.length;
                for(var i=0;i<len;i++){
                    dataProduct.push(response.data.trending[i].mentions);
                    arrDatePopu.push(new Date(response.data.trending[i].ts).toString());
                }
              }
            });        
            var dataRepo = {code:this.code,name:this.name,description:this.description};
            var dataPopu = {name:nameProduct,data:dataProduct};
            var dataSales = {name:nameProduct,data:dataSales};
            var product = {dataRepo:dataRepo,dataPopu:dataPopu,dataSales:dataSales};
            arr.push(product);

            if(arr.length != 0){
                document.getElementById("start").disabled = true;
                document.getElementById("end").disabled = true;
            };
            if(arr.length != 1){
                document.getElementById("report").disabled = true;
            };
            if(arr.length == 0){
                document.getElementById("charts").disabled = true;
            };
        }
    },

});

Template.proSocialNet.events({
    'click .showPopu': function(){
        var datestart = document.getElementById("start").value;
        var dateend = document.getElementById("end").value;
        if(datestart =="" || dateend == ""){
            var t=TAPi18n.__("toastr_needDate", lang_tag=null);
            alert(t);
            //toastr.error(t);
        }else{
            var dataS = [];
            var dataP = [];
            for(var i = 0;i<arr.length;i++){
                dataS[i] =arr[i].dataSales;
                dataP[i] =arr[i].dataPopu;
            }
            drawChart(dataS,dataP); 
        }
    },
    'click .downloadPDF': function(){
        var datestart = document.getElementById("start").value;
        var dateend = document.getElementById("end").value;
        if(datestart =="" || dateend == ""){
            var t=TAPi18n.__("toastr_needDate", lang_tag=null);
            alert(t);
            //toastr.error(t);
        }if(document.getElementById("highcharts-0") == null){
            var t=TAPi18n.__("toastr_firstButton", lang_tag=null);
            alert(t);
        }else{
            var datestart = document.getElementById("start").value;
            var dateend = document.getElementById("end").value;
            
            var doc = new jsPDF();
        
            var chartHeight = 80;
            doc.setFontSize(18);
            
            var lines = doc.splitTextToSize("Reports: "+arr[0].dataRepo.name, 130);

            doc.text(35, 40, lines);

            doc.setFontSize(12);
            doc.text(35, 85, "Dates start: " + datestart);
            doc.text(35, 95, "Dates end: " + dateend);

            doc.text(35, 105, "Code: " + arr[0].dataRepo.code);

            var lines2 = doc.splitTextToSize("Description: " + arr[0].dataRepo.description, 130);
            doc.text(35, 115, lines2);


            var canvas = document.createElement('canvas');
            var svg = document.getElementById("highcharts-0").innerHTML;

            canvg(canvas, svg);
            var img = canvas.toDataURL("image/png");
            doc.addImage(img, 'JPEG',  45, 170, 120, chartHeight);
            
            
            
            //save with name
            doc.save('report.pdf');
            
        }
    }
});

Template.productsSelect.events({
    'click .listExRemove': function() {
        
        arr.remove(this);
        if(arr.length == 0){
            document.getElementById("start").disabled = false;
            document.getElementById("end").disabled = false;
            document.getElementById("charts").disabled = true;
            document.getElementById("report").disabled = true;
        };
        if(arr.length == 1){
            document.getElementById("report").disabled = false;
        };
        if(arr.length > 0){
            document.getElementById("charts").disabled = false;
        };
        
    }
});

function drawChart(array1, array2) {
    
    $('#salesChart').highcharts({
        title: {
            text: 'Comparative',
            x: -20 //center
        },
        xAxis: {
            categories: arrDateSales
        },
        yAxis: {
            title: {
                text: 'Sales'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: 'sales'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: array1
    });

    $('#populChart').highcharts({
        title: {
            text: 'Comparative',
            x: -20 //center
        },
        xAxis: {
            categories: arrDatePopu
        },
        yAxis: {
            title: {
                text: 'Popularity'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ''
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: array2
    });

    
}

Template.proSocialNet.rendered = function(){
 Deps.autorun(function () { drawChart(); canvas();});
}

Template.proSocialNet.rendered = function() {
    $('#datetimepickerStart').datetimepicker();
    $('#datetimepickerEnd').datetimepicker({
            useCurrent: false //Important! See issue #1075
    });
    $("#datetimepickerStart").on("dp.change", function (e) {
        $('#datetimepickerEnd').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepickerEnd").on("dp.change", function (e) {
        $('#datetimepickerStart').data("DateTimePicker").maxDate(e.date);
    });
}