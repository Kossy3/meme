'use strict';

window.addEventListener("load", () => {
    let txt = document.getElementById("txt");
    let call = document.getElementById("call");
    let dfn = document.getElementById("dfn");
    let atk = document.getElementById("atk");
    let invite = document.getElementById("invite");
    let cancel = document.getElementById("cancel");
    let socket = io.connect("https://memeserver.kossy3.repl.co/", { withCredentials: true });
    let inviting = false;
    let inGame = false;
    let myid;
    socket.on('login', (id) => {
        myid = id;
        socket.emit('login', "test");
    });
    socket.on('invite', (id) => {
        console.log(id != myid)
        if (inviting && id != myid) {
            socket.emit('accept', id);
            inviting = false;
        }
    });
    socket.on('choose', () => {
        inGame = true;
    });
    socket.on("hello", (message) => {
        console.log(message);
    });
    socket.on("txt", (message) => {
        txt.innerHTML = message;
    });
    socket.on("result", (data) => {
        txt.innerHTML = data.message;
        if (data.end == "end") {
            inGame = false;
        };
    });
    call.addEventListener("click", () => {
        if (inGame) {
            socket.emit("act", "call");
        }
    });
    dfn.addEventListener("click", () => {
        if (inGame) {
            socket.emit("act", "dfn");
        }
    });
    atk.addEventListener("click", () => {
        if (inGame) {
            socket.emit("act", "atk");
        }
    });
    invite.addEventListener("click", () => {
        socket.emit("invite", "came on");
        inviting = true;
    });
    cancel.addEventListener("click", () => {
        inviting = false;
    });
})