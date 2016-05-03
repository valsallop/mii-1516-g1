Template.sentimentsTweets.events({

    'click .classTweets': function(event, template){
    	console.log('pulsas');
        HTTP.call( 'GET', 'http://localhost:31338/store.json', {}, 

        	function( error, response ) {
            if ( error ) {
              console.log( error );
            } else {
              console.log( response.content );
              var dictionary = JSON.parse(response.content);

              var data = dictionary.data;

              var arrName = []
              var arrPos = []
              var arrNeg = []

              for(var i in data){
                var dbItem = Products.findOne({code:parseInt(data[i].id)});
                arrName.push(dbItem.name);
                arrPos.push(data[i].pos);
                arrNeg.push(data[i].neg);
              }

              generateTable(arrName,arrPos,arrNeg)
            }
          });
    },

});

function generateTable(arrName,arrPos,arrNeg) {
  // Obtener la referencia del elemento body
  var body = document.getElementById("tabla");
 
  // Crea un elemento <table> y un elemento <tbody>
  var tabla   = document.createElement("table");
  var tblBody = document.createElement("tbody");
 
  // Crea las celdas
  for (var i = 0; i <= arrName.length; i++) {
    // Crea las hileras de la tabla
    var hilera = document.createElement("tr");
 
    for (var j = 0; j < 3; j++) {
      // Crea un elemento <td> y un nodo de texto, haz que el nodo de
      // texto sea el contenido de <td>, ubica el elemento <td> al final
      // de la hilera de la tabla
      var celda = document.createElement("td");
      if (i==0 & j == 0){
        var textoCelda = document.createTextNode("Nombre del producto");
      }
      if (i==0 & j == 1){
        var textoCelda = document.createTextNode("Numero de tweets positivos");
      }
      if (i==0 & j == 2){
        var textoCelda = document.createTextNode("Numero de tweets negativos");
      }
      if(i>0 & j == 0){
        var textoCelda = document.createTextNode(arrName[i-1]);
      }
      if(i>0 & j == 1){
        var textoCelda = document.createTextNode(arrPos[i-1]);
      }
      if(i>0 & j == 2){
        var textoCelda = document.createTextNode(arrNeg[i-1]);
      }
      
      celda.appendChild(textoCelda);
      hilera.appendChild(celda);
    }
 
    // agrega la hilera al final de la tabla (al final del elemento tblbody)
    tblBody.appendChild(hilera);
  }
 
  // posiciona el <tbody> debajo del elemento <table>
  tabla.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tabla);
  // modifica el atributo "border" de la tabla y lo fija a "2";
  tabla.setAttribute("border", "2");
}