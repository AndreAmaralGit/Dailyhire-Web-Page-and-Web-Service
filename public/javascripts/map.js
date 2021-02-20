function haversine_distance(mk1, mk2) {
  var R = 6371.0710; // Radius of the Earth in miles
  var rlat1 = mk1.position.lat() * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = mk2.position.lat() * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (mk2.position.lng() - mk1.position.lng()) * (Math.PI / 180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
  return d;
}

function initMap() {

  var map = new google.maps.Map(document.getElementById('gmap'), {
    zoom: 3,
    streetViewControl: false,
    mapTypeControl: false,
    center: { lat: 40, lng: -8 },
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#242f3e"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#746855"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#242f3e"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "poi.business",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#263c3f"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#6b9a76"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#38414e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#212a37"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9ca5b3"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#746855"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#1f2835"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#f3d19c"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#2f3948"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#17263c"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#515c6d"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#17263c"
          }
        ]
      }
    ]
  });

  // GET ALL WORKERS INFO

  $.ajax({
    url: "http://localhost:8080/workers/allWorkers",
    type: "GET", //METODO DA API
    contentType: "application/json",
    dataType: 'json',
    success: function (response) {

      var user_id = sessionStorage.getItem('users_details');
      var json = JSON.parse(user_id);
      var id = json["_id"];

      for (let i = 0; i < response.length; i++) {

        if (response[i]["_doc"]["user"]["0"]["_id"] == id) {
          response.splice(i, i + 1);;
        }
      }

      for (let i = 0; i < response.length; i++) {


        map.setCenter(response[i]);

        var infoWin = new google.maps.InfoWindow();

        // Add some markers to the map.
        // Note: The code uses the JavaScript Array.prototype.map() method to
        // create an array of markers based on a given "locations" array.
        // The map() method here has nothing to do with the Google Maps API.
        var markers = response.map(function (location, i) {
          var marker = new google.maps.Marker({
            position: location
          });

          // CONTENT TO MARKER

          const starTotal = 5;
          var starPercentage;


          if (response[i]["_doc"]["ratingCounter"] == null) {

            starsCounter = "No evaluations";
            starPercentage = 0;

          } else {

            var workerRating = response[i]["_doc"]["ratingTotal"] / response[i]["_doc"]["ratingCounter"];

            starPercentage = (workerRating / starTotal) * 100;

            // document.querySelector('.stars-inner').style.width = starPercentage + '%';
            starsCounter = Math.round((workerRating + Number.EPSILON) * 100) / 100;
          }

          var contentString = '<div class="d-flex justify-content-center" id="uploadWrapper">' +
            '<img src=' + response[i]["_doc"]["user"][0]["photo"] + " " + 'alt="Avatar" id="picture" class="rounded-circle">' +
            '</div>' +
            '<div id="information">' +
            '<div class="form-group">' +
            '<label class="form-control-label" id="label">Name: </label>' +
            '<label class="form-control-label" id="nameOpen">' + response[i]["_doc"]["user"][0]["name"] + '</label>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="form-control-label" id="label">Address: </label>' +
            '<label class="form-control-label" id="addressOpen">' + response[i]["_doc"]["user"][0]["address"] + '</label>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="form-control-label" id="label">Phone Number: </label>' +
            '<label class="form-control-label" id="phoneOpen">' + response[i]["_doc"]["user"][0]["phoneNumber"] + '</label>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="form-control-label" id="label">Age: </label>' +
            '<label class="form-control-label" id="ageOpen">' + getAge(response[i]["_doc"]["user"][0]["birthdate"]) + '</label>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="form-control-label" id="label">Gender: </label>' +
            '<label class="form-control-label" id="genderOpen">' + response[i]["_doc"]["user"][0]["gender"] + '</label>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="form-control-label" id="label">Work Area: </label>' +
            '<label class="form-control-label" id="workOpen">' + response[i]["_doc"]["area"] + '</label>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="form-control-label" id="label">Experience: </label>' +
            '<label class="form-control-label" id="experienceOpen">' + response[i]["_doc"]["experience"] + " years" + '</label>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="form-control-label" id="label">Rating: </label>' +
            '<div class="stars-outer" id="stars-outer">' +
            '<div class="stars-inner" style=' + 'width:' + starPercentage + '%' + '>' + '</div>' +
            '</div>' +
            '<label class="form-control-label" id="ratingOpen">' + starsCounter + '</label>' +
            '</div>' +
            '</div>' +
            '<div class="d-flex justify-content-center">' +
            '<button id="sendMessage" class="btn btn-primary" onClick="sendMessage(' + "'" + response[i]["_doc"]["user"][0]["_id"] + "'" + ')">Send Message</button>' +
            '</div>';

          google.maps.event.addListener(marker, 'click', function (evt) {
            infoWin.open(map, marker);
            infoWin.setContent(contentString);

            google.maps.event.addListener(map, 'click', function () {
              infoWin.close();
            });


          })
          return marker;
        });


      }


      // Add a marker clusterer to manage the markers.
      var markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });


      // Filter Work Area

      filterMarker = function () {
        var filterMarkers = [];

        var checkBox1 = document.getElementById("defaultCheck1");
        var checkBox2 = document.getElementById("defaultCheck2");
        var checkBox3 = document.getElementById("defaultCheck3");
        var checkBox4 = document.getElementById("defaultCheck4");
        var checkBox5 = document.getElementById("defaultCheck5");
        var checkBox6 = document.getElementById("defaultCheck6");
        var checkBox7 = document.getElementById("defaultCheck7");
        var checkBox8 = document.getElementById("defaultCheck8");
        var checkBox9 = document.getElementById("defaultCheck9");
        var checkBox10 = document.getElementById("defaultCheck10");
        var checkBox11 = document.getElementById("defaultCheck11");
        var checkBox12 = document.getElementById("defaultCheck12");
        var checkBox13 = document.getElementById("defaultCheck13");
        var checkBox14 = document.getElementById("defaultCheck14");
        var checkBox15 = document.getElementById("defaultCheck15");
        var checkBox16 = document.getElementById("defaultCheck16");

        var value1 = checkBox1.value;
        var value2 = checkBox2.value;
        var value3 = checkBox3.value;
        var value4 = checkBox4.value;
        var value5 = checkBox5.value;
        var value6 = checkBox6.value;
        var value7 = checkBox7.value;
        var value8 = checkBox8.value;
        var value9 = checkBox9.value;
        var value10 = checkBox10.value;
        var value11 = checkBox11.value;
        var value12 = checkBox12.value;
        var value13 = checkBox13.value;
        var value14 = checkBox14.value;
        var value15 = checkBox15.value;
        var value16 = checkBox16.value;

        markerCluster.clearMarkers();

        for (i = 0; i < markers.length; i++) {

          marker = markers[i];

          if (checkBox1.checked == false && checkBox2.checked == false && checkBox3.checked == false && checkBox4.checked == false && checkBox5.checked == false && checkBox6.checked == false && checkBox7.checked == false && checkBox8.checked == false && checkBox9.checked == false && checkBox10.checked == false && checkBox11.checked == false && checkBox12.checked == false && checkBox13.checked == false && checkBox14.checked == false && checkBox15.checked == false && checkBox16.checked == false) {

            marker.setVisible(true);
            filterMarkers.push(marker);

          } else {

            if (checkBox1.checked == true) {
              if (response[i]["_doc"]["area"] == value1) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox2.checked == true) {
              if (response[i]["_doc"]["area"] == value2) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else if (checkBox.checked == false) {
                marker.setVisible(false);
              }
            }

            if (checkBox3.checked == true) {
              if (response[i]["_doc"]["area"] == value3) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else if (checkBox3.checked == false) {
                marker.setVisible(false);
              }
            }

            if (checkBox4.checked == true) {
              if (response[i]["_doc"]["area"] == value4) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox5.checked == true) {
              if (response[i]["_doc"]["area"] == value5) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox6.checked == true) {
              if (response[i]["_doc"]["area"] == value6) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox7.checked == true) {
              if (response[i]["_doc"]["area"] == value7) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox8.checked == true) {
              if (response[i]["_doc"]["area"] == value8) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox9.checked == true) {
              if (response[i]["_doc"]["area"] == value9) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox10.checked == true) {
              if (response[i]["_doc"]["area"] == value10) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox11.checked == true) {
              if (response[i]["_doc"]["area"] == value11) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox12.checked == true) {
              if (response[i]["_doc"]["area"] == value12) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox13.checked == true) {
              if (response[i]["_doc"]["area"] == value13) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox14.checked == true) {
              if (response[i]["_doc"]["area"] == value14) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox15.checked == true) {
              if (response[i]["_doc"]["area"] == value15) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

            if (checkBox16.checked == true) {
              if (response[i]["_doc"]["area"] == value16) {
                marker.setVisible(true);
                filterMarkers.push(marker);
              } else {
                marker.setVisible(false);
              }
            }

          }
        }

        markerCluster.addMarkers(filterMarkers);

      }

      // Filter Location

      filterLocation = function () {
        var filterMarkers = [];

        var checkBox = document.getElementById("2km");
        var checkBox2 = document.getElementById("5km");
        var checkBox3 = document.getElementById("10km");
        var checkBox4 = document.getElementById("20km");
        var checkBox5 = document.getElementById("50km");

        if (navigator.geolocation) {

          navigator.geolocation.getCurrentPosition(showPosition, showError);

          function showPosition(position) {

            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);

            var myCords = { lat: position.coords.latitude, lng: position.coords.longitude }

            markerCluster.clearMarkers();

            if (checkBox.checked == true) {

              for (i = 0; i < markers.length; i++) {

                marker = markers[i];
                var markerCords = { lat: response[i]["lat"], lng: response[i]["lng"] };

                // Draw a line showing the straight distance between the markers
                //var line = new google.maps.Polyline({ path: [myCords, markerCords], map: map });
                var mk1 = new google.maps.Marker({ position: myCords, map: map });
                mk1.setVisible(false);

                // Calculate and display the distance between markers
                var distance = haversine_distance(mk1, marker);
                //console.log("Distance between markers: " + distance.toFixed(0) + " km");

                if (distance.toFixed(0) > 2) {
                  marker.setVisible(false);
                } else {
                  marker.setVisible(true);
                  filterMarkers.push(marker);
                }

              }

            } else if (checkBox2.checked == true) {

              for (i = 0; i < markers.length; i++) {

                marker = markers[i];
                var markerCords = { lat: response[i]["lat"], lng: response[i]["lng"] };

                // Draw a line showing the straight distance between the markers
                //var line = new google.maps.Polyline({ path: [myCords, markerCords], map: map });
                var mk1 = new google.maps.Marker({ position: myCords, map: map });
                mk1.setVisible(false);

                // Calculate and display the distance between markers
                var distance = haversine_distance(mk1, marker);
                //console.log("Distance between markers: " + distance.toFixed(0) + " km");

                if (distance.toFixed(0) > 5) {
                  marker.setVisible(false);
                } else {
                  marker.setVisible(true);
                  filterMarkers.push(marker);
                }

              }

            } else if (checkBox3.checked == true) {

              for (i = 0; i < markers.length; i++) {

                marker = markers[i];
                var markerCords = { lat: response[i]["lat"], lng: response[i]["lng"] };

                // Draw a line showing the straight distance between the markers
                //var line = new google.maps.Polyline({ path: [myCords, markerCords], map: map });
                var mk1 = new google.maps.Marker({ position: myCords, map: map });
                mk1.setVisible(false);

                // Calculate and display the distance between markers
                var distance = haversine_distance(mk1, marker);
                //console.log("Distance between markers: " + distance.toFixed(0) + " km");

                if (distance.toFixed(0) > 10) {
                  marker.setVisible(false);
                } else {
                  marker.setVisible(true);
                  filterMarkers.push(marker);
                }

              }

            } else if (checkBox4.checked == true) {

              for (i = 0; i < markers.length; i++) {

                marker = markers[i];
                var markerCords = { lat: response[i]["lat"], lng: response[i]["lng"] };

                // Draw a line showing the straight distance between the markers
                //var line = new google.maps.Polyline({ path: [myCords, markerCords], map: map });
                var mk1 = new google.maps.Marker({ position: myCords, map: map });
                mk1.setVisible(false);

                // Calculate and display the distance between markers
                var distance = haversine_distance(mk1, marker);
                //console.log("Distance between markers: " + distance.toFixed(0) + " km");

                if (distance.toFixed(0) > 20) {
                  marker.setVisible(false);
                } else {
                  marker.setVisible(true);
                  filterMarkers.push(marker);
                }

              }

            } else if (checkBox5.checked == true) {

              for (i = 0; i < markers.length; i++) {

                marker = markers[i];
                //var markerCords = { lat: response[i]["lat"], lng: response[i]["lng"] };

                // Draw a line showing the straight distance between the markers
                //var line = new google.maps.Polyline({ path: [myCords, markerCords], map: map });
                var mk1 = new google.maps.Marker({ position: myCords, map: map });
                mk1.setVisible(false);

                // Calculate and display the distance between markers
                var distance = haversine_distance(mk1, marker);
                //console.log("Distance between markers: " + distance.toFixed(0) + " km");

                if (distance.toFixed(0) > 50) {
                  marker.setVisible(false);
                } else {
                  marker.setVisible(true);
                  filterMarkers.push(marker);
                }

              }

            } else {

              for (i = 0; i < markers.length; i++) {

                marker = markers[i];
                marker.setVisible(true);
                filterMarkers.push(marker);
              }

            }

            markerCluster.addMarkers(filterMarkers);

          }


        } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
        }

      }

    },
    error: function (jqXHR, textStatus, errorThrown) {

      console.log(textStatus, errorThrown);


    }
  });



}

