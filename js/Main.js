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
            game.reset();
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
            setTimeout(() => { screen.setScene(new EndScene(data.message)) }, 3000);

        }

        if (data.you.act == "call") {
            let meme = new Meme(new Rect(900, 800, 200, 200), true)
            screen.scene.addGameObject(meme);
            game.player.meme.push(meme);
        }
        if (data.enemy.act == "call") {
            let meme = new Meme(new Rect(900, 200, 200, 200), false)
            screen.scene.addGameObject(meme);
            game.enemy.meme.push(meme);
        }
        if (data.you.act == "atk") {
            game.player.atk(1);
        }
        if (data.enemy.act == "atk") {
            game.enemy.atk(1);
        }
        if (data.you.act == "spAtk") {
            game.player.atk(3);
        }
        if (data.enemy.act == "spAtk") {
            game.enemy.atk(3);
        }
        if (data.you.act == "dfn") {
            game.player.dfn();
        }
        if (data.enemy.act == "dfn") {
            game.enemy.dfn();
        }
        if (game.player.life > data.you.life) {
            game.player.damage();
        }
        if (game.enemy.life > data.enemy.life) {
            game.enemy.damage();
        }

        game.player.life = data.you.life;
        game.enemy.life = data.enemy.life;


    });
}

