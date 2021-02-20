$(document).ready(function () {

    'use strict';

    // ------------------------------------------------------- //
    // LOAD NOTIFICATIONS
    // ------------------------------------------------------ //

    var user_id = sessionStorage.getItem('users_details');
    var json = JSON.parse(user_id);

    document.getElementById("navPhoto").src = json["photo"];

    var dadosNotification = {
        "user": json["_id"]
    };

    $.ajax({
        url: "http://localhost:8080/notifications/findNotifications",
        type: "POST", //METODO DA API
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(dadosNotification),
        success: function (response) {

            var notificationsList = document.getElementById("notificationsList");

            if (response.length == 0) {

                document.getElementById("notificationNumber").style.display = "none";

            } else {

                document.getElementById("notificationNumber").innerHTML = response.length;

                for (var i = 0; i < response.length; i++) {

                    if (response[i]["content"] == "Your service is over, you can evaluate your client") {


                        var li = document.createElement('li');
                        var a = document.createElement('a');
                        a.href = "#";
                        a.classList.add("dropdown-item");
                        li.appendChild(a);
                        var div1 = document.createElement("div");
                        div1.classList.add("notification");
                        a.appendChild(div1);
                        var div2 = document.createElement("div");
                        div2.classList.add("notification-content");
                        div1.appendChild(div2);
                        div2.innerHTML += '<i class="fas fa-tools bg-orange" aria-hidden="true"></i>';
                        div2.innerHTML += "Your service is over, you can evaluate your client";
                        notificationsList.appendChild(li);

                    } else if (response[i]["content"] == "A worker applied for your service") {

                        var li = document.createElement('li');
                        var a = document.createElement('a');
                        a.href = "#";
                        a.classList.add("dropdown-item");
                        li.appendChild(a);
                        var div1 = document.createElement("div");
                        div1.classList.add("notification");
                        a.appendChild(div1);
                        var div2 = document.createElement("div");
                        div2.classList.add("notification-content");
                        div1.appendChild(div2);
                        div2.innerHTML += '<i class="fa fa-user bg-purple" aria-hidden="true"></i>';
                        div2.innerHTML += "A worker applied for your service";
                        notificationsList.appendChild(li);

                    } else if (response[i]["content"] == "You have a new message") {

                        var li = document.createElement('li');
                        var a = document.createElement('a');
                        a.href = "#";
                        a.classList.add("dropdown-item");
                        li.appendChild(a);
                        var div1 = document.createElement("div");
                        div1.classList.add("notification");
                        a.appendChild(div1);
                        var div2 = document.createElement("div");
                        div2.classList.add("notification-content");
                        div1.appendChild(div2);
                        div2.innerHTML += '<i class="fa fa-envelope bg-blue" aria-hidden="true"></i>';
                        div2.innerHTML += "You have a new message";
                        notificationsList.appendChild(li);

                    } if (response[i]["content"] == "A service you applied for has been approved") {

                        var li = document.createElement('li');
                        var a = document.createElement('a');
                        a.href = "#";
                        a.classList.add("dropdown-item");
                        li.appendChild(a);
                        var div1 = document.createElement("div");
                        div1.classList.add("notification");
                        a.appendChild(div1);
                        var div2 = document.createElement("div");
                        div2.classList.add("notification-content");
                        div1.appendChild(div2);
                        div2.innerHTML += '<i class="fa fa-thumbs-up bg-green" aria-hidden="true"></i>';
                        div2.innerHTML += "A service you applied for has been approved";
                        notificationsList.appendChild(li);

                    } if (response[i]["content"] == "A service you applied for has been canceled") {

                        var li = document.createElement('li');
                        var a = document.createElement('a');
                        a.href = "#";
                        a.classList.add("dropdown-item");
                        li.appendChild(a);
                        var div1 = document.createElement("div");
                        div1.classList.add("notification");
                        a.appendChild(div1);
                        var div2 = document.createElement("div");
                        div2.classList.add("notification-content");
                        div1.appendChild(div2);
                        div2.innerHTML += '<i class="fa fa-ban bg-magenta" aria-hidden="true"></i>';
                        div2.innerHTML += "A service you applied for has been canceled";
                        notificationsList.appendChild(li);

                    }


                }

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log(textStatus, errorThrown);


        }
    });

    // ------------------------------------------------------- //
    // Clear notifications
    // ------------------------------------------------------ //
    $('#allNotifications').on('click', function () {

        $.ajax({
            url: "http://localhost:8080/notifications/clearNotifications",
            type: "POST", //METODO DA API
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(dadosNotification), // SE TIVER BODY USAS ISTO
            success: function (response) {



            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log(textStatus, errorThrown);


            }
        });

    });

    // ------------------------------------------------------- //
    // Add years to experience select
    // ------------------------------------------------------ //

    var expSelect = document.getElementById("selectExperience");

    var bithdate = (json["birthdate"]).substring(0, 10);
    var dateSplit = bithdate.split("-");
    var startingdate = parseInt(dateSplit[0]) + 18;

    var currentYear = new Date().getFullYear();

    for (var i = 0; i <= (currentYear - startingdate); i++) {

        var option = document.createElement("option");

        option.text = startingdate + i;
        expSelect.add(option);

    }

    // ------------------------------------------------------- //
    // Adding fade effect to dropdowns
    // ------------------------------------------------------ //
    $('.dropdown').on('show.bs.dropdown', function () {
        $(this).find('.dropdown-menu').first().stop(true, true).fadeIn();
    });
    $('.dropdown').on('hide.bs.dropdown', function () {
        $(this).find('.dropdown-menu').first().stop(true, true).fadeOut();
    });


    // ------------------------------------------------------- //
    // Sidebar Functionality
    // ------------------------------------------------------ //
    $('#toggle-btn').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('active');

        $('.side-navbar').toggleClass('shrinked');
        $('.content-inner').toggleClass('active');
        $(document).trigger('sidebarChanged');

        if ($(window).outerWidth() > 1183) {
            if ($('#toggle-btn').hasClass('active')) {
                $('.navbar-header .brand-small').hide();
                $('.navbar-header .brand-big').show();
            } else {
                $('.navbar-header .brand-small').show();
                $('.navbar-header .brand-big').hide();
            }
        }

        if ($(window).outerWidth() < 1183) {
            $('.navbar-header .brand-small').show();
        }
    });



    //////////////////////////  CHANGE/CREATE WORKER  ////////////////////////////////////

    $('#workerPopUP').click(function () {

        var user_id = sessionStorage.getItem('users_details');
        var json = JSON.parse(user_id);
        var workerState = json["workerState"];

        if (workerState == false) {
            $('#modalWorker').modal('show');

            $('#registerWorker').click(function () {

                var area = $("#inputState2 option:selected").text();

                var experience = $("#selectExperience option:selected").text();
                var currentYear = new Date().getFullYear();
                var finalExperience;

                if (experience == "When you start working...") {

                    finalExperience = "0";

                } else {

                    finalExperience = currentYear - parseInt(experience)

                }

                var userID = json["_id"];



                var dadosWorker = {

                    "user": userID,
                    "area": area,
                    "experience": finalExperience
                }

                $.ajax({
                    url: "http://localhost:8080/workers/createWorker",
                    type: "POST", //METODO DA API
                    contentType: "application/json",
                    data: JSON.stringify(dadosWorker), // SE TIVER BODY USAS ISTO
                    success: function (response) {

                        Swal.fire({
                            icon: 'success',
                            title: 'You became a worker',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(function () {
                            sessionStorage.clear();

                            sessionStorage.setItem('users_details', JSON.stringify(response)); //Save user data in browser for future actions 
                            window.location = ("/searchService");
                        });


                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                        var feedback = JSON.parse(jqXHR.responseText);
                        console.log(textStatus, errorThrown);



                        for (var i = 0; i < feedback["errors"].length; i++) {

                            var param = feedback["errors"][i]["param"];

                            if (param == "area") {

                                $("#areaWorker").addClass("is-invalid");
                                document.getElementById("errorSelect2").classList.add("d-block");
                                document.getElementById("inputState2").style.borderColor = "#dc3545";

                            }



                        }

                    }


                });



            });


        } else {

            let timerInterval
            Swal.fire({
                title: 'Changing to Worker!',
                timer: 1000,
                timerProgressBar: true,
                onBeforeOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                        const content = Swal.getContent()
                        if (content) {
                            const b = content.querySelector('b')
                            if (b) {
                                b.textContent = Swal.getTimerLeft()
                            }
                        }
                    }, 100)
                },
                onClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {

                window.location = ("/searchService");
            })

        }

    });


});


//////////////////////////  ADD USER NAME TO SIDEBARD  ////////////////////////////////////

$(document).ready(function () {
    var user_id = sessionStorage.getItem('users_details');
    var json = JSON.parse(user_id);
    var fullName = json["name"];

    if (countWords(fullName) > 1) {

        var names = fullName.split(' ');
        var firstName = names[0];
        var lastName = names[names.length - 1];
        var name = firstName.concat(" ").concat(lastName);

        document.getElementById("nameUser").innerHTML = name;

    } else {

        document.getElementById("nameUser").innerHTML = fullName;

    }

});

function countWords(str) {
    str = str.replace(/(^\s*)|(\s*$)/gi, "");
    str = str.replace(/[ ]{2,}/gi, " ");
    str = str.replace(/\n /, "\n");
    return str.split(' ').length;
}

//////////////////////////  CLEAR SESSION STORAGE  ////////////////////////////////////

function logout() {

    sessionStorage.clear();

}

