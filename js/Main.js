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
            body: JSON.stringify({"sess_id": game.id})
        }).then((response) => response.json())
          .then((data)=>{
            socket.emit('login', id);
            game.login = true;
            console.log("login", data);
            game.name = data.name;
            game.winCount = data.win;
         });
    });
    socket.on('error', (msg) => {
        console.error(msg);
        alert("Error: " + msg);
    });
    socket.on('invite', (id) => {
        if (game.inviting && id != game.id) {
            socket.emit('accept', id);
        }
    });
    socket.on('name', (name) => {
        game.name = name;
    });
    socket.on('spAct', (types) => {
        screen.scene.spAct(types);
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
            game.player.atk(1, data.player);
        }
        if (data.enemy.act == "atk") {
            game.enemy.atk(1, data.enemy);
        }
        if (data.player.act == "spAtk") {
            game.player.atk(3, data.player);
        }
        if (data.enemy.act == "spAtk") {
            game.enemy.atk(3, data.enemy);
        }
        if (data.player.act == "dfn") {
            game.player.dfn(data.player);
        }
        if (data.enemy.act == "dfn") {
            game.enemy.dfn(data.enemy);
        }
        if (data.player.act == "dxAtk") {
            game.player.dxAtk(data.player);
        }
        if (data.enemy.act == "dxAtk") {
            game.enemy.dxAtk(data.enemy);
        }
        if (data.player.act == "heso") {
            game.player.heso(data.player);
        }
        if (data.enemy.act == "heso") {
            game.enemy.heso(data.enemy);
        }
        if (data.player.act == "dbAtk") {
            game.player.atk(2, data.player);
        }
        if (data.enemy.act == "dbAtk") {
            game.enemy.atk(2, data.enemy);
        }
        if (data.player.act == "ult") {
            game.player.atk(10, data.player);
        }
        if (data.enemy.act == "ult") {
            game.enemy.atk(10, data.enemy);
        }
        if (data.player.act == "spy") {
            game.player.spy(data.player);
        }
        if (data.enemy.act == "spy") {
            game.enemy.spy(data.enemy);
        }
        if (data.player.act == "spDfn") {
            game.player.spDfn(data.player);
        }
        if (data.enemy.act == "spDfn") {
            game.enemy.spDfn(data.enemy);
        }
        if (data.player.act == "wairo") {
            game.player.wairo(data.player);
        }
        if (data.enemy.act == "wairo") {
            game.enemy.wairo(data.enemy);
        }
        if (game.player.life > data.player.life) {
            game.player.damage(game.player.life - data.player.life);
        }
        if (game.enemy.life > data.enemy.life) {
            game.enemy.damage(game.enemy.life - data.enemy.life);
        }

        game.player.life = data.player.life;
        game.enemy.life = data.enemy.life;
    });

    socket.io.on("error", (error) => {
        alert("接続エラーが発生しました。");
        location.reload();
      });
}

