//////////////////////////  CHANGE :HOVER SIDEBAR  ////////////////////////////////////
var apiResponse;

$(document).ready(function () {
      $("li").removeClass("active");
      $("#serviceHistory").addClass("active");

      var user_id = sessionStorage.getItem('users_details');
      var json = JSON.parse(user_id);

      //////////////////////////  COMPLETED SERVICES TABLE  ////////////////////////////////////

      var dadosCompleted = {

            "user": json["_id"],
            "state": "Completed"

      }

      $.ajax({
            url: "http://localhost:8080/services/clientServices",
            type: "POST", //METODO DA API
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(dadosCompleted), // SE TIVER BODY USAS ISTO
            success: function (response) {


                  apiResponse = response;

                  var table = document.getElementById("tableCompleted");

                  // CREATE HTML TABLE HEADER

                  var tr = table.insertRow(-1);                   // TABLE ROW.

                  var col = ['Work Area', 'Start Date', 'End Date', 'Location'];
                  var colResponse = ['workArea', 'startDate', 'endDate', 'address'];

                  for (var i = 0; i < col.length; i++) {
                        var th = document.createElement("th");      // TABLE HEADER.
                        th.innerHTML = col[i];
                        tr.appendChild(th);
                  }

                  // ADD JSON DATA TO THE TABLE AS ROWS.

                  for (var i = 0; i < response.length; i++) {

                        tr = table.insertRow(-1);

                        for (var j = 0; j < colResponse.length; j++) {

                              var tabCell = tr.insertCell(-1);


                              if (colResponse[j] == "startDate" || colResponse[j] == "endDate") {

                                    var dateToSplit = response[i][colResponse[j]].substring(0, 10);
                                    var dateSplit = dateToSplit.split("-");
                                    var finalDate = (n(+dateSplit[2])) + "-" + dateSplit[1] + "-" + dateSplit[0];

                                    tabCell.innerHTML = finalDate;

                              } else {

                                    tabCell.innerHTML = response[i][colResponse[j]];

                              }


                        }

                  }

            },
            error: function (jqXHR, textStatus, errorThrown) {

                  console.log(textStatus, errorThrown);


            }
      });

});

//////////////////////////  COMPLETED SERVICES TABLE  ////////////////////////////////////

$("#tableCompleted").delegate('tr', 'click', function () {

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

            var dadosWorkers = {

                  "service": servicePicked["_id"],
                  "state": true
            }

            $.ajax({
                  url: "http://localhost:8080/relations/listRelations",
                  type: "POST", //METODO DA API
                  contentType: "application/json",
                  dataType: 'json',
                  data: JSON.stringify(dadosWorkers), // SE TIVER BODY USAS ISTO
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


                        cell1.innerHTML = response[0]["worker"][0]["user"][0]["name"];

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
                                                "participant1": json["_id"],
                                                "participant2": response[0]["worker"][0]["user"][0]["_id"],
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
                                                "user": response[0]["worker"][0]["user"][0]["_id"]
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

                        });

                        // OPEN PROFILE

                        $('#btnProfile').on("click", function () {

                              var workerData = response[0]["worker"][0]["user"][0]["_id"];

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
                                          '<label class="form-control-label" id="label">Work Area: </label>' +
                                          '<label class="form-control-label" id="workOpen"></label>' +
                                          '</div>' +
                                          '<div class="form-group">' +
                                          '<label class="form-control-label" id="label">Experience: </label>' +
                                          '<label class="form-control-label" id="experienceOpen"></label>' +
                                          '</div>' +
                                          '<div class="form-group">' +
                                          '<label class="form-control-label" id="label">Rating: </label>' +
                                          '<div class="stars-outer" id="stars-outer">' +
                                          '<div class="stars-inner">' + '</div>' +
                                          '</div>' +
                                          '<label class="form-control-label" id="ratingOpen"></label>' +
                                          '</div>' +
                                          '</div>'

                              });

                              document.getElementById("picture").src = response[0]["worker"][0]["user"][0]["photo"];
                              document.getElementById("nameOpen").innerHTML = response[0]["worker"][0]["user"][0]["name"];
                              document.getElementById("addressOpen").innerHTML = response[0]["worker"][0]["user"][0]["address"];
                              document.getElementById("phoneOpen").innerHTML = response[0]["worker"][0]["user"][0]["phoneNumber"];
                              document.getElementById("ageOpen").innerHTML = getAge(response[0]["worker"][0]["user"][0]["birthdate"]);
                              document.getElementById("genderOpen").innerHTML = response[0]["worker"][0]["user"][0]["gender"];
                              document.getElementById("workOpen").innerHTML = response[0]["worker"][0]["area"];
                              document.getElementById("experienceOpen").innerHTML = response[0]["worker"][0]["experience"] + " years";

                              const starTotal = 5;

                              if (response[0]["worker"][0]["ratingCounter"] == null) {

                                    document.getElementById("ratingOpen").innerHTML = "No evaluations";

                              } else {

                                    var workerRating = response[0]["worker"][0]["ratingTotal"] / response[0]["worker"][0]["ratingCounter"];

                                    const starPercentage = (workerRating / starTotal) * 100;
                                    document.querySelector('.stars-inner').style.width = starPercentage + '%';
                                    document.getElementById("ratingOpen").innerHTML = Math.round((workerRating + Number.EPSILON) * 100) / 100;
                              }
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