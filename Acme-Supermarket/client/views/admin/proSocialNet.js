var arr = new ReactiveArray();
var arrS = new ReactiveArray();
var arrDateSales = new ReactiveArray();
var arrDatePopu = new ReactiveArray();


function eliminateDuplicates(arr) {
    var flags = [], output = [], l = arr.length, i;
    for( i=0; i<l; i++) {
        if( flags[arr[i].name]) continue;
        flags[arr[i].name] = true;
        output.push(arr[i]);
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
    var arr3 = eliminateDuplicates(arrS);
    arr.clear();
    arrS.clear();
    for (var i=0;i<arr2.length;i++){
        arr.push(arr2[i]);
        arrS.push(arr3[i]);
    }
    return arr.list();
  }
});

Template.productAdmin.helpers({
  control: function(){
    
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
        if(arr.length != 0){
            document.getElementById("start").disabled = true;
            document.getElementById("end").disabled = true;
        };

        
        if(datestart =="" || dateend == ""){
            console.log("entra");
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
            var productSales = {name:nameProduct,data:dataSales};
            arrS.push(productSales);

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

            var product = {name:nameProduct,data:dataProduct};
            
            arr.push(product);
            return product;
        }
        
    },
    'click .downloadPDF': function(){
    	console.log(this.name);
    	console.log(this._id);
    	console.log(this.code);
    	console.log(this.description);
    	console.log(this.image);
    	console.log(this.rating);
    	var myData = [this.name,this._id,this.code,this.description,this.image,this.rating];
    	Blaze.saveAsPDF(Template.report, {
		  filename: "report.pdf", // optional, default is "document.pdf"
		  data: myData, // optional, render the template with this data context
		  x: 0, // optional, left starting position on resulting PDF, default is 4 units
		  y: 0, // optional, top starting position on resulting PDF, default is 4 units
		  orientation: "landscape", // optional, "landscape" or "portrait" (default)
		  unit: "in", // optional, unit for coordinates, one of "pt", "mm" (default), "cm", or "in"
		  format: "a4" // optional, see Page Formats, default is "a4"
		});
    }
});

Template.proSocialNet.events({
    'click .showPopu': function(){ 
        drawChart(arr,arrS); 
    }
});

Template.productsSelect.events({
    'click .listExRemove': function() {
        arr.remove(this);
        arrS.remove(this);
        if(arr.length == 0){
            document.getElementById("start").disabled = false;
            document.getElementById("end").disabled = false;
        }
    }
});

function drawChart(arr,arrS) {
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
        series: arr
    });
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
        series: arrS
    });
}

Template.proSocialNet.rendered = function(){
 Deps.autorun(function () { drawChart(); });
}

Template.proSocialNet.rendered = function() {
    console.log("entra");
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