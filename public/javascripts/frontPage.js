
///////////////////////////  CHANGE LOGIN-CREATE  ///////////////////////////////////

function changeToRegister() {
    var x = document.getElementById("idRegistar");
    var y = document.getElementById("idLogin");
    x.style.display = "block";
    y.style.display = "none";

    document.getElementById("addedButtons").style.marginTop = "42%";
}

function changeToLogin() {
    var x = document.getElementById("idRegistar");
    var y = document.getElementById("idLogin");
    x.style.display = "none";
    y.style.display = "block";

    document.getElementById("addedButtons").style.marginTop = "10%";
}

//////////////////////////  DATEPICKER  ////////////////////////////////////

$(document).ready(function () {

    $('.datepicker').datepicker({
        format: 'dd-mm-yyyy',
        toggleActive: true,
        startDate: '01-01-1950',
        endDate: '-18Y',


    }).on('changeDate', function (ev) {
        $(this).datepicker('hide');;


    });

});


//////////////////////////  API CONNECTION LOGIN  ////////////////////////////////////

function login() {

    var firstInput = $('.validate-input .firstForm');

    $('.validate-form .firstForm').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    /////////////////////////////////////////////////////////

    var dadosLogin = {
        "email": $('#emailLogin').val(),
        "password": $('#passLogin').val()
    };

    $.ajax({
        url: "http://localhost:8080/users/login",
        type: "POST", //METODO DA API
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(dadosLogin),
        success: function (response) {


            sessionStorage.setItem('users_details', JSON.stringify(response)); //Save user data in browser for future actions 

            window.location = ("/clientMap");


        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (jqXHR.status && jqXHR.status == 401) {
                for (var i = 0; i < firstInput.length; i++) {
                    if ($(firstInput[i]).attr('name') == 'email1') {
                        showValidate(firstInput[i]);
                    }
                }
            }

            if (jqXHR.status && jqXHR.status == 400) {
                for (var i = 0; i < firstInput.length; i++) {
                    if ($(firstInput[i]).attr('name') == 'password1') {
                        showValidate(firstInput[i]);
                    }
                }
            }

        }
    });
    return false;
}


//////////////////////////  API CONNECTION CREATE USER  ////////////////////////////////////

