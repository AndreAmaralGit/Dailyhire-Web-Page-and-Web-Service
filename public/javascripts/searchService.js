//////////////////////////  CHANGE :HOVER SIDEBAR  ////////////////////////////////////
var apiResponse = [];

var user_id = sessionStorage.getItem('users_details');
var json = JSON.parse(user_id);

$(document).ready(function () {

      //////////////////////////  SERVICES AVAILABLE TABLE  ////////////////////////////////////

      var dadosUser = {

            "_id": json["_id"]

      }

      $.ajax({
            url: "http://localhost:8080/workers/findWorkerbyUser",
            type: "POST", //METODO DA API
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(dadosUser),
            success: function (response) {

                  var dadosSearch = {

                        "workArea": response[0]["area"],
                        "state": "Pending",
                  }

                  // SEARCH THE SERVICES

                  $.ajax({
                        url: "http://localhost:8080/services/searchServices",
                        type: "POST", //METODO DA API
                        contentType: "application/json",
                        dataType: 'json',
                        data: JSON.stringify(dadosSearch),
                        success: function (response2) {

                              // REMOVE MY SERVICES

                              var responseUpdated = [];

                              for (var i = 0; i < response2.length; i++) {

                                    if (response2[i]["user"] == json["_id"]) {

                                    } else {
                                          responseUpdated.push(response2[i]);
                                    }

                              }

                              // SEARCH FOR RELATIONS 

                              /////////////////////////////////////////

                              //apiResponse = responseFinal;

                              var table = document.getElementById("tableAvailable");

                              // CREATE HTML TABLE HEADER

                              var tr = table.insertRow(-1);                   // TABLE ROW.

                              var col = ['Work Area', 'Start Date', 'End Date', 'Location'];
                              var colResponse = ['workArea', 'startDate', 'endDate', 'address'];

                              for (var i = 0; i < col.length; i++) {
                                    var th = document.createElement("th");      // TABLE HEADER.
                                    th.innerHTML = col[i];
                                    tr.appendChild(th);
                              }

                              ///////////////////////////////////////

                              for (var j = 0; j < responseUpdated.length; j++) {

                                    var dadosFinal = {
                                          "service": responseUpdated[j]["_id"],
                                          "worker": response[0]["_id"]
                                    }

                                    var service = responseUpdated[j];

                                    $.ajax({
                                          url: "http://localhost:8080/relations/searchRelation",
                                          type: "POST", //METODO DA API
                                          contentType: "application/json",
                                          dataType: 'json',
                                          async: false,
                                          data: JSON.stringify(dadosFinal), // SE TIVER BODY USAS ISTO
                                          success: function (response3) {

                                                if (response3.length > 0) {

                                                } else {

                                                      // LOAD TABLE 

                                                      apiResponse.push(service);

                                                      // ADD JSON DATA TO THE TABLE AS ROWS.

                                                      tr = table.insertRow(-1);

                                                      for (var j = 0; j < colResponse.length; j++) {

                                                            var tabCell = tr.insertCell(-1);


                                                            if (colResponse[j] == "startDate" || colResponse[j] == "endDate") {

                                                                  var dateToSplit = service[colResponse[j]].substring(0, 10);
                                                                  var dateSplit = dateToSplit.split("-");
                                                                  var finalDate = (n(+dateSplit[2])) + "-" + dateSplit[1] + "-" + dateSplit[0];

                                                                  tabCell.innerHTML = finalDate;

                                                            } else {

                                                                  tabCell.innerHTML = service[colResponse[j]];

                                                            }

                                                      }



                                                }

                                          },
                                          error: function (jqXHR, textStatus, errorThrown) {

                                                console.log(textStatus, errorThrown);


                                          }
                                    });

                              }

                        },
                        error: function (jqXHR, textStatus, errorThrown) {

                              console.log(textStatus, errorThrown);


                        }
                  });

            },
            error: function (jqXHR, textStatus, errorThrown) {

                  console.log(textStatus, errorThrown);


            }
      });

});

