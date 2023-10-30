'use strict';
class BGM {
    constructor() {
        this.synth = new WebAudioTinySynth();
        this.playing = false;
        this.vol = 0.1;
    }
    play() {
        if (!this.playing) {
            setInterval(this._loop, 70000);
            this._loop();
        }
        
    }

    _loop() {
        this.synth.loadMIDI(assets.bgm1);
        this.synth.setMasterVol(this.vol);
        this.synth.playMIDI();
    }
}

class TitleText extends GameObject {
    constructor(x, y) {
        super(x, y);
    }
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "blue";
        ctx.font = `bold ${screen.getX(300)}px sans-serif `;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.fillText("大集合", 0, screen.getY(600));
        ctx.fillStyle = "gold";
        ctx.fillText("★", screen.getY(300), screen.getY(900));
        ctx.fillStyle = "orange";
        ctx.font = `bold ${screen.getX(900 / 8)}px sans-serif `;
        ctx.fillText("サモンズめぇめぇ", 0, screen.getY(1100));
    }
}

class LoginText extends GameObject {
    constructor(x, y) {
        super(x, y);
        this._txt = "..."
        this._count = 0;
    }
    update(screen) {
        if (game.login) {
            this._destroy();
            const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
            this._spawn(new StartButton(new Rect(300, 1200, 300, 150), btnImage, "　はじめる　"));
        }
        this._count++;
        if (this._count > 5) {
            this._count = 0;
            this._txt = Array(1 + (this._txt.length + 1) % 4).join(".");
        }
    }
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "green";
        ctx.font = `bold ${screen.getX(300 / 6)}px sans-serif `;
        ctx.fillText("ログイン中"+this._txt, screen.getX(300), screen.getY(1300));
    }
}

class StartButton extends Button {
    constructor(rect, texture, text) {
        super(rect, texture, text);
        this.click = false;
        this.addEventListener("click", (e) => {
            bgm.play();
            console.log("click");
            game.inviting = true;
            this.click = true;
        });
    }
    update(screen) {
        if (this.click) {
            const wait = new WaitScene()
            screen.setScene(wait);
            this.click = false;
        }
    }
}

class SettingButton extends Button {
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
            const setting = new SettingScene();
            screen.setScene(setting);
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
        ctx.font = `bold ${screen.getX(900 / 8)}px sans-serif `;
        ctx.fillText("対戦相手を", screen.getX(900 / 5), screen.getY(1000));
        ctx.fillText("探しています" + this.txt, screen.getX(900 / 5 - 900 / 8), screen.getY(1100));
    }
}

