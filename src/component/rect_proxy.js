import {offsetTop} from "../config";
import {positionAngle} from "../core/operator";

export default class RectProxy {
    constructor(rect) {
        this.rect = rect;
    }

    isLocInside(x, y) {
        let {rect} = this;

        if (x < rect.width + rect.left && x > rect.left && y - offsetTop > rect.top && y - offsetTop < rect.top + rect.height) {
            return true;
        }
        return false;
    }

    getUpDownLeftRight(ex, ey, clientX, clientY) {
        let {rect} = this;

        let pos = 0;
        if (ex < rect.width + rect.left && ex > rect.left) {
            if (ey > rect.top + rect.height + offsetTop) {
                pos = 1;
            } else if (ey - offsetTop < rect.top) {
                pos = 4;
            }

        } else if (ey - ( rect.top - rect.height + offsetTop) > 0 && (rect.height + rect.top + offsetTop) > ey) {
            if (ex > rect.width + rect.left) {
                pos = 3;
            } else if (ex < rect.left) {
                pos = 2;
            }
        }

        console.log(pos);
        if (pos === 0) {
            pos = positionAngle(clientX, ex, clientY, ey);
        }
        if (pos === 1 && ey < 0) {
            pos = 4;
        } else if (document.body.clientHeight < ey && pos === 4) {
            pos = 1;
        }
        if (pos === 3 && ex < 0) {
            pos = 2;
        } else if (document.body.clientWidth < ex && pos === 2) {
            pos = 3;
        }

        return pos;
    }
}