// CONVERT DATE TO AGE 

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// SEND MESSAGE

function sendMessage(id) {

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  Swal.fire({
    confirmButtonText: "Send message",
    confirmButtonColor: '#2292A4',
    showCancelButton: true,
    showLoaderOnConfirm: true,
    preConfirm: (test) => {
      if (($("#messageContent").val() == "")) {

        Swal.showValidationMessage(
          `Message cannot be empty!`
        )

      }
    },
    html: '<textarea id="messageContent" rows="4" cols="40" placeholder="Type your message here...">'

  }).then(function (result) {
    if (result.value) {

      var user_id = sessionStorage.getItem('users_details');
      var json = JSON.parse(user_id);

      var content = json["name"] + ": " + $("#messageContent").val();


      // CREATE CHAT

      var dadosChat = {
        "participant1": json["_id"],
        "participant2": id,
        "content": content
      }



      $.ajax({
        url: "http://localhost:8080/chats/createChat",
        type: "POST", //METODO DA API
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(dadosChat), // SE TIVER BODY USAS ISTO
        success: function (response) {

          Toast.fire({
            icon: 'success',
            title: 'Message sent'
          });

        },
        error: function (jqXHR, textStatus, errorThrown) {

          console.log(textStatus, errorThrown);


        }
      });

      var dadosNotification = {
        "content": "You have a new message",
        "user": id
      }

      $.ajax({
        url: "http://localhost:8080/notifications/createNotification",
        type: "POST", //METODO DA API
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(dadosNotification),
        success: function (response6) {


        },
        error: function (jqXHR, textStatus, errorThrown) {

          console.log(textStatus, errorThrown);


        }
      });

    }
  });

}

//ALLOW ONLY ONE CHECKBOX TO SELECT

function onlyOne(checkbox) {
  var checkboxes = document.getElementsByName('check')
  checkboxes.forEach((item) => {
    if (item !== checkbox) item.checked = false
  })
}

// DENY BROWSER PERMITION FOR LOCATION

function showError(error) {

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  switch (error.code) {
    case error.PERMISSION_DENIED:
      Toast.fire({
        icon: 'error',
        title: 'User denied the request for Geolocation.'
      });
      break;
    case error.POSITION_UNAVAILABLE:
      Toast.fire({
        icon: 'error',
        title: 'Location information is unavailable.'
      });
      break;
    case error.TIMEOUT:
      Toast.fire({
        icon: 'error',
        title: 'The request to get user location timed out.'
      });
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}
