const socket = io();



let currentLocation = null;


if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      currentLocation = { latitude, longitude };
      console.log(`Sending location: ${latitude}, ${longitude}`);
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      //toastr.warning('Debe otorgar permiso de ubicación en este sitio web, para el buen funcionamiento de la web.','Advertencia',{  positionClass:"toast-top-full-width",  preventDuplicates: true,   onclick: null, closeButton: false});
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }

  );

}

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
  const { id, latitude, longitude } = data;
  console.log(`Received location for ${id}: ${latitude}, ${longitude}`);
  map.setView([latitude, longitude]);
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


//debugger;
  map.setView([latitude, longitude]);
  AgregarMarkers();
  const [newLat, newLng] = addOffset(latitude, longitude);

  markers[id]= L.marker([newLat, newLng]).addTo(map);
  markers[id].setLatLng([newLat, newLng]);



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
    `Do you want to add a marker at Latitude: ${lat}, Longitude: ${lng}?`
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


const AgregarMarkers = () => {
  //const locationList = document.getElementById("location-list");
  //let locationItem = document.getElementById(`location-${id}`);
  /*
  if (!locationItem) {
    locationItem = document.createElement("li");
    locationItem.id = `location-${id}`;
    locationList.appendChild(locationItem);
  }
  locationItem.textContent = `ID: ${id}, Latitude: ${latitude}, Longitude: ${longitude}${
      distance !== null ? `, Distance: ${distance.toFixed(2)} meters` : ""
  }`;

   */

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

  let distancia ;/*= currentLocation
      ? calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          lat,
          lng
      )
      : null;
      */

  /*
  map.eachLayer(function (layer) {
    map.removeLayer(layer);
  });
  */



  map.eachLayer(function (layer) {
    //debugger;
    var nombre=layer._leaflet_id;

     if( layer._leaflet_id!=25 && layer._leaflet_id!=42 && layer._leaflet_id!=43 && layer._leaflet_id!= 44){
       map.removeLayer(layer);
    }

  });

  /*
  var markericon1 = L.AwesomeMarkers.icon({ icon: 'arrow-right', markerColor: 'blue',   prefix: 'fa',   spin:false  });
  var markericon2 = L.AwesomeMarkers.icon({ icon: 'group', markerColor: 'darkblue',   prefix: 'fa',   spin:false  });
  var markericon3 = L.AwesomeMarkers.icon({ icon: 'user', markerColor: '#f28f82',   prefix: 'fa',   spin:true  });
  var markericon4 = L.AwesomeMarkers.icon({ icon: 'ambulance', markerColor: 'darkgreen',   prefix: 'fa',   spin:false  });
  var markericon5 = L.AwesomeMarkers.icon({ icon: 'glass', markerColor: 'purple',   prefix: 'fa',   spin:false  });
  var markericon6 = L.AwesomeMarkers.icon({ icon: 'shopping-cart', markerColor: 'blue',   prefix: 'fa',   spin:false  });
  var markericon7 = L.AwesomeMarkers.icon({ icon: 'medkit', markerColor: 'darkblue',   prefix: 'fa',   spin:false  });
  var markericon8 = L.AwesomeMarkers.icon({ icon: 'star', markerColor: 'orange',   prefix: 'fa',   spin:false  });

  */
  const listaiconos=[
    { icon: 'arrow-right', markerColor: 'blue',   prefix: 'fa',   spin:false  },
    { icon: 'group', markerColor: 'darkblue',   prefix: 'fa',   spin:false  },
    { icon: 'user', markerColor: '#f28f82',   prefix: 'fa',   spin:false  },
    { icon: 'ambulance', markerColor: 'darkgreen',   prefix: 'fa',   spin:false  },
    { icon: 'glass', markerColor: 'purple',   prefix: 'fa',   spin:false  },
    { icon: 'shopping-cart', markerColor: 'blue',   prefix: 'fa',   spin:false  },
    { icon: 'medkit', markerColor: 'darkblue',   prefix: 'fa',   spin:false  },
    { icon: 'star', markerColor: 'orange',   prefix: 'fa',   spin:false  }

      ]
    for (let i in listavalores) {
      distancia = currentLocation
          ? calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              listavalores[i].lat,
              listavalores[i].lng
          )
          : null;

      if(distancia!=null){
        if(distancia<=100) {
          L.marker([listavalores[i].lat, listavalores[i].lng],{icon: L.AwesomeMarkers.icon(listaiconos[i])}).addTo(map).bindPopup('Sodimac.sac.<br> <b style="color:#0078A8">  Av.javier prado 4057.</b>').on('click', (e) => {
                console.log(e.latlng.lat);
              });


        //L.marker([listavalores[i].lat, listavalores[i].lng]).addTo(map).bindPopup('Sodimac.sac.<br>  Av.javier prado 4057.')
        }
      }
  }
};
