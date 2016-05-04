Template.mapRoutes.events({

    'click .calcRute': function(event, template){

      var dataSinAlamcen = [{"coor":[36.7585406465564,-4.3971722687],"ventana":2},{"coor":[36.851466535347726, -2.4687910079956055],"ventana":1},
               {"coor":[37.1773727, -3.5986292999999705],"ventana":1},{"coor":[37.7793464, -3.785149899999965],"ventana":1},
                {"coor":[36.5270844, -6.288668599999937],"ventana":2},{"coor":[37.8881707, -4.7793834999999945],"ventana":2},
                 {"coor":[37.261475, -6.94484650000004],"ventana":2},{"coor":[37.3891044, -5.984507200000053],"ventana":1}]
      
      var datosConAlmacen = dataSinAlamcen.slice();
      datosConAlmacen.unshift({"coor":[37.3595301,-5.9862615],"ventana":0});
      var rute = [];
      console.log('pasa')
      
      HTTP.call( 'POST', 'http://localhost:5000/todo/api/v1.0/tasks', {
        data: {data:dataSinAlamcen}
      }, function( error, response ) {
        if ( error ) {
          console.log( error );
        } else {
          console.log( response );
          console.log( response['data']['res'] );
          res = response['data']['res'];
          for (var i= 0;i<res.length;i++){
            rute[i] = datosConAlmacen[res[i]]["coor"];
          }
          console.log(rute);
          initMap(rute);
        }
      });
    },

});

function initMap(coors) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: coors[0][0], lng: coors[0][1]},
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });

  var flightPlanCoordinates = [];

  for(var i = 0; i < coors.length;i++){
    flightPlanCoordinates.push({lat: coors[i][0], lng: coors[i][1]});
  }
  flightPlanCoordinates.push({lat: coors[0][0], lng: coors[0][1]});

  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  flightPath.setMap(map);
  google.maps.event.addDomListener(window,"load")//muestra el mapa

}