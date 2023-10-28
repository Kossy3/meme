class Game {
    constructor (id) {
        this.id;
        this.inviting = false;
        this.playing = false;
        this.acts = [];
        this.meme = [];
        this.turn = 0;
        this.mylife = 3;
        this.enemylife = 3;
        this.act = "";
        this.selecting = false;
        this.types = {
            "call": "おいでおいで",
            "atk": "とつげき",
            "dfn": "くっしょん",
            "spAtk": "スーパーとつげき"
        }
    }

    nextTurn() {
        this.turn ++;
        this.act = "";
    }
}