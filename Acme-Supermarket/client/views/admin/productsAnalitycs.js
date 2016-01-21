Template.productsAnalitycs.helpers({
  products: function() {
    return Products.find();
  }
});
AdminProductsPages = new Meteor.Pagination(Products, {
    itemTemplate: "productAdmin",
    templateName: "productsAnalitycs",
    perPage: 10
});

Template.productAdmin.events({

    'click .showProduct': function(){
        var dataProduct = [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6];
        var dataDay = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        drawChart("producto",dataProduct,dataDay);
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
    },
  
});

function drawChart(namepro, datapro, dataday) {
    $('#container').highcharts({
        title: {
            text: namepro,
            x: -20 //center
        },
        xAxis: {
            categories: dataday
        },
        yAxis: {
            title: {
                text: 'Ventas'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: namepro,
            data: datapro
        }]
    });
}

Template.productsAnalitycs.rendered = function(){ Deps.autorun(function () { drawChart(); }); };