class EndButton extends Button {
    constructor(rect, texture, text) {
        super(rect, texture, text);
        this.click = false;
        this.addEventListener("click", (e) => {
            this.click = true;
            const synth = new WebAudioTinySynth();
            synth.loadMIDI(assets.pi);
            synth.setMasterVol(0.1);
            synth.playMIDI();
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
        ctx.font = `bold ${screen.getX(300)}px sans-serif `;
        ctx.fillText("かった", 0, screen.getY(600));
    }
}

class LoseText extends GameObject {
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "blue";
        ctx.font = `bold ${screen.getX(300)}px sans-serif `;
        ctx.fillText("まけた", 0, screen.getY(600));
    }
}

class TitleScene extends Scene {
    constructor() {
        super();
        const sogenImgae = new Texture(new Rect(0, 0, 64, 64), assets.sogen);
        this.addGameObject(new Sprite(new Rect(0, 0, 900, 1600), sogenImgae));
        const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
        this.addGameObject(new LoginText());
        this.addGameObject(new TitleText());
        const memeImage = new Texture(new Rect(0, 0, 64, 64), assets.meme);
        // this.addGameObject(new SettingButton(new Rect(0, 1200, 200, 150), btnImage, "　設定　"));
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

class SettingScene extends Scene {
    constructor(result) {
        super();
        let textarea = document.createElement('input');
        textarea.type = '';
        document.body.appendChild(textarea);
        textarea.value = "x: " + x + " y: " + y;
        textarea.style.position = 'absolute';
        textarea.style.top =  '0px';
        textarea.style.left = '0px';
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
        for (let i = 0; i < 30; i++) {
            if (i == 12) { i += 6 }
            this.addGameObject(new Saku(new Rect(i * 30, 600 - 15, 30, 30)))
        }
    }

    nextTurn() {
        this.addGameObject(new CountText(383, 675));
        const btnImage = new Texture(new Rect(0, 0, 16, 16), assets.button);
        for (let i = 0; i < game.acts.length; i++) {
            console.log(game.acts[i]);
            this.addGameObject(new ActionButton(new Rect(300 * (i % 3), 1200 + 150 * Math.floor(i / 3), 300, 150), btnImage, game.acts[i]));
        }
        game.player.banana.splice(0)
        for (let i = 0; i < game.player.life; i++) {
            const banana = new Banana(new Rect(100 * (i % 9), 1100 + 100 * Math.floor(i / 9), 100, 100));
            this.addGameObject(banana);
            game.player.banana.push(banana);
        }
        game.enemy.banana.splice(0)
        for (let i = 0; i < game.enemy.life; i++) {
            const banana = new Banana(new Rect(800 - 100 * (i % 9), 0 + 100 * Math.floor(i / 9), 100, 100))
            this.addGameObject(banana);
            game.enemy.banana.push(banana)
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
            const synth = new WebAudioTinySynth();
            synth.loadMIDI(assets.pi);
            synth.setMasterVol(0.1);
            synth.playMIDI();
        });
    }
    update(screen) {
        if (game.turn != this.turn || !game.selecting) {
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
            ctx.font = `bold ${screen.getX(200)}px sans-serif `;
            ctx.fillText(`${this._count}`, screen.getX(this.x), screen.getY(this.y));
        } else {
            this.dispatchEvent("destroy", new GameEvent(this));
        }
    }
}

class ActionText extends GameObject {
    constructor(type) {
        super();
        this.text = game.types[type];
    }
    update(screen) {
        if (game.selecting) {
            this.dispatchEvent("destroy", new GameEvent(this));
        }
    }
    render(screen) {
        const ctx = screen.ctx;
        ctx.fillStyle = "green";
        const px = screen.getX(900 / this.text.length);
        ctx.font = `bold ${px}px sans-serif `;
        ctx.fillText(this.text, 0, screen.getY(1500 - px / 2));
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
        this._damaged = 0;
    }
    update() {
        if (game.turn != this.turn) {
            this.dispatchEvent("destroy", new GameEvent(this));
        }
    }
    render(screen) {
        if (this._damaged > 0) {
            if (this._damaged % 10 < 5) {
                super.render(screen);

            }
            this._damaged++;
        } else {
            super.render(screen);
        }
    }
    damage() {
        this._damaged = 1;
        console.log("nana")
    }
}

class Meme extends Sprite {
    constructor(rect, myMeme) {
        const memeImage = new Texture(new Rect(0, 0, 64, 64), assets.meme);
        super(rect, memeImage)
        this._vecX = 0;
        this._vecY = 0;
        this._myMeme = myMeme;
        this._initcnt = 0;
        this._speed = 2;
        this._cnt = 0;
        this._go = false;
        this._atk = false;
        this._dfn = false;
        this._angle = 0;
        this._away = false;
        this._awayX = Math.random() * 900;
    }
    atk(success = false) {
        this._go = true;
        this._atk = success;
        this._away = !success;
    }
    dfn(success = false) {
        this._go = true;
        this._dfn = true;
        this._away = !success;
        this.texture = new Texture(new Rect(0, 0, 64, 64), assets.kushon);
        setTimeout(() => {
            this._dfn = false;
            this.texture = new Texture(new Rect(0, 0, 64, 64), assets.meme);
        }, 4000);
    }
    gotoCenter() {
        if (this._myMeme) {
            this.x += (350 - this.x) / (30 - this._cnt);
            this.y += (550 - this.y) / (30 - this._cnt);
        } else {
            this.x += (350 - this.x) / (30 - this._cnt);
            this.y += (450 - this.y) / (30 - this._cnt);
        }
    }
    gotoBanana(myBanana) {
        if (myBanana) {
            this.x += (0 - this.x) / (30 - this._cnt);
            this.y += (1000 - this.y) / (30 - this._cnt);
        } else {
            this.x += (700 - this.x) / (30 - this._cnt);
            this.y += (0 - this.y) / (30 - this._cnt);
        }

    }
    gotoAway(myMeme) {
        if (myMeme) {
            this.x += (this._awayX - this.x) / (30 - this._cnt);
            this.y += (1200 - this.y) / (30 - this._cnt);
        } else {
            this.x += (this._awayX - this.x) / (30 - this._cnt);
            this.y += (0 - this.y) / (30 - this._cnt);
        }
    }
    update(screen) {
        if (this._initcnt < 150) {
            this._initcnt++;
            this.x -= this._speed;
            return
        }
        if (this._go > 0) {
            this.gotoCenter();
            this._cnt++;
            if (this._cnt == 30) {
                this._go = false;
                this._cnt = 0;
            }
            return;
        }
        if (this._away > 0) {
            this.gotoAway(this._myMeme);
            this._angle += 10
            this._cnt++;
            if (this._cnt == 30) {
                this._away = false;
                this._cnt = 0;
                this._angle = 0;
                if (!this._dfn) {
                    this.dispatchEvent("destroy", new GameEvent(this));
                }
            }
            return;
        }
        if (this._atk) {
            this.gotoBanana(!this._myMeme);
            this._cnt++;
            if (this._cnt == 30) {
                this.dispatchEvent("destroy", new GameEvent(this));
                this._atk = false;
                this._cnt = 0;
            }
            return;
        }
        if (Math.random() * 30 < 1) {
            this._vecX = Math.floor(Math.random() * 3) - 1;
            this._vecY = Math.floor(Math.random() * 3) - 1;
        }
        this.x += this._vecX * this._speed;
        this.y += this._vecY * this._speed;
        this.x = Math.min(Math.max(this.x, 0), 900 - 200);
        let maxY;
        let minY;
        if (this._myMeme) {
            maxY = 1200 - 150;
            minY = 600 - 50;
        } else {
            maxY = 600 - 150;
            minY = -50;
        }
        this.y = Math.min(Math.max(this.y, minY), maxY);
    }

    render(screen) {
        if (this._angle > 0) {
            this._angle += 10;
            const ctx = screen.ctx;
            const TO_RADIANS = Math.PI / 180;
            // コンテキストを保存する
            ctx.save();
            // 回転の中心に原点を移動する
            ctx.translate(screen.getX(this.x + 100), screen.getY(this.y + 100));
            // canvasを回転する
            ctx.rotate(this._angle * TO_RADIANS);
            const rect = this.texture.rect;
            ctx.drawImage(this.texture.image,
                rect.x, rect.y,
                rect.w, rect.h,
                -screen.getX(this.w) / 2, -screen.getY(this.h) / 2,
                screen.getX(this.w), screen.getY(this.h));
            // コンテキストを元に戻す
            ctx.restore();
        } else {
            super.render(screen);
        }

    }
}
