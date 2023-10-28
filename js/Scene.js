'use strict';

class TitleText extends GameObject {
    constructor(x, y) {
        super(x, y);
    }
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "blue";
        ctx.font = `bold ${screen.getX(300)}px さわらび明朝 `;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.fillText("大集合", 0, screen.getY(600));
        ctx.fillStyle = "gold";
        ctx.fillText("★", screen.getY(300), screen.getY(900));
        ctx.fillStyle = "orange";
        ctx.font = `bold ${screen.getX(900 / 8)}px selif `;
        ctx.fillText("サモンズめぇめぇ", 0, screen.getY(1100));
    }
}

class StartButton extends Button {
    constructor(rect, texture, text) {
        super(rect, texture, text);
        this.click = false;
        this.addEventListener("click", (e) => {
            const synth = new WebAudioTinySynth();
            synth.loadMIDI(assets.bgm1);
            //synth.playMIDI();
            console.log("click");
            game.inviting = true;
            this.click = true;
        });
    }
    update(screen) {
        super.update();
        if (this.click) {
            const wait = new WaitScene()
            screen.setScene(wait);
            this.click = false;
        }
    }
}

class WaitText extends GameObject {
    constructor(x, y) {
        super(x, y)
        this.txt = "..."
        this.count = 0;
    }
    update(screen) {
        this.count++;
        if (this.count > 30) {
            this.count = 0;
            this.txt = Array(1 + (this.txt.length + 1) % 4).join(".");
        }
    }
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "green";
        ctx.font = `bold ${screen.getX(900 / 8)}px selif `;
        ctx.fillText("対戦相手を", 0, screen.getY(1000));
        ctx.fillText("探しています" + this.txt, 0, screen.getY(1100));
    }
}

class EndButton extends Button {
    constructor(rect, texture, text) {
        super(rect, texture, text);
        this.click = false;
        this.addEventListener("click", (e) => {
            this.click = true;
        });
    }
    update(screen) {
        super.update();
        if (this.click) {
            const title = new TitleScene()
            screen.setScene(title);
            this.click = false;
        }
    }
}

class WinText extends GameObject {
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "red";
        ctx.font = `bold ${screen.getX(300)}px selif `;
        ctx.fillText("かった", 0, screen.getY(600));
    }
}

class LoseText extends GameObject {
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "blue";
        ctx.font = `bold ${screen.getX(300)}px selif `;
        ctx.fillText("まけた", 0, screen.getY(600));
    }
}

class TitleScene extends Scene {
    constructor() {
        super();
        const sogenImgae = new Texture(new Rect(0, 0, 64, 64), assets.sogen);
        this.addGameObject(new Sprite(new Rect(0, 0, 900, 1600), sogenImgae));
        const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
        this.addGameObject(new StartButton(new Rect(300, 1200, 300, 150), btnImage, "はじめる"));
        this.addGameObject(new TitleText());
        const memeImage = new Texture(new Rect(0, 0, 64, 64), assets.meme);
        this.addGameObject(new Sprite(new Rect(400, 1300, 300, 300), memeImage));
    }

}

class WaitScene extends Scene {
    constructor() {
        super();
        socket.emit('invite', "come on");
        const sogenImgae = new Texture(new Rect(0, 0, 64, 64), assets.sogen);
        this.addGameObject(new Sprite(new Rect(0, 0, 900, 1600), sogenImgae));
        this.addGameObject(new WaitText());
    }
}

class EndScene extends Scene {
    constructor(result) {
        super();
        const sogenImgae = new Texture(new Rect(0, 0, 64, 64), assets.sogen);
        this.addGameObject(new Sprite(new Rect(0, 0, 900, 1600), sogenImgae));
        if (result == "win") {
            this.addGameObject(new WinText());
        } else {
            this.addGameObject(new LoseText());
        }
        
        const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
        this.addGameObject(new EndButton(new Rect(300, 1000, 300, 150), btnImage, "タイトルへ"));
    }
}

