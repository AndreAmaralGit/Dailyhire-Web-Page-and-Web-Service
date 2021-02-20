//////////////////////////  CHANGE :HOVER SIDEBAR  ////////////////////////////////////

$(document).ready(function () {
  $("li").removeClass("active");
  $("#createService").addClass("active");
});

//////////////////////////  DATEPCIKER  ////////////////////////////////////
var limit;

$(function () {
  $("#datepicker").datepicker({
    autoclose: true,
    todayHighlight: true,
    startDate: '+1d'
  }).on('changeDate', function (selected) {
    document.getElementById('endDate').disabled = false;
    document.getElementById('endDate').style.backgroundColor = "white";
    var newDate = new Date(selected.date.valueOf());
    $("#datepicker1").datepicker('setStartDate', newDate);
  });
});


$(function () {
  $("#datepicker1").datepicker({
    autoclose: true,
  })
});

//////////////////////////  ADDRESS AUTO COMPLETE  ////////////////////////////////////

var placesAutocomplete = places({
  appId: 'YOUR_API_ID',
  apiKey: 'YOUR_API_KEY',
  container: document.querySelector('#address-input')
});

//////////////////////////  CREATE SERVICE  ////////////////////////////////////

function createService() {

  var dataAfterStart;
  var dataAfterEnd;

  if ($('#startDate').val() == "") {
    dataAfterStart = "";
  } else {
    var dataBeforeStart = $('#startDate').val().split("-"); //DD-MM-YYYY -> MM-DD-YYYY
    dataAfterStart = dataBeforeStart[1] + "-" + dataBeforeStart[0] + "-" + dataBeforeStart[2];
  }

  if ($('#endDate').val() == "") {
    dataAfterEnd = "";
  } else {
    var dataBeforeEnd = $('#endDate').val().split("-"); //DD-MM-YYYY -> MM-DD-YYYY
    dataAfterEnd = dataBeforeEnd[1] + "-" + dataBeforeEnd[0] + "-" + dataBeforeEnd[2];
  }

  var user_id = sessionStorage.getItem('users_details');
  var json = JSON.parse(user_id);

  var dadosCreate = {

    "workArea": $("#inputState option:selected").text(),
    "startDate": dataAfterStart,
    "endDate": dataAfterEnd,
    "address": $('#address-input').val(),
    "description": $('#description').val(),
    "user": json["_id"]

  };

  $.ajax({
    url: "http://localhost:8080/services/createService",
    type: "POST", //METODO DA API
    contentType: "application/json",
    data: JSON.stringify(dadosCreate), // SE TIVER BODY USAS ISTO
    success: function (response) {

      Swal.fire({
        icon: 'success',
        title: 'Your service has been requested',
        showConfirmButton: false,
        timer: 1500
      }).then(function () {
        window.location = ("/createService");
      });


    },
    error: function (jqXHR, textStatus, errorThrown) {

      var feedback = JSON.parse(jqXHR.responseText);
      console.log(textStatus, errorThrown);



      for (var i = 0; i < feedback["errors"].length; i++) {

        var param = feedback["errors"][i]["param"];

        if (param == "workArea") {

          document.getElementById("errorSelect").classList.add("d-block");
          document.getElementById("inputState").style.borderColor = "#dc3545";

        }

        if (param == "startDate") {

          document.getElementById("startDate").classList.add("is-invalid");

        }

        if (param == "endDate") {

          document.getElementById("endDate").classList.add("is-invalid");

        }

        if (param == "address") {

          document.getElementById("errorAddress").classList.add("d-block");
          document.getElementById("address-input").style.borderColor = "#dc3545";

        }

      }

    }


  });

}