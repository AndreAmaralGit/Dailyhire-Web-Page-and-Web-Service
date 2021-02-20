var idDestination;

//////////////////////////  CHANGE :HOVER SIDEBAR  ////////////////////////////////////

$(document).ready(function () {
    $("li").removeClass("active");
    $("#messages").addClass("active");

    //////////////////////////  ALL CONVERSATIONS  ////////////////////////////////////

    // inicia o client socketIO
    var socket = io();

    var user_id = sessionStorage.getItem("users_details");
    var json = JSON.parse(user_id);

    var dadosChat = {
        participant1: json["_id"],
    };

    $.ajax({
        url: "http://localhost:8080/chats/clientChats",
        type: "POST", //METODO DA API
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(dadosChat), // SE TIVER BODY USAS ISTO
        success: function (response) {
            // ADD JSON DATA TO THE TABLE AS ROWS.
            var chats = document.getElementById("chats");

            for (var i = 0; i < response.length; i++) {
                var li = document.createElement("li");

                var workerId;

                // ADD NAMES TO CHATS
                if (json["_id"] == response[i]["participant1"][0]["_id"]) {
                    var x = document.createElement("IMG");
                    x.setAttribute("src", response[i]["participant2"][0]["photo"]);
                    x.setAttribute("width", "55px");
                    x.setAttribute("height", "55px");
                    x.setAttribute("alt", "");
                    x.style.marginRight = "20px";
                    x.classList.add("rounded-circle");

                    li.appendChild(x);
                    li.style.marginBottom = "20px";
                    li.id = "individualChat";
                    li.style.cursor = "pointer";

                    li.innerHTML += response[i]["participant2"][0]["name"];


                } else {
                    var x = document.createElement("IMG");
                    x.setAttribute("src", response[i]["participant1"][0]["photo"]);
                    x.setAttribute("width", "55px");
                    x.setAttribute("height", "55px");
                    x.setAttribute("alt", "");
                    x.style.marginRight = "20px";
                    x.classList.add("rounded-circle");

                    li.appendChild(x);
                    li.style.marginBottom = "20px";
                    li.id = "individualChat";
                    li.style.cursor = "pointer";

                    li.innerHTML += response[i]["participant1"][0]["name"];

                }

                chats.appendChild(li);
            }

            var id;
            var sala;

            // CLICK ON THE LI

            $("#chats").on("click", "#individualChat", function () {
                document.getElementById("secondCard").style.visibility = "visible";
                document.getElementById("workerName").innerHTML = this.innerHTML;
                document.getElementById("listMessages").innerHTML = "";

                $('#listMessages').animate({ scrollTop: $('#listMessages').prop("scrollHeight") }, 500);

                // Criar sala
                sala = response[$(this).index()]["room"];

                socket.emit("room", sala);

                id = response[$(this).index()]["_id"];

                //Id Receiver Notification 

                if (json["_id"] == response[$(this).index()]["participant1"][0]["_id"]) {

                    idDestination = response[$(this).index()]["participant2"][0]["_id"];

                } else {

                    idDestination = response[$(this).index()]["participant1"][0]["_id"];

                }

                // LOAD PAST MESSAGES

                var dadosChat = {
                    chat: id,
                };

                $.ajax({
                    url: "http://localhost:8080/messages/findMessages",
                    type: "POST", //METODO DA API
                    contentType: "application/json",
                    data: JSON.stringify(dadosChat), // SE TIVER BODY USAS ISTO
                    success: function (response2) {
                        var ul = document.getElementById("listMessages");

                        for (var i = 0; i < response2.length; i++) {
                            var content = response2[i]["content"];

                            var line = document.createElement("li");
                            line.innerHTML = content;
                            // adicionar o nome do usuário quebra a linha e adicionar a mensagem à lista de mensagems
                            ul.appendChild(line);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        var feedback = JSON.parse(jqXHR.responseText);
                        console.log(textStatus, errorThrown);
                    },
                });
            });

            //////////////////////////  CHAT  ////////////////////////////////////

            // faz com que seja possível enviar mensagens com Enter
            document
                .getElementById("menssagem")
                .addEventListener("keypress", function (e) {
                    var key = e.which || e.keyCode;
                    if (key == 13) {
                        enviar_menssagem();
                    }
                });

            // adiciona um addEventListener para o botão de submit
            document
                .getElementById("enviar_menssagem")
                .addEventListener("click", enviar_menssagem);

            // cria a função que conecta no websocket e emite a mensagem
            function enviar_menssagem() {

                $('#listMessages').animate({ scrollTop: $('#listMessages').prop("scrollHeight") }, 500);

                // salva a mensagem como uma string
                msg = document.getElementById("menssagem").value;
                if (msg.length > 0) {
                    // concatena o nome de usuário e a mensagem para enviar ao socketIo
                    socket.emit("chat message", {
                        id: id,
                        msg: json["name"] + ": " + msg,
                        sala: sala,
                    });
                    // reseta o valor do input da mensagem
                    document.getElementById("menssagem").value = "";

                    var dadosNotification = {
                        content: "You have a new message",
                        user: idDestination,
                    };

                    $.ajax({
                        url: "http://localhost:8080/notifications/createNotification",
                        type: "POST", //METODO DA API
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify(dadosNotification),
                        success: function (response6) { },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(textStatus, errorThrown);
                        },
                    });
                }
            }

            // sempre que receber uma mensagem ela é adicionada a lista
            socket.on("chat message", function (msg) {
                // busca o elemento UL
                var ul = document.getElementById("listMessages");
                // cria um elemento LI
                var line = document.createElement("li");
                line.innerHTML = msg;
                // cria o elemento de quebra de linha
                let br = document.createElement("br");
                //li.appendChild(document.createTextNode(msg));
                // adicionar o nome do usuário quebra a linha e adicionar a mensagem à lista de mensagems
                ul.appendChild(line);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        },
    });
});
