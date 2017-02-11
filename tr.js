$(document).ready(function() {
$("#listCloseBtn").bind('click',function(){
  $(".left-box").slideToggle('up');
});
$(".traveler-close-btn").bind('click',function(e){
  $(this).parent().hide();
});
$(".prof-settings").on('click',function(e){
  
  if($(".left-box").css('display') == 'none')
    $(".left-box").slideDown();
  
  var childClass = "."+$(this).attr('data-value');
  
  $(".left-box-child").siblings(':not('+childClass+')').hide();
  //if($(childClass).css('display') == 'none')
    $(childClass).slideToggle();
  //else
    //$(childClass).slideUp();

});


$.getJSON('json/db.json', function(data) {

  console.log(data);
});
});

var map,infoWindow;
var markers = [];
var markersData = [];
$(document).ready(function() {
$("#listCloseBtn").bind('click',function(){
  $(".left-box").slideToggle('up');
});
//recent visted place of buddies
$(document).on( 'click', '#visitorSwitch', function(){
  $(".recent-travellers-list").slideToggle();
});

$(document).on( 'click', '.traveller-close-btn', function(){
  $(this).parent().hide();
});

$(".prof-settings").on('click',function(e){
  
  if($(".left-box").css('display') == 'none')
    $(".left-box").slideDown();
  
  var childClass = "."+$(this).attr('data-value');
  
  $(".left-box-child").siblings(':not('+childClass+')').hide();
  //if($(childClass).css('display') == 'none')
    $(childClass).slideToggle();
  //else
    //$(childClass).slideUp();

});


});

function drawData(){
$.getJSON( "db.json", function(data) {
  markersData = data["users"][0].locations;
  if(markersData.length > 0) {
    displayMarkers();
  
  var myPlaces = '';
    markersData.forEach(function(places) {
      myPlaces+= '<div class="listitem">'+places["name"]+', '+ places["country"]+'</div>';
    });
    $('.listitems').append(myPlaces);

    var friendsData = data["users"][0].friends;

    var friendsStr = '';
    var visitorStr = '';

    friendsData.forEach(function(friend) {
      friendsStr+= '<div class="traveller-friend"><span class="traveller-pic"><img class="profilepic" src="img/profilepic.png" title="' + friend["name"] + ', ' + friend["country"] + '"></span><span class="traveller-name">'+friend["name"]+'</span></div>';

      var visitorData = friend['recent-locations'];
      var visitorPlace = '';
      if(visitorData != undefined) {
      visitorData.forEach(function(visited) {
        visitorPlace += '('+visited['location'] +', '+ visited['country'] + ') ';
      });

      visitorStr += '<div class="traveller"><span class="traveller-close-btn">X</span><div class="traveller-pic"><img class="profilepic" src="img/profilepic.png" title="' + friend["name"] + '"></div><div class="traveller-name">' + friend["name"] + '</div><div class="traveller-place">' + visitorPlace + '</div></div>';
      }

    });
    $('.friends-list').append(friendsStr);
    $('.recent-travellers-list').html(visitorStr);

    
  }
    
});
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 2,
    mapTypeId: 'satellite',
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControl: true,
      zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    fullscreenControl: true
  });

  infoWindow = new google.maps.InfoWindow();

// Create the search box and link it to the UI element.
var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

// Bias the SearchBox results towards current map's viewport.
map.addListener('bounds_changed', function() {
  searchBox.setBounds(map.getBounds());
});


// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener('places_changed', function() {
  var places = searchBox.getPlaces();

  if (places.length == 0) {
    return;
  }

  // Clear out the old markers.
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  markers = [];

  // For each place, get the icon, name and location.
  var bounds = new google.maps.LatLngBounds();
  places.forEach(function(place) {
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }
    var icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    // Create a marker for each place.
    markers.push(new google.maps.Marker({
      map: map,
      icon: icon,
      title: place.name,
      position: place.geometry.location
    }));

    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
  });
  map.fitBounds(bounds);
});

//Try HTML5 geolocation.
if (navigator.geolocation) {

  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    infoWindow.open(map,map);
    infoWindow.setPosition(pos);
    infoWindow.setContent('Location found.');
    map.setCenter(pos);
  }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
  });
} else {
  // Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
}
drawData();
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

// This function will iterate over markersData array
// creating markers with createMarker function
function displayMarkers() {

   // this variable sets the map bounds and zoom level according to markers position
   var bounds = new google.maps.LatLngBounds();

   // For loop that runs through the info on markersData making it possible to createMarker function to create the markers
   for (var i = 0; i < markersData.length; i++){

      var latlng = new google.maps.LatLng(markersData[i].lat, markersData[i].lng);
      var name = markersData[i].name;
      var address1 = markersData[i].address1;
      var address2 = markersData[i].address2;
      var postalCode = markersData[i].postalCode;

      createMarker(latlng, name, address1, address2, postalCode);

      // Marker’s Lat. and Lng. values are added to bounds variable
      bounds.extend(latlng); 
   }

   // Finally the bounds variable is used to set the map bounds
   // with API’s fitBounds() function
   map.fitBounds(bounds);
}

// This function creates each marker and sets their Info Window content
function createMarker(latlng, name, address1, address2, postalCode) {
   var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      title: name
   });

   // This event expects a click on a marker
   // When this event is fired the infowindow content is created
   // and the infowindow is opened
   google.maps.event.addListener(marker, 'click', function() {
      
      // Variable to define the HTML content to be inserted in the infowindow
      var iwContent = '<div id="iw_container">' +
      '<div class="iw_title">' + name + '</div>' +
      '<div class="iw_content">' + address1 + '<br />' +
      address2 + '<br />' +
      postalCode + '</div></div>';
      
      // including content to the infowindow
      infoWindow.setContent(iwContent);

      // opening the infowindow in the current map and at the current marker location
      infoWindow.open(map, marker);
   });
}