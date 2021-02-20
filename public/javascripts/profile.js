//////////////////////////  CHANGE :HOVER SIDEBAR  ////////////////////////////////////

$(document).ready(function () {
  $("li").removeClass("active");
  $("#profile").addClass("active");


  // ------------------------------------------------------- //
  // Fill form with user details
  // ------------------------------------------------------ //

  var user_id = sessionStorage.getItem('users_details');
  var json = JSON.parse(user_id);
  var name = json["name"];
  var address = json["address"];
  var email = json["email"];
  var phone = json["phoneNumber"];
  var gender = json["gender"];
  var birthdate = json["birthdate"];
  var password = json["password"];

  document.getElementById("profilePhoto").src = json["photo"];

  var dateToSplit = birthdate.substring(0, 10);
  var dateSplit = dateToSplit.split("-");
  var finalDate = (n(+dateSplit[2])) + "-" + dateSplit[1] + "-" + dateSplit[0];

  document.getElementById("nameEdit").value = name;
  document.getElementById("address-input").value = address;
  document.getElementById("emailEdit").value = email;
  document.getElementById("phoneEdit").value = phone;

  if (gender == "Male") {

    document.getElementById("maleOption").selected = true;

  } else {

    document.getElementById("femaleOption").selected = true;

  }

  document.getElementById("startDate").value = finalDate;
  document.getElementById("passEdit").value = password;

  // ------------------------------------------------------- //
  // RATINGS
  // ------------------------------------------------------ //

  var dadosWorker = {

    "_id": json["_id"]

  }

  $.ajax({
    url: "http://localhost:8080/workers/findWorkerbyUser",
    type: "POST", //METODO DA API
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify(dadosWorker), // SE TIVER BODY USAS ISTO
    success: function (response) {

      if (response.length === 0) {

        document.getElementById("workerDiv").style.visibility = "hidden";

      } else if (!(response[0]["ratingTotal"] == null)) {

        const starTotal = 5;
        var workerRating = response[0]["ratingTotal"] / response[0]["ratingCounter"];
        const starPercentage = (workerRating / starTotal) * 100;

        document.querySelector('.stars-inner').style.width = starPercentage + '%';
        document.getElementById("ratingOpen").innerHTML = Math.round((workerRating + Number.EPSILON) * 100) / 100;

      }

    },
    error: function (jqXHR, textStatus, errorThrown) {

      console.log(textStatus, errorThrown);


    }
  });

  if (!(json["ratingTotal"] == null)) {

    const starTotal = 5;
    var workerRating = json["ratingTotal"] / json["ratingCounter"];
    const starPercentage = (workerRating / starTotal) * 100;

    document.querySelector('.stars-inner2').style.width = starPercentage + '%';
    document.getElementById("noEvaluations").innerHTML = Math.round((workerRating + Number.EPSILON) * 100) / 100;

  }



});

//////////////////////////  ADDRESS AUTO COMPLETE  ////////////////////////////////////

var placesAutocomplete = places({
  appId: 'YOUR_API_ID',
  apiKey: 'YOUR_API_KEY',
  container: document.querySelector('#address-input')
});

//////////////////////////  TOGGLE PASSWORD  ////////////////////////////////////

$(".toggle-password").click(function () {

  $(this).toggleClass("fa-eye fa-eye-slash");

  var input = document.getElementById("passEdit");

  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
});


//////////////////////////  DATEPCIKER  ////////////////////////////////////

$(function () {
  $("#datepicker").datepicker({
    autoclose: true,
    endDate: '-18y'
  })
});

//////////////////////////  UPDATE USER  ////////////////////////////////////

function updateUser() {

  var user_id = sessionStorage.getItem('users_details');
  var json = JSON.parse(user_id);

  //////////////////////////////////////////

  if ($('#startDate').val() == "") {
    var dataAfter = "";
  } else {
    var dataBefore = $('#startDate').val().split("-"); //DD-MM-YYYY -> MM-DD-YYYY
    var dataAfter = dataBefore[1] + "-" + dataBefore[0] + "-" + dataBefore[2];
  }

  var dadosUpdate = {
    "_id": json["_id"],
    "name": $('#nameEdit').val(),
    "address": $('#address-input').val(),
    "email": $('#emailEdit').val(),
    "phoneNumber": $('#phoneEdit').val(),
    "gender": $("#inputState option:selected").text(),
    "birthdate": dataAfter,
    "password": $('#passEdit').val(),
    "photo": $("#profilePhoto").attr('src')
  };

  $.ajax({
    url: "http://localhost:8080/users/updateUser",
    type: "POST", //METODO DA API
    contentType: "application/json",
    data: JSON.stringify(dadosUpdate), // SE TIVER BODY USAS ISTO
    success: function (response) {

      Swal.fire({
        icon: 'success',
        title: 'Your profile has been updated',
        showConfirmButton: false,
        timer: 1500
      }).then(function () {
        sessionStorage.clear();

        sessionStorage.setItem('users_details', JSON.stringify(response)); //Save user data in browser for future actions 

        window.location = ("/profile");
      });


    },
    error: function (jqXHR, textStatus, errorThrown) {

      var feedback = JSON.parse(jqXHR.responseText);
      console.log(textStatus, errorThrown);



      for (var i = 0; i < feedback["errors"].length; i++) {

        var param = feedback["errors"][i]["param"];

        if (param == "name") {

          document.getElementById("nameEdit").classList.add("is-invalid");

        }

        if (param == "address") {

          document.getElementById("errorAddress").classList.add("d-block");
          document.getElementById("address-input").style.borderColor = "#dc3545";

        }

        if (param == "phoneNumber") {

          document.getElementById("phoneEdit").classList.add("is-invalid");

        }

        if (param == "birthdate") {

          document.getElementById("startDate").classList.add("is-invalid");

        }

        if (param == "password") {

          document.getElementById("passEdit").classList.add("is-invalid");


        }

      }

    }


  });

};

//////////////////////////  2 DIGITS NUMBER (DAY)  ////////////////////////////////////

function n(n) {
  return n > 9 ? "" + n : "0" + n;
}

//////////////////////////  LOAD PHOTO  ////////////////////////////////////

$('#img').change(function (e) {

  var file = e.target.files[0];

  var formData = new FormData();
  formData.append('img', file);

  $.ajax({
    url: "http://localhost:8080/photos/uploadPhoto",
    type: "POST", //METODO DA API
    contentType: false,
    processData: false,
    data: formData,
    success: function (response) {

      document.getElementById("profilePhoto").src = "images/uploads/" + response;

    },
    error: function (jqXHR, textStatus, errorThrown) {

      console.log(textStatus, errorThrown);


    }
  });

});