const socket = io();

let currentLocation = null;

var isswpop=true;

socket.on('connect', function() {
  console.log('Conectado al servidor');
});

/*
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      currentLocation = { latitude, longitude };
      //console.log(`Sending location: ${latitude}, ${longitude}`);
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }

  );
}
*/
/*
socket.on('connection', function() {
  console.log('Conectado al servidor');
});
*/
//socket.emit("send-location", { -12.08510725735431, -77.03013562331508  });
const map = L.map("map").setView([0, 0], 16);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Realtime Location by edward",
}).addTo(map);

const markers = {};
const markerClusterGroup = L.markerClusterGroup();
map.addLayer(markerClusterGroup);

const addOffset = (latitude, longitude) => {
  const offset = 0.00001;
  const randomOffsetLat = (Math.random() - 0.5) * offset;
  const randomOffsetLng = (Math.random() - 0.5) * offset;
  return [latitude + randomOffsetLat, longitude + randomOffsetLng];
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
};

const updateLocationList = (id, latitude, longitude, distance = null) => {
  const locationList = document.getElementById("location-list");
  let locationItem = document.getElementById(`location-${id}`);
  if (!locationItem) {
    locationItem = document.createElement("li");
    locationItem.id = `location-${id}`;
    locationList.appendChild(locationItem);
  }
  locationItem.textContent = `ID: ${id}, Latitude: ${latitude}, Longitude: ${longitude}${
    distance !== null ? `, Distance: ${distance.toFixed(2)} meters` : ""
  }`;
};

socket.on("receive-location", (data) => {

  //debugger;
  const { id, latitude, longitude } = data;
  //console.log(`Received location for ${id}: ${latitude}, ${longitude}`);

  if (!isswpop) {

  }else{

    //debugger;

    /*
          //AgregarMarkers();
        debugger;
          //const [newLat, newLng] = addOffset(latitude, longitude);
          if (markers[id]) {
            markers[id].setLatLng([newLat, newLng]);
          } else {
            markers[id] = L.marker([newLat, newLng]).addTo(markerClusterGroup);

          }
      */

    //updateLocationList(id, latitude, longitude);
/*
    map.setView([latitude, longitude]);
    //AgregarMarkers();
    const [newLat, newLng] = addOffset(latitude, longitude);

    markers[id]= L.marker([newLat, newLng]).addTo(map);
    markers[id].setLatLng([newLat, newLng]);


 */

  }

});
socket.on("refreshlocation", (data) => {
  //socket.on("refreshlocation0008", (data) => {

  //debugger;

  const { id, latitude, longitude,cia,fdoc,cbd } = data;


  var pcodper=sessionStorage.getItem("codigo");
  var pcia=sessionStorage.getItem("cia");
  var pfdoc=sessionStorage.getItem("fdoc");
  var pcbd=sessionStorage.getItem("cbd");


  console.log('pers_id '+id + 'cia '+ cia+'fdoc '+fdoc +' cbd '+cbd+   ' data session ' + pcodper + ' ' + pcia +' ' +pfdoc+ ' ' +pcbd);
  //console.log(`Received location for ${id}: ${latitude}, ${longitude}`);

  if (!isswpop) {

  }else{

//emitir ubicacion
/*
    var cod =localStorage.getItem("codigo");

    socket.emit('refreshlocation', {
      usuario: 'Fernando',
      mensaje: 'Hola Mundo',
      codigo:    cod
    }, function(resp) {
      //console.log('respuesta server: ', resp);
    });
    */

  //map.setView([latitude, longitude]);
  /*
        //AgregarMarkers();
      debugger;
        //const [newLat, newLng] = addOffset(latitude, longitude);
        if (markers[id]) {
          markers[id].setLatLng([newLat, newLng]);
        } else {
          markers[id] = L.marker([newLat, newLng]).addTo(markerClusterGroup);

        }
    */

    //updateLocationList(id, latitude, longitude);


    if(pcodper==id && pcia==cia && pfdoc==fdoc && pcbd==cbd) {
      console.log('entra');
      map.eachLayer(function (layer) {

        var nombre = layer._leaflet_id;

        if (layer._leaflet_id != 25 && layer._leaflet_id != 42 && layer._leaflet_id != 43 && layer._leaflet_id != 44) {
          map.removeLayer(layer);
        }

      });


      map.setView([latitude, longitude]);
      //AgregarMarkers();
      const [newLat, newLng] = addOffset(latitude, longitude);

      markers[id] = L.marker([newLat, newLng]).addTo(map);
      markers[id].setLatLng([newLat, newLng]);

    }

  }

});

socket.on("user-disconnected", (id) => {
  console.log(`User disconnected: ${id}`);
  if (markers[id]) {
    markerClusterGroup.removeLayer(markers[id]);
    delete markers[id];
  }
  const locationItem = document.getElementById(`location-${id}`);
  if (locationItem) {
    locationItem.remove();
  }
});

let manualMarker = null;

map.on("click", (e) => {
/*
  const { lat, lng } = e.latlng;
  const userConfirmed = window.confirm(
    `Estas seguro de eliminar: ${lat}, Longitude: ${lng}?`
  );
  if (userConfirmed) {
    if (manualMarker) {
      map.removeLayer(manualMarker);
    }
    manualMarker = L.marker([lat, lng]).addTo(map);
    const distance = currentLocation
      ? calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          lat,
          lng
        )
      : null;
    updateLocationList("manual", lat, lng, distance);


  }
*/

});

map.on('popupopen', function(e) {
  isswpop=false;
});

map.on('popupclose', function(e) {
  isswpop=true;
});


const AgregarMarkers = () => {

  const myObj = {
    lat: "asdasd",
    lng: "asdasd"
  }

  //debugger;
  const listavalores=[
    {lat :"-12.08510725735431",lng:"-77.03013562331508"     },
    {lat :"-12.084590635246911",lng:"-77.03018944459626"     },
    {lat :"-12.08605919483442",lng:"-77.0318949062145"     },
    {lat :"-12.086751482133295",lng:"-77.03262485722388"     },
    {lat :"-12.086924065381197",lng:"-77.03396029753613"     },
    {lat :"-12.087129541150219",lng:"-77.0352553719038"     },
    {lat :"-12.087242917591752",lng:"-77.03624770161296"     },
    {lat :"-12.08746812855179",lng:"-77.0381348099668"     }

  ]

  let distancia ;

  map.eachLayer(function (layer) {

    var nombre=layer._leaflet_id;

     if( layer._leaflet_id!=25 && layer._leaflet_id!=42 && layer._leaflet_id!=43 && layer._leaflet_id!= 44){
       map.removeLayer(layer);
    }

  });

  const listaiconos=[
    { icon: 'building', markerColor: 'blue',   prefix: 'fa',   spin:false  },
    { icon: 'group', markerColor: 'darkgreen',   prefix: 'fa',   spin:false  },
    { icon: 'user', markerColor: '#f28f82',   prefix: 'fa',   spin:false  },
    { icon: 'user', markerColor: 'darkgreen',   prefix: 'fa',   spin:false  },
    { icon: 'glass', markerColor: 'purple',   prefix: 'fa',   spin:false  },
    { icon: 'shopping-cart', markerColor: 'blue',   prefix: 'fa',   spin:false  },
    { icon: 'medkit', markerColor: 'darkblue',   prefix: 'fa',   spin:false  },
    { icon: 'star', markerColor: 'orange',   prefix: 'fa',   spin:false  }

      ]

  if(sessionStorage.getItem("lscliente")==null){
    console.log('error al obtener datos de cliente')
  }else{
    var datacliente = JSON.parse(sessionStorage.getItem("lscliente"));

    var listadocli=[];

    for (let i in datacliente)
      listadocli.push(datacliente[i]);
  }

var vricon;

    for (let i in listadocli) {
      distancia = currentLocation
          ? calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              listadocli[i].lat,
              listadocli[i].lng
          )
          : null;

      if(listadocli[i].nPuntero<=0){
        vricon=L.AwesomeMarkers.icon(listaiconos[2])
      }else{
        vricon=L.AwesomeMarkers.icon(listaiconos[3])
      }

      if(distancia!=null){
        //if(distancia<=400) {


          L.marker([listadocli[i].lat, listadocli[i].lng],{icon: vricon}).addTo(map).bindPopup("<b>Nombre : </b>"+ listadocli[i].Nombre+"<br> <span style='color:#0078A8'> <b> Direccion : </b>"+ listadocli[i].Direccion +
             "</span><br> <span style='color:#B22222'> <b> Fecha : </b>"+ listadocli[i].Fecha +"</span><br> <span style='color:#228B22'> <b> Importe : </b>"+ listadocli[i].ImpTot +"</span>", {closeOnClick: true, autoClose: false}).on('click', (e) => {
                console.log(e.latlng.lat);
              });


/*
        L.marker([listadocli[i].lat, listadocli[i].lng],{icon: vricon}).addTo(map).on('click', (e) => {
          var myPopup = L.popup()
              .setLatLng([(e.latlng.lat + 0.0002), e.latlng.lng])
              .setContent("<b>Nombre : </b>"+ listadocli[i].Nombre+"<br> <span style='color:#0078A8'> <b> Direccion : </b>"+ listadocli[i].Direccion +
                  "</span><br> <span style='color:#B22222'> <b> Fecha : </b>"+ listadocli[i].Fecha +"</span><br> <span style='color:#228B22'> <b> Importe : </b>"+ listadocli[i].ImpTot +"</span>")
              .openOn(map);

        });
*/

        //}
      }
  }
};

