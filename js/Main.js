'use strict';

const game = new Game();
let assets;
let screen;
const bgm = new BGM();

const socket = io.connect("https://memeserver.kossy3.repl.co/", { withCredentials: true });


window.onload = () => {
    assets = new Assets();
    assets.onLoadAll(() => {
        screen = new Screen();
        screen.setScene(new TitleScene());
    });
    socket.on('login', (id) => {
        game.id = id;
        fetch(`https://memeserver.kossy3.repl.co/sess`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"sess_id": id})
        }).then((response) => response.json())
          .then((data)=>{
            socket.emit('login', id);
            game.login = true;
            console.log("login", data);
            game.name = data.name;
            game.winCount = data.win;
         });
    });
    socket.on('invite', (id) => {
        if (game.inviting && id != game.id) {
            socket.emit('accept', id);
        }
    });
    socket.on('name', (name) => {
        game.name = name;
    });
    socket.on('start', (enemy) => {
        game.inviting = false;
        game.playing = false;
        game.reset();
        game.player.name = game.name;
        game.enemy.name = enemy.name;
        screen.scene.start(enemy);
    });
    socket.on('select', (acts) => {
        game.nextTurn();
        game.acts = acts;
        game.selecting = true;
        if (!game.playing) {
            game.playing = true;
            screen.setScene(new GameScene());
            let meme1 = new Meme(new Rect(900, 200, 200, 200), false)
            screen.scene.addGameObject(meme1);
            game.enemy.meme.push(meme1);
            let meme2 = new Meme(new Rect(900, 800, 200, 200), true)
            screen.scene.addGameObject(meme2);
            game.player.meme.push(meme2);
        }
        screen.scene.nextTurn();
    });
    socket.on('selected', (type) => {
        game.act = type;
        game.selecting = false;
        const label = new ActionText(type);
        screen.scene.addGameObject(label);
    });
    socket.on("result", (data) => {
        game.selecting = false;
        console.log(data);
        if (data.end) {
            game.playing = false;
            game.inviting = false;
            setTimeout(() => { screen.setScene(new EndScene(data.message)) }, 3000);

        }

        if (data.player.act == "call") {
            let meme = new Meme(new Rect(900, 800, 200, 200), true)
            screen.scene.addGameObject(meme);
            game.player.meme.push(meme);
        }
        if (data.enemy.act == "call") {
            let meme = new Meme(new Rect(900, 200, 200, 200), false)
            screen.scene.addGameObject(meme);
            game.enemy.meme.push(meme);
        }
        if (data.player.act == "atk") {
            game.player.atk(1, data.player.success);
        }
        if (data.enemy.act == "atk") {
            game.enemy.atk(1, data.enemy.success);
        }
        if (data.player.act == "spAtk") {
            game.player.atk(3, data.player.success);
        }
        if (data.enemy.act == "spAtk") {
            game.enemy.atk(3, data.enemy.success);
        }
        if (data.player.act == "dfn") {
            game.player.dfn(data.player.success);
        }
        if (data.enemy.act == "dfn") {
            game.enemy.dfn(data.enemy.success);
        }
        if (game.player.life > data.player.life) {
            game.player.damage();
        }
        if (game.enemy.life > data.enemy.life) {
            game.enemy.damage();
        }

        game.player.life = data.player.life;
        game.enemy.life = data.enemy.life;
    });

    socket.io.on("error", (error) => {
        alert("接続エラーが発生しました。");
        location.reload();
      });
}