class GameScene extends Scene {
    constructor() {
        super();
        console.log("game")
        const sogenImgae = new Texture(new Rect(0, 0, 64, 64), assets.sogen);
        this.addGameObject(new Sprite(new Rect(0, 0, 900, 1600), sogenImgae));
        for (let i=0; i<30; i++){
            this.addGameObject(new Saku(new Rect(i*30, 600-15, 30, 30)))
        }
    }

    nextTurn() {
        this.addGameObject(new CountText(400, 675));
        const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
        for (let i = 0; i < game.acts.length; i++) {
            console.log(game.acts[i]);
            this.addGameObject(new ActionButton(new Rect(300 * (i%3), 1200 + 150 * Math.floor(i / 3), 300, 150), btnImage, game.acts[i]));
        }
        for (let i = 0; i < game.mylife; i++) {
            this.addGameObject(new Banana(new Rect(100 * (i%9), 1100 + 100 * Math.floor(i / 9), 100, 100)));
        }
        for (let i = 0; i < game.enemylife; i++) {
            this.addGameObject(new Banana(new Rect(800 - 100 * (i%9), 0 + 100 * Math.floor(i / 9), 100, 100)));
        }
    }
}

class ActionButton extends Button {
    constructor(rect, texture, text) {
        super(rect, texture, game.types[text]);
        this.act = text;
        this.turn = game.turn;
        this.addEventListener("click", (e) => {
            if (game.act == "") {
                socket.emit("act", this.act);
            }
        });
    }
    update(screen) {
        if (game.turn!= this.turn || !game.selecting) {
            this.dispatchEvent("destroy", new GameEvent(this));
        }
    }
}

class CountText extends GameObject {
    constructor(x, y) {
        super(x, y)
        this._date = Date.now();
        this._count = 9;
    }
    update() {
        this._count = Math.floor(10 + (this._date - Date.now()) / 1000);
    }
    render(screen) {
        if (this._count > 0) {
            const ctx = screen.ctx;
            ctx.fillStyle = "red";
            ctx.font = `bold ${screen.getX(200)}px selif `;
            ctx.fillText(`${this._count}`, screen.getX(this.x), screen.getY(this.y));
        } else {
            this.dispatchEvent("destroy", new GameEvent(this));
        }
    }
}

class ActionText extends GameObject {
    constructor (type) {
        super();
        this.text = game.types[type];
    }
    update(screen){
        if(game.selecting) {
            this.dispatchEvent("destroy", new GameEvent(this));
        }
    }
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "green";
        const px = screen.getX(900/this.text.length);
        ctx.font = `bold ${px}px selif `;
        ctx.fillText(this.text, 0, screen.getY(1500 - px/2));
    }
}

class Saku extends Sprite {
    constructor(rect) {
        const sakuImage = new Texture(new Rect(0, 0, 16, 16), assets.saku);
        super(rect, sakuImage)
    }
}

class Banana extends Sprite {
    constructor(rect) {
        const bananaImage = new Texture(new Rect(0, 0, 16, 16), assets.banana);
        super(rect, bananaImage)
        this.turn = game.turn;
    }
    update() {
        if (game.turn!= this.turn) {

            console.log("des")
            this.dispatchEvent("destroy", new GameEvent(this));
        }
    }
}

class Meme extends Sprite {
    constructor(rect, myMeme) {
        const memeImage = new Texture(new Rect(0, 0, 64, 64), assets.meme);
        super(rect, memeImage)
        this.vecX = 0;
        this.vecY = 0;
        this.myMeme = myMeme;
        this.count = 0;
        this.speed = 2;
    }
    update(screen) {
        if (this.count < 150) {
            this.count ++;
            this.x -= this.speed;
            return
        }
        if (Math.random() * 30 < 1) {
            this.vecX = Math.floor(Math.random() * 3) - 1;
            this.vecY = Math.floor(Math.random() * 3) - 1;
        }
        this.x += this.vecX * this.speed;
        this.y += this.vecY * this.speed;
        this.x = Math.min(Math.max(this.x, 0), 900 - 200);
        let maxY;
        let minY;
        if (this.myMeme) {
            maxY = 1200 - 200;
            minY = 600;
        } else {
            maxY = 600 - 200;
            minY = 0;
        }
        this.y = Math.min(Math.max(this.y, minY), maxY);
    }
}
