'use strict';

const game = new Game();
let assets;
let screen;

const socket = io.connect("https://memeserver.kossy3.repl.co/", { withCredentials: true });


window.onload = () => {
    assets = new Assets();
    assets.onLoadAll(() => {
        screen = new Screen();
        screen.setScene(new TitleScene());
    });
    socket.on('login', (id) => {
        game.id = id;
        socket.emit('login', "test");
        console.log("login");
    });
    socket.on('invite', (id) => {
        if (game.inviting && id != game.id) {
            socket.emit('accept', id);
        }
    });
    socket.on('select', (acts) => {
        game.nextTurn();
        game.acts = acts;
        game.selecting = true;
        if (game.inviting) {
            game.inviting = false;
            game.playing = true;
            screen.setScene(new GameScene());

        }
        screen.scene.nextTurn();
    });
    socket.on('selected', (type) => {
        game.act = type;
        game.selecting = false;
        const label = new ActionText(type);
        screen.scene.addGameObject(label);
    });
    socket.on("txt", (message) => {
        txt.innerHTML = message;
    });
    socket.on("result", (data) => {
        game.selecting = false;
        txt.innerHTML = data.message;
        console.log(data);
        if (data.end) {
            game.playing = false;
            game.inviting = false;
            screen.setScene(new EndScene(data.message))
        } else {
            game.mylife = data.you.life;
            game.enemylife = data.enemy.life;
            if (data.you.act == "call") {
                let meme = new Meme(new Rect(900, 800, 200, 200), true)
                screen.scene.addGameObject(meme);
                game.meme.push(meme);
            } 
        }

    });
}

