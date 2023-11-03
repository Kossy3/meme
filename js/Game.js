class Game {
    constructor (id) {
        this.id;
        this.login = false;
        this.inviting = false;
        this.playing = false;
        this.acts = [];
        this.turn = 0;
        this.act = "";
        this.selecting = false;
        this.player = new Player();
        this.enemy = new Player();
        this.types = {
            "call": "　よぶ　",
            "atk": "とつげき",
            "dfn": "くっしょん",
            "spAtk": "スーパーとつげき",
            "dxAtk": "デラックスとつげき",
            "heso": "へそくり",
            "dbAtk": "ダブルとつげき", 
            "ult": "いっせいとつげき", 
            "spy": "　すぱい　", 
            "spDfn": "スーパーくっしょん", 
            "wairo": "　わいろ　"
        }
        this.name = "";
        this.winCount = 0;
    }
    reset() {
        this.player = new Player();
        this.enemy = new Player();
    }
    nextTurn() {
        this.turn ++;
        this.act = "";
    }
}

class Player {
    constructor() {
        this.meme = [];
        this.life = 3;
        this.banana = [];
        this.name = ""
    }
    atk(n, data) {
        for (let i=0; i < n; i++){
            this.meme[0].atk(data.success);
            if (data.wairo) {
                this.meme[0].reciveWairo();
            }
            if (game.player != this) {
                game.player.meme.push(this.meme[0]);
            } else {
                game.enemy.meme.push(this.meme[0]);
            }
            this.meme.splice(0, 1);
        }
    }
    dxAtk(data) {
        this.meme[0].dxAtk(data.success);
        if (data.wairo) {
            this.meme[0].reciveWairo();
        }
        if (game.player != this) {
            game.player.meme.push(this.meme[0]);
        } else {
            game.enemy.meme.push(this.meme[0]);
        }
        this.meme.splice(0, 1);
    }
    dfn(data) {
        this.meme[0].dfn(data.success);
    }
    heso(data) {
        for (let i=0; i < 2; i++){
            this.meme[0].heso(data.success);
            this.meme.splice(0, 1);
        }
    }
    damage(n) {
        for (let i=1; i <= n; i++) {
            this.banana[this.banana.length-i].damage();
        }   
    }

    spy(data) {
        this.meme[0].spy(data.success);
        this.meme.splice(0, 1);
    }
    wairo(data) {
        this.meme[0].wairo();
        this.meme.splice(0, 1);
    }
    spDfn(data) {
        this.meme[0].spDfn(data.success);
        this.meme.splice(0, 1);
    }
}