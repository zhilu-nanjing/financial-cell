/* global window */

// import {setColor} from "../plug-in/revision";

let removeEvent = [];

export function bind(target, name, fn) {
    target.addEventListener(name, fn);
    removeEvent.push({
        name: name,
        fn: fn,
        target: target
    })
}

export function remove() {
    for (let i = 0; i < removeEvent.length; i++) {
        let re = removeEvent[i];
        unbind(re.target, re.name, re.fn);
    }
}

export function unbind(target, name, fn) {
    target.removeEventListener(name, fn);
}

export function unbindClickoutside(el) {
    if (el.xclickoutside) {
        unbind(window.document.body, 'click', el.xclickoutside);
        delete el.xclickoutside;
    }
}

export function createEvent(keyCode, metaKey, name = "keydown", buttons = -1) {
    let event = document.createEvent('HTMLEvents');
    event.initEvent(name, true, true);
    event.eventType = 'message';
    event.buttons = buttons;
    event.keyCode = keyCode;
    event.metaKey = metaKey;
    document.dispatchEvent(event);
}

// the left mouse button: mousedown → mouseup → click
// the right mouse button: mousedown → contenxtmenu → mouseup
// the right mouse button in firefox(>65.0): mousedown → contenxtmenu → mouseup → click on window
export function bindClickoutside(el, cb) {
    el.xclickoutside = (evt) => {
        // ignore double click
        // console.log('evt:', evt);
        if (evt.detail === 2 || el.contains(evt.target)) return;
        if (cb) cb(el);
        else {
            el.hide();
            unbindClickoutside(el);
        }
    };
    bind(window.document.body, 'click', el.xclickoutside);
}

export function bindClickoutside2(el, revision) {
    el.xclickoutside = (evt) => {
        // ignore double click
        // console.log('evt:', evt);
        if (evt.buttons === 2 || el.contains(evt.target)) return;
        else {
            setColor.call(revision);
            el.hide();
            unbindClickoutside(el);
        }
    };
    bind(window.document.body, 'mousedown', el.xclickoutside);
}

export function mouseMoveUp(target, movefunc, upfunc) {
    bind(target, 'mousemove', movefunc);
    const t = target;
    t.xEvtUp = (evt) => {
        unbind(target, 'mousemove', movefunc);
        unbind(target, 'mouseup', target.xEvtUp);
        upfunc(evt);
    };
    bind(target, 'mouseup', target.xEvtUp);
}


function calTouchDirection(spanx, spany, evt, cb) {
    let direction = '';
    // console.log('spanx:', spanx, ', spany:', spany);
    if (Math.abs(spanx) > Math.abs(spany)) {
        // horizontal
        direction = spanx > 0 ? 'right' : 'left';
        cb(direction, spanx, evt);
    } else {
        // vertical
        direction = spany > 0 ? 'down' : 'up';
        cb(direction, spany, evt);
    }
}

// cb = (direction, distance) => {}
export function bindTouch(target, {move, end}) {
    let startx = 0;
    let starty = 0;
    bind(target, 'touchstart', (evt) => {
        const {pageX, pageY} = evt.touches[0];
        startx = pageX;
        starty = pageY;
    });
    bind(target, 'touchmove', (evt) => {
        if (!move) return;
        const {pageX, pageY} = evt.changedTouches[0];
        const spanx = pageX - startx;
        const spany = pageY - starty;
        if (Math.abs(spanx) > 10 || Math.abs(spany) > 10) {
            // console.log('spanx:', spanx, ', spany:', spany);
            calTouchDirection(spanx, spany, evt, move);
            startx = pageX;
            starty = pageY;
        }
        evt.preventDefault();
    });
    bind(target, 'touchend', (evt) => {
        if (!end) return;
        const {pageX, pageY} = evt.changedTouches[0];
        const spanx = pageX - startx;
        const spany = pageY - starty;
        calTouchDirection(spanx, spany, evt, end);
    });
}