//////////////////////////  COMPLETED SERVICES TABLE  ////////////////////////////////////

$("#tableAvailable").delegate('tr', 'click', function () {

      if (this.rowIndex > 1) {
            $('#exampleModalCenter').modal('show');

            var rowNumber = this.rowIndex - 2;

            var servicePicked = apiResponse[rowNumber];


            var firstDate = apiResponse[rowNumber]["startDate"];
            var dateToSplit = firstDate.substring(0, 10);
            var dateSplit = dateToSplit.split("-");
            var finalDate = (n(+dateSplit[2])) + "-" + dateSplit[1] + "-" + dateSplit[0];

            var secondDate = apiResponse[rowNumber]["endDate"];
            var dateToSplit2 = secondDate.substring(0, 10);
            var dateSplit2 = dateToSplit2.split("-");
            var finalDate2 = (n(+dateSplit2[2])) + "-" + dateSplit2[1] + "-" + dateSplit2[0];

            $("#workArea").text(servicePicked["workArea"]);
            $("#startDate").text(finalDate);
            $("#endDate").text(finalDate2);
            $("#location").text(servicePicked["address"]);
            $("#description").text(servicePicked["description"]);

            ////////////////////////// WORKER ///////////////////////////////////

            var dadosClient = {

                  "_id": servicePicked["user"][0]
            }

            $.ajax({
                  url: "http://localhost:8080/users/findUser",
                  type: "POST", //METODO DA API
                  contentType: "application/json",
                  dataType: 'json',
                  data: JSON.stringify(dadosClient), // SE TIVER BODY USAS ISTO
                  success: function (response) {


                        var table = document.getElementById("workerOpen");

                        var tr = table.insertRow(-1);                   // TABLE ROW.

                        var col = ['Name', 'Chat', 'Profile'];

                        for (var i = 0; i < col.length; i++) {
                              var th = document.createElement("th");      // TABLE HEADER.
                              th.innerHTML = col[i];
                              tr.appendChild(th);

                        }

                        var tr = table.insertRow(-1);

                        var cell1 = tr.insertCell(0);
                        var cell2 = tr.insertCell(1);
                        var cell3 = tr.insertCell(2);


                        cell1.innerHTML = response["name"];

                        cell2.innerHTML = "<span id='btnChat' class='fa fa-comments'></span>";

                        cell3.innerHTML = "<span id='btnProfile' class='fa fa-user'></span>";

                        cell1.setAttribute("style", "font-size: small;");

                        //OPEN CHAT


                        $('#btnChat').on("click", function () {

                              $(document).off('focusin.modal');

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
                                                "participant1": response["_id"],
                                                "participant2": json["_id"],
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


                                    }
                              });

                        });

                        // OPEN PROFILE

                        $('#btnProfile').on("click", function () {

                              var clientData = response["_id"];

                              Swal.fire({
                                    title: 'Profile',
                                    showConfirmButton: false,
                                    showCancelButton: true,
                                    cancelButtonText: 'Close',
                                    showLoaderOnConfirm: true,
                                    html: '<div class="d-flex justify-content-center" id="uploadWrapper">' +
                                          '<img src="" alt="Avatar" id="picture" class="rounded-circle">' +
                                          '</div>' +
                                          '<div id="information">' +
                                          '<div class="form-group">' +
                                          '<label class="form-control-label" id="label">Name: </label>' +
                                          '<label class="form-control-label" id="nameOpen"></label>' +
                                          '</div>' +
                                          '<div class="form-group">' +
                                          '<label class="form-control-label" id="label">Address: </label>' +
                                          '<label class="form-control-label" id="addressOpen"></label>' +
                                          '</div>' +
                                          '<div class="form-group">' +
                                          '<label class="form-control-label" id="label">Phone Number: </label>' +
                                          '<label class="form-control-label" id="phoneOpen">o</label>' +
                                          '</div>' +
                                          '<div class="form-group">' +
                                          '<label class="form-control-label" id="label">Age: </label>' +
                                          '<label class="form-control-label" id="ageOpen"></label>' +
                                          '</div>' +
                                          '<div class="form-group">' +
                                          '<label class="form-control-label" id="label">Gender: </label>' +
                                          '<label class="form-control-label" id="genderOpen"></label>' +
                                          '</div>' +
                                          '<div class="form-group">' +
                                          '<label class="form-control-label" id="label">Client Rating: </label>' +
                                          '<div class="stars-outer" id="stars-outer">' +
                                          '<div class="stars-inner">' + '</div>' +
                                          '</div>' +
                                          '<label class="form-control-label" id="ratingOpen"></label>' +
                                          '</div>' +
                                          '</div>'

                              });

                              document.getElementById("picture").src = response["photo"];
                              document.getElementById("nameOpen").innerHTML = response["name"];
                              document.getElementById("addressOpen").innerHTML = response["address"];
                              document.getElementById("phoneOpen").innerHTML = response["phoneNumber"];
                              document.getElementById("ageOpen").innerHTML = getAge(response["birthdate"]);
                              document.getElementById("genderOpen").innerHTML = response["gender"];


                              const starTotal = 5;

                              if (response["ratingCounter"] == null) {

                                    document.getElementById("ratingOpen").innerHTML = "No evaluations";

                              } else {

                                    var workerRating = response["ratingTotal"] / response["ratingCounter"];

                                    const starPercentage = (workerRating / starTotal) * 100;
                                    document.querySelector('.stars-inner').style.width = starPercentage + '%';
                                    document.getElementById("ratingOpen").innerHTML = Math.round((workerRating + Number.EPSILON) * 100) / 100;
                              }

                        });


                        //////////////////////////  APPLY FOR SERVICE  ////////////////////////////////////

                        $('#completeService').on("click", function () {

                              var dadosWorker = {

                                    "_id": json["_id"]

                              }

                              $.ajax({
                                    url: "http://localhost:8080/workers/findWorkerbyUser",
                                    type: "POST", //METODO DA API
                                    contentType: "application/json",
                                    dataType: 'json',
                                    data: JSON.stringify(dadosWorker), // SE TIVER BODY USAS ISTO
                                    success: function (response5) {

                                          var dadosRelation = {

                                                "service": servicePicked["_id"],
                                                "worker": response5[0]["_id"]

                                          }


                                          $.ajax({
                                                url: "http://localhost:8080/relations/createRelation",
                                                type: "POST", //METODO DA API
                                                contentType: "application/json",
                                                dataType: 'json',
                                                data: JSON.stringify(dadosRelation),
                                                success: function (response6) {

                                                      Swal.fire({
                                                            icon: 'success',
                                                            title: 'You applied for the service',
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                      }).then(function () {
                                                            window.location = ("/searchService");
                                                      });

                                                },
                                                error: function (jqXHR, textStatus, errorThrown) {

                                                      console.log(textStatus, errorThrown);


                                                }
                                          });

                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {

                                          console.log(textStatus, errorThrown);


                                    }
                              });

                              var dadosNotification = {
                                    "content": "A worker applied for your service",
                                    "user": servicePicked["user"][0]
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



                        });



                  },
                  error: function (jqXHR, textStatus, errorThrown) {

                        console.log(textStatus, errorThrown);


                  }

            });

            $('#exampleModalCenter').on('hidden.bs.modal', function () {

                  $("#workerOpen tr").remove();
            });

      }
});

////////////////////////////// DATE TO AGE ///////////////////////////////////////////

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

//////////////////////////  2 DIGITS NUMBER (DAY)  ////////////////////////////////////

function n(n) {
      return n > 9 ? "" + n : "0" + n;
}

