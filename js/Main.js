'use strict';


const assets = new Assets();
let socket;
let inviting = false;
let inGame = false;
let myid;

window.onload = () => {
    socket = io.connect("https://memeserver.kossy3.repl.co/", { withCredentials: true });
    
    socket.on('login', (id) => {
        myid = id;
        socket.emit('login', "test");
    });
    socket.on('invite', (id) => {
        console.log(id != myid)
        if (inviting && id != myid) {
            socket.emit('accept', id);
            inviting = false;
            screen.setScene(createGameScene())
        }
    });
    socket.on('choose', () => {
        inviting = false;
        screen.setScene(createGameScene())  
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

    assets.onLoadAll(() => {
        const screen = new Screen();
        let titleScene = new TitleScene();
        screen.setScene(titleScene);
    });
}