function createUser() {

    var secInput = $('.validate-input .secondForm');


    $('.validate-form2 .secondForm').each(function () {
        $(this).focus(function () {
            hideValidate2(this);
        });
    });

    $('.validate-form2 .secondForm').each(function () {
        $(this).focus(function () {
            hideValidate3(this);
        });
    });


    function showValidate2(secInput) {
        var thisAlert = $(secInput).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function showValidate3(secInput) {
        var thisAlert = $(secInput).parent().parent();

        $(thisAlert).addClass('alert-validate');


    }

    function hideValidate2(secInput) {
        var thisAlert = $(secInput).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    function hideValidate3(secInput) {
        var thisAlert = $(secInput).parent().parent();

        $(thisAlert).removeClass('alert-validate');
    }

    //////////////////////////////////////////////////////////////////////

    var result = isOdd(counter);

    if (result == 0) {
        var genderTxt = "Male";
    } else {
        genderTxt = "Female";
    }

    if ($('#birthdateCreate').val() == "") {
        var dataAfter = "";
    } else {
        var dataBefore = $('#birthdateCreate').val().split("-"); //DD-MM-YYYY -> MM-DD-YYYY
        dataAfter = dataBefore[1] + "-" + dataBefore[0] + "-" + dataBefore[2];
    }

    var dadosCreate = {

        "name": $('#nameCreate').val(),
        "address": $('#addressComplete').val(),
        "email": $('#emailCreate').val(),
        "phoneNumber": $('#phoneCreate').val(),
        "gender": genderTxt,
        "birthdate": dataAfter,
        "password": $('#passCreate').val(),
        "workerState": false

    };


    $.ajax({
        url: "http://localhost:8080/users/createUser",
        type: "POST", //METODO DA API
        contentType: "application/json",
        data: JSON.stringify(dadosCreate), // SE TIVER BODY USAS ISTO
        success: function (response) {

            Swal.fire({
                icon: 'success',
                title: 'Your account has been created',
                showConfirmButton: false,
                timer: 1500
            }).then(function () {
                window.location = ("/");
            });


        },
        error: function (jqXHR, textStatus, errorThrown) {

            var feedback = JSON.parse(jqXHR.responseText);



            for (var i = 0; i < feedback["errors"].length; i++) {

                var param = feedback["errors"][i]["param"];
                console.log(param);

                if (param == "name") {

                    showValidate2(document.getElementsByName('name'));


                }

                if (param == "address") {

                    showValidate3(document.getElementsByName('address'));

                }

                if (param == "email") {

                    if (feedback["errors"][i]["msg"] == "Invalid Email") {

                        showValidate3(document.getElementsByName('email'));

                    } else {

                        showValidate2(document.getElementsByName('email'));

                    }

                }

                if (param == "phoneNumber") {

                    showValidate2(document.getElementsByName('phone'));

                }

                if (param == "birthdate") {

                    showValidate2(document.getElementsByName('date'));

                }

                if (param == "password") {

                    showValidate2(document.getElementsByName('password2'));

                }

            }

        }


    });

    return false;
}

//////////////////////////  GENDER COUNTER  ////////////////////////////////////

// if the counter is even is male if not is female (odd)

var counter = 0;

function genderCounter() {

    counter = counter + 1;

}

function isOdd(num) {
    return num % 2;
}


////////////////////////// MONGODB DATA TO LOD  ////////////////////////////////////

function downloadRDFXML() {

    var basexml = '<?xml version="1.0" encoding="UTF-8"?>' + '\n' +
        '<rdf:RDF' + '\n' +
        'xmlns:dct="http://purl.org/dc/terms/"' + '\n' +
        'xmlns:foaf="http://xmlns.com/foaf/0.1/"' + '\n' +
        'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"' + '\n' +
        'xmlns:schema="http://schema.org/"' + '\n' +
        'xmlns:vcard="http://www.w3.org/2006/vcard/ns#"' + '\n' +
        'xmlns:frapo="http://purl.org/cerif/frapo/"' + '\n' +
        'xmlns:empower="http://purl.org/empower/vocab/1.0/">' + '\n' + '\n';


    var myObjAllUsers = allUsers();

    var userxml = "";

    for (var i = 0; i < myObjAllUsers.length; i++) {

        var workerState = 0;

        if (myObjAllUsers[i].workerState == true) {

            workerState = 1;

            var myJsonWorker = getWorkerInfo(myObjAllUsers[i]._id);

            userxml = userxml + '<rdf:Description rdf:about="http://localhost:8080/user/' + myJsonWorker[0].user[0]._id + '">' + '\n' +
                '<rdf:type rdf:resource="http://purl.org/empower/vocab/1.0/User"/>' + '\n' +
                '<dct:identifier rdf:resource="' + myJsonWorker[0].user[0]._id + '"/>' + '\n' + //VERIFICAR ESTE
                '<foaf:name rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#string">' + myJsonWorker[0].user[0].name + '</foaf:name>' + '\n' +
                '<schema:serviceType rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#string"> ' + myJsonWorker[0].area + '</schema:serviceType>' + '\n' +
                '<dct:type rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#boolean">' + workerState + '</dct:type>' + '\n';

            if (!(myJsonWorker[0].user[0].ratingCounter == null)) {
                userxml = userxml + '<empower:ratingCountAsClient rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#integer">' + myJsonWorker[0].user[0].ratingCounter + '</empower:ratingCountAsClient>' + '\n';
            }

            if (!(myJsonWorker[0].user[0].ratingTotal == null)) {
                userxml = userxml + '<empower:ratingValueAsClient rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#float">' + myJsonWorker[0].user[0].ratingTotal + '</empower:ratingValueAsClient>' + '\n';
            }

            if (!(myJsonWorker[0].ratingCounter == null)) {
                userxml = userxml + '<empower:ratingCountAsWorker rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#integer">' + myJsonWorker[0].ratingCounter + '</empower:ratingCountAsWorker>' + '\n';
            }

            if (!(myJsonWorker[0].ratingTotal == null)) {
                userxml = userxml + '<empower:ratingValueAsWorker rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#float">' + myJsonWorker[0].ratingTotal + '</empower:ratingValueAsWorker>' + '\n';
            }

            if (!(myJsonWorker[0].experience == "")) {
                userxml = userxml + '<empower:yearsOfExperience rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#integer">' + myJsonWorker[0].experience + '</empower:yearsOfExperience>' + '\n';
            }


            var myJsonObj = getServicesbyUser(myObjAllUsers[i]._id);

            for (var j = 0; j < myJsonObj.length; j++) {

                userxml = userxml + '<schema:offers rdf:resource="http://localhost:8080/service/' + myJsonObj[j]._id + '"/>' + '\n'

            }

            var myJsonRelation = getrelationsbyUser(myJsonWorker[0]._id);

            for (var j = 0; j < myJsonRelation.length; j++) {

                userxml = userxml + '<frapo:appliesFor rdf:resource="http://localhost:8080/service/' + myJsonRelation[j].service + '"/>' + '\n'

            }


        } else {

            userxml = userxml + '<rdf:Description rdf:about="http://localhost:8080/user/' + myObjAllUsers[i]._id + '">' + '\n' +
                '<rdf:type rdf:resource="http://purl.org/empower/vocab/1.0/User"/>' + '\n' +
                '<dct:identifier rdf:resource="' + myObjAllUsers[i]._id + '"/>' + '\n' + //VERIFICAR ESTE
                '<foaf:name rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#string">' + myObjAllUsers[i].name + '</foaf:name>' + '\n' +
                '<dct:type rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#boolean">' + workerState + '</dct:type>' + '\n';

            if (!(myObjAllUsers[i].ratingCounter == null)) {
                userxml = userxml + '<empower:ratingCountAsClient rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#integer">' + myObjAllUsers[i].ratingCounter + '</empower:ratingCountAsClient>' + '\n';
            }

            if (!(myObjAllUsers[i].ratingTotal == null)) {
                userxml = userxml + '<empower:ratingValueAsClient rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#float">' + myObjAllUsers[i].ratingTotal + '</empower:ratingValueAsClient>' + '\n';
            }


            var myJsonObj = getServicesbyUser(myObjAllUsers[i]._id);

            for (var j = 0; j < myJsonObj.length; j++) {

                userxml = userxml + '<schema:offers rdf:resource="http://localhost:8080/service/' + myJsonObj[j]._id + '"/>' + '\n'

            }

        }

        userxml = userxml + '</rdf:Description>' + '\n' + '\n'

    }

    basexml = basexml + userxml;

    var servicexml = "";

    var myObjAllServices = allServices();

    for (var i = 0; i < myObjAllServices.length; i++) {

        servicexml = servicexml + '<rdf:Description rdf:about="http://localhost:8080/service/' + myObjAllServices[i]._id + '"></rdf>' + '\n' +
            '<rdf:type rdf:resource="https://schema.org/Service"/>' + '\n' +
            '<dct:identifier rdf:resource="' + myObjAllServices[i]._id + '"/>' + '\n' +
            '<schema:serviceType rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#string"> ' + myObjAllServices[i].workArea + '</schema:serviceType>' + '\n' +
            '<schema:startDate rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#date">' + convertDate(myObjAllServices[i].startDate) + '</schema:startDate>' + '\n' +
            '<schema:endDate rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#date">' + convertDate(myObjAllServices[i].endDate) + '</schema:endDate>' + '\n';


        if (!(myObjAllServices[i].description == "")) {

            servicexml = servicexml + '<dct:description rdf:datatype="http://www.w3.org/TR/xmlschema11-2/#string">' + myObjAllServices[i].description + '</dct:description>' + '\n';

        }

        servicexml = servicexml + '</rdf:Description>' + '\n' + '\n';

    }

    basexml = basexml + servicexml;

    basexml = basexml + '</rdf:RDF>'

    var pom = document.createElement('a');

    var filename = "LinkedData.xml";
    var bb = new Blob([basexml], { type: 'application/xml' });

    pom.setAttribute('href', window.URL.createObjectURL(bb));
    pom.setAttribute('download', filename);

    pom.dataset.downloadurl = ['application/xml', pom.download, pom.href].join(':');
    pom.draggable = true;
    pom.classList.add('dragout');

    pom.click();

}

function getServicesbyUser(id) {

    return JSON.parse($.ajax({
        url: "http://localhost:8080/services/allServicesbyUser",
        type: "POST", //METODO DA API
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        global: false,
        async: false,
        data: JSON.stringify({ "user": id }),
        success: function (response3) {

            return response3;

        },
        error: function (jqXHR, textStatus, errorThrown) {


        }
    }).responseText);

}



function getWorkerInfo(id) {

    return JSON.parse($.ajax({
        url: "http://localhost:8080/workers/findWorkerbyUser",
        type: "POST", //METODO DA API
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        global: false,
        async: false,
        data: JSON.stringify({ "_id": id }),
        success: function (response2) {

            return response2;

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    }).responseText);

}


function getrelationsbyUser(id) {

    return JSON.parse($.ajax({
        url: "http://localhost:8080/relations/allRelationsbyWorker",
        type: "POST", //METODO DA API
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        global: false,
        async: false,
        data: JSON.stringify({ "worker": id }),
        success: function (response4) {

            return response4;

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    }).responseText);

}

function allUsers() {

    return JSON.parse($.ajax({
        url: "http://localhost:8080/users/allUsers",
        type: "GET", //METODO DA API
        contentType: "application/json",
        cache: false,
        dataType: 'json',
        global: false,
        async: false,
        dataType: 'json',
        success: function (response) {

            return response;

        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log(textStatus, errorThrown);


        }
    }).responseText);


}


function allServices() {

    return JSON.parse($.ajax({
        url: "http://localhost:8080/services/allServices",
        type: "GET", //METODO DA API
        contentType: "application/json",
        dataType: 'json',
        global: false,
        async: false,
        dataType: 'json',
        success: function (response5) {

            return response5;

        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log(textStatus, errorThrown);


        }
    }).responseText);
}

function n(n) {
    return n > 9 ? "" + n : "0" + n;
}

function convertDate(date) {

    var dateToSplit = date.substring(0, 10);
    var dateSplit = dateToSplit.split("-");
    var finalDate = dateSplit[0] + "-" + dateSplit[1] + "-" + (n(+dateSplit[2]));
    return finalDate;
}
