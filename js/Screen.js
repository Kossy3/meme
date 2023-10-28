'use strict';

class Screen {
    constructor() {
        this._content = document.getElementById("content");
        this.c = document.getElementById('view');
        this.w = 900;
        this.h = 1600;
        this.maxFps = 30;
        this.currentFps = 0;
        this.scene = new Scene();
        this._prevTimestamp = 0;
        requestAnimationFrame(this._render.bind(this));
        window.addEventListener("mousedown", e => {
            this.scene.dispatchEvent("mousedown", new GameEvent(this, e));
        }, false);
        window.addEventListener("mouseup", e => {
            this.scene.dispatchEvent("mouseup", new GameEvent(this, e));
        }, false);
        window.addEventListener("touchstart", e=> {
            this.scene.dispatchEvent("touchstart", new GameEvent(this, e));
        }, false);
        window.addEventListener("touchend", e => {
            this.scene.dispatchEvent("touchend", new GameEvent(this, e));
        }, false);
    }
    getX(x) {
        return x / this.w * this.c.width;
    }
    getY(y) {
        return y / this.h * this.c.height;
    }
    _resize() {
        this.c.width = this._content.clientWidth;
        this.c.height = this._content.clientHeight;
    }
    setScene(scene) {
        this.scene = scene;
    }
    _render(timestamp) {
        const elapsedSec = (timestamp - this._prevTimestamp) / 1000;
        const accuracy = 0.9; 
        const frameTime = 1 / this.maxFps * accuracy;
        if(elapsedSec <= frameTime) {
            requestAnimationFrame(this._render.bind(this));
            return;
        }
        this._resize();
        const ctx = this.c.getContext('2d');
        // context setting
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        this.scene.update(this);
        requestAnimationFrame(this._render.bind(this));
    }
}

class GameEventDispatcher {
    constructor() {
        this._eventListeners = {};
    }

    addEventListener(type, callback) {
        if(this._eventListeners[type] == undefined) {
            this._eventListeners[type] = [];
        }

        this._eventListeners[type].push(callback);
    }

    dispatchEvent(type, event) {
        const listeners = this._eventListeners[type];
        if(listeners != undefined) listeners.forEach((callback) => callback(event));
    }
}

class GameEvent {
    constructor(target, e=null) {
        this.target = target;
        this.e = e;
    }
}

class Scene extends GameEventDispatcher {
    constructor() {
        super()
        this.gameobjects = [];
        this.addEventListener("mousedown", event => {
            this._mouseEvent(event.e, 
                event.e.clientX,
                event.e.clientY,  
                event.target, (gameobject) => {gameobject.mousedown();});
        }, false);
        this.addEventListener("mouseup", event => {
            this._mouseEvent(event.e, 
                event.e.clientX,
                event.e.clientY, 
                event.target, (gameobject) => {gameobject.mouseup();});
        }, false);
        this.addEventListener("touchstart", event=> {
            this._mouseEvent(event.e, 
                event.e.touches[0].pageX,
                event.e.touches[0].pageY, 
                event.target, (gameobject) => {gameobject.touchstart();});
        }, false);
        this.addEventListener("touchend", event => {
            this._mouseEvent(event.e, 
                event.e.touches[0].pageX,
                event.e.touches[0].pageY, 
                event.target, (gameobject) => {gameobject.touchend();});
        }, false);
    }
    addGameObject(gameobject) {
        this.gameobjects.push(gameobject);
        gameobject.addEventListener('destroy', (e)=>{
            this.removeGameObject(e.target);
        })
    }
    removeGameObject(gameobject) {
        const index = this.actors.indexOf(actor);
        this.gameobjects.splice(index, 1);
    }
    update(screen) {
        this._updateAll(screen);
        this._renderAll(screen);
    }
    _updateAll(screen) {
        this.gameobjects.forEach((gameobject) => {
            gameobject.update(screen)
        });
    }
    _renderAll(screen) {
        for (let i = 0; i < this.gameobjects.length; i++) {
            this.gameobjects[i].render(screen);
        };
    }

    _mouseEvent(e, clientX, clientY, screen, callback) {
        let sc = e.target.getBoundingClientRect();
        let mouseX = clientX - sc.left;
        let mouseY = clientY - sc.top;
        let isCallback = false; // 一番上のオブジェクトのみ発火させたい
        for (let i = this.gameobjects.length - 1; i >= 0; i--) {
            let gameobject = this.gameobjects[i];
            let x = screen.getX(gameobject.x);
            let y = screen.getY(gameobject.y);
            let w = screen.getX(gameobject.w);
            let h = screen.getY(gameobject.h);
            if (x < mouseX && mouseX < x + w && !isCallback) {
                if (y < mouseY && mouseY < y + h) {
                    callback(gameobject)
                    isCallback == true;
                    continue;
                }
            }
            gameobject.clickcancel()
        }
    }
}

class GameObject extends GameEventDispatcher {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    update(gameInfo, input) {}

    render(ctx) {}

    mousedown(){}
    mouseup(){}
    touchstart(){}
    touchend(){}
    clickcancel(){}
    destroy() {
        this.dispatchEvent('destroy', new GameEvent(this));
    }
}

class Texture  {
    constructor(image, rect) {
        this.image = image;
        this.rect = rect;
    }
}

class Sprite extends GameObject {
    constructor(rect, texture) {
        super(rect.x, rect.y);
        this.texture = texture;
        this.w = rect.w;
        this.h = rect.h;
    }
    
    render(screen) {
        const ctx = screen.c.getContext('2d');
        const rect = this.texture.rect;
        ctx.drawImage(this.texture.image,
            rect.x, rect.y,
            rect.w, rect.h,
            screen.getX(this.x), screen.getY(this.y),
            screen.getX(this.w), screen.getY(this.h));
    }
}

class Button extends Sprite{
    constructor(rect, texture) {
        super(rect, texture);
        this.ismousedown = false;
        this.istouchstart = false;
    }
    mousedown(){
        this.ismousedown = true;
        console.log("down")
    }
    mouseup() {
        if (this.ismousedown) {
            this.dispatchEvent("click", new GameEvent(this));
            this.ismousedown = false;
            console.log("up")
        }
    }
    touchstart() {
        this.istouchstart = true;
    }
    touchend () {
        if (this.istouchstart) {
            this.dispatchEvent("click", new GameEvent(this));
            this.istouchstart = false;
        }
    }
    clickcancel () {
        this.ismousedown = false;
        this.istouchstart = false;
        console.log("cancel")
    }

    render(screen) {
        const ctx = screen.c.getContext('2d');
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        console.log(this.ismousedown)
        if (this.istouchstart || this.ismousedown) {
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        } else {
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
        }   
        super.render(screen);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
}


class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

