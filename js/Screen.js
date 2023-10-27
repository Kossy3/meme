'use strict';

class Screen {
    constructor() {
        this.content = document.getElementById("content");
        this.c = document.getElementById('view');
        this.w = 900;
        this.h = 1600;
        this.scene = new Scene();
        this.c.addEventListener("click", e => this.scene.onclick(e, this), false);
        this.c.addEventListener("mousedown", e => this.scene.onmousedown(e, this), false);
        window.addEventListener("mouseup", e => this.scene.onmouseup(e, this), false);
        setInterval(() => {this.draw()}, 1);
    }
    getX(x) {
        return x / this.w * this.c.width;
    }
    getY(y) {
        return y / this.h * this.c.height;
    }
    resize() {
        this.c.width = this.content.clientWidth;
        this.c.height = this.content.clientHeight;
    }
    setScene(scene) {
        this.scene = scene;
    }
    draw() {
        this.resize();
        let ctx = this.c.getContext('2d');
        // context setting
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        this.scene.draw(ctx, this);
    }
}
class Scene {
    constructor() {
        this.gameobjects = new Array();
    }
    addObject(gameobject) {
        this.gameobjects.push(gameobject);
    }
    draw(ctx, screen) {
        for (let i = 0; i < this.gameobjects.length; i++) {
            this.gameobjects[i].draw(ctx, screen);
        };
    }
    mouseEvent(e, screen, callback) {
        let sc = e.target.getBoundingClientRect();
        let mouseX = e.clientX - sc.left;
        let mouseY = e.clientY - sc.top;
        for (let i = this.gameobjects.length - 1; i >= 0; i--) {
            let gameobject = this.gameobjects[i];
            if (!gameobject.config) { continue; }
            let x = screen.getX(gameobject.config.dx);
            let y = screen.getY(gameobject.config.dy);
            let w = screen.getX(gameobject.config.dw);
            let h = screen.getY(gameobject.config.dh);
            if (x < mouseX && mouseX < x + w) {
                if (y < mouseY && mouseY < y + h) {
                    callback(gameobject, e)
                    break;
                }
            }
        }
    }
    onclick(e, screen) {
        this.mouseEvent(e, screen, (gameobject, e) => {gameobject.onclick(e)});
    }

    onmousedown(e, screen) {
        this.mouseEvent(e, screen, (gameobject, e) => {gameobject.onmousedown(e)});
    }
    onmouseup(e, screen) {
        for (let i = this.gameobjects.length - 1; i >= 0; i--) {
            let gameobject = this.gameobjects[i];
            gameobject.onmouseup(e);
        }
    }
}

class GameObject {
    draw(){}
    onclick(){}
    onmousedown(){}
    onmouseup(){}
}

class Label extends GameObject{
    constructor(text, config) {
        this.text = text;
        this.config = image2d.config;
    }
}

class Button extends GameObject{
    constructor(callback, image2d) {
        super()
        this.shadow = true;
        this.onclick = callback;
        this.onmousedown = () => {
            this.shadow = false;
        }
        this.onmouseup = () => {
            this.shadow = true;
        }
        this.image2d = image2d;
        this.config = image2d.config;
    }
    draw(ctx, screen) {
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        if (this.shadow){
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
        }
        this.image2d.draw(ctx, screen);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
}

class Image2D extends GameObject{
    constructor(image, config) {
        super()
        this.image = image;
        this.config = config;
    }
    draw(ctx, screen) {
        if (this.config.sx && this.config.sy && this.config.sw && config.sh) {
            ctx.drawImage(
                this.image,
                screen.getX(this.config.sx),
                screen.getY(this.config.sy),
                screen.getX(this.config.sw),
                screen.getY(this.config.sh),
                screen.getX(this.config.dx),
                screen.getY(this.config.dy),
                screen.getX(this.config.dw),
                screen.getY(this.config.dh)
            );
        } else if (this.config.dw && this.config.dh) {
            ctx.drawImage(
                this.image,
                screen.getX(this.config.dx),
                screen.getY(this.config.dy),
                screen.getX(this.config.dw),
                screen.getY(this.config.dh)
            );
        } else {
            ctx.drawImage(
                this.image,
                screen.getX(this.config.dx),
                screen.getY(this.config.dy),
            );
        }
    }
}
class Config {
    static d(x, y, w, h) {
        return { dx: x, dy: y, dw: w, dh: h }
    }
}

class TitleText extends GameObject {
    draw(ctx, screen) {
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
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = "green";
        ctx.font = `bold ${screen.getX(900 / 12)}px さわらび明朝 `;
        ctx.fillText("はじめる", screen.getX(900 / 3), screen.getY(1300));
    }
}

class WaitText extends GameObject {
    constructor(){
        super()
        this.txt = "..."
        this.count = 0;
    }
    draw(ctx, screen) {
        this.count ++;
        if (this.count > 30) {
            this.count = 0;
            this.txt = Array(1 + (this.txt.length+1)%4).join("."); 
        }
        ctx.fillStyle = "green";
        ctx.font = `bold ${screen.getX(900 / 8)}px selif `;
        ctx.fillText("対戦相手を", 0, screen.getY(1000));
        ctx.fillText("探しています" + this.txt, 0, screen.getY(1100));
    }
}

class testText extends GameObject {
    draw(ctx, screen) {
        ctx.fillStyle = "red";
        ctx.font = `bold ${screen.getX(900 / 8)}px selif `;
        ctx.fillText("対戦相手を発見", 0, screen.getY(1000));
    }
}