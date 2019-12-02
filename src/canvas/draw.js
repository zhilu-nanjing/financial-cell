/* global window */
import {isHave} from "../core/helper";

function dpr() {
    return window.devicePixelRatio || 1;       // 修改之后
}

function thinLineWidth() {
    return dpr() - 0.5;
}

function npx(px) {
    let d = px * dpr() + "";
    return parseInt(d, 10);
}

function npxLine(px) {
    const n = npx(px);
    return n > 0 ? n - 0.5 : 0.5;
}

function drawFlexFalse(ctx, sx, sy) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#707070";
    ctx.moveTo(sx, sy + 6);
    ctx.lineTo(sx + 12, sy + 6);
    ctx.stroke();

    ctx.strokeRect(sx, sy, 12, 12);
    ctx.clip();
    ctx.fill();
    ctx.restore();
}

function drawFlexTrue(ctx, sx, sy) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#707070";
    ctx.moveTo(sx + 6, sy);
    ctx.lineTo(sx + 6, sy + 12);
    ctx.moveTo(sx, sy + 6);
    ctx.lineTo(sx + 12, sy + 6);
    ctx.stroke();

    ctx.strokeRect(sx, sy, 12, 12);
    ctx.clip();
    ctx.fill();
    ctx.restore();
}

class DrawBox {
    constructor(x, y, w, h, padding = 0) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.padding = padding;
        this.bgcolor = '#ffffff';
        // border: [width, style, color]
        this.borderTop = null;
        this.borderRight = null;
        this.borderBottom = null;
        this.borderLeft = null;
    }

    setBorders({
                   top, bottom, left, right,
               }) {
        if (top) this.borderTop = top;
        if (right) this.borderRight = right;
        if (bottom) this.borderBottom = bottom;
        if (left) this.borderLeft = left;
    }

    innerWidth() {
        return this.width - (this.padding * 2);
    }

    innerHeight() {
        return this.height - (this.padding * 2);
    }

    textx(align) {
        const {width, padding} = this;
        let {x} = this;
        if (align === 'left') {
            x += padding;
        } else if (align === 'center') {
            x += width / 2;
        } else if (align === 'right') {
            x += width - padding;
        }
        return x;
    }

    texty(align, fontSize, hoffset) {
        const {height, padding} = this;
        let {y} = this;
        if (align === 'top') {
            y += padding;
        } else if (align === 'middle') {
            y = y + height / 2 - hoffset;
            // y = y1;
            // const y2 = y + padding + fontSize / 2 + 1;
            // if (y1 < y2) y = y2;
            // else y = y1;
        } else if (align === 'bottom') {
            y += height - hoffset * 2 - padding;
        }
        return y;
    }

    topxys() {
        const {x, y, width} = this;
        return [[x, y], [x + width, y]];
    }

    rightxys() {
        const {
            x, y, width, height,
        } = this;
        return [[x + width, y], [x + width, y + height]];
    }

    bottomxys() {
        const {
            x, y, width, height,
        } = this;
        return [[x, y + height], [x + width, y + height]];
    }

    leftxys() {
        const {
            x, y, height,
        } = this;
        return [[x, y], [x, y + height]];
    }
}

function drawFontLine(type, tx, ty, align, valign, blheight, blwidth) {
    const floffset = {x: 0, y: 0};
    if (type === 'underline') {
        if (valign === 'bottom') {
            floffset.y = 0;
        } else if (valign === 'top') {
            floffset.y = -(blheight + 2);
        } else {
            floffset.y = -blheight / 2;
        }
    } else if (type === 'strike') {
        if (valign === 'bottom') {
            floffset.y = blheight / 2;
        } else if (valign === 'top') {
            floffset.y = -((blheight / 2) + 2);
        }
    }

    if (align === 'center') {
        floffset.x = blwidth / 2;
    } else if (align === 'right') {
        floffset.x = blwidth;
    }
    this.line(
        [tx - floffset.x, ty - floffset.y],
        [tx - floffset.x + blwidth, ty - floffset.y],
    );
}

class Draw {
    constructor(el, width, height) {
        this.el = el;
        this.ctx = el.getContext('2d');
        this.resize(width, height);
        this.ctx.scale(dpr() * 1, dpr() * 1);
        this.cxc = {
            indent: 250,
            vIndent: 200,
            canvasContext: this.ctx
        }

    }

    resize(width, height) {
        // console.log('dpr:', dpr);
        this.el.style.width = `${width}px`;
        this.el.style.height = `${height}px`;
        this.el.width = npx(width);
        this.el.height = npx(height);
    }

    clear() {
        const {width, height} = this.el;
        this.ctx.clearRect(0, 0, width, height);
        return this;
    }

    attr(options) {
        Object.assign(this.ctx, options);
        return this;
    }

    save() {
        this.ctx.save();
        this.ctx.beginPath();
        return this;
    }

    restore() {
        this.ctx.restore();
        return this;
    }

    beginPath() {
        this.ctx.beginPath();
        return this;
    }

    translate(x, y) {
        this.ctx.translate(npx(x), npx(y));
        return this;
    }

    clearRect(x, y, w, h) {
        this.ctx.clearRect(x, y, w, h);
        return this;
    }

    fillRect(x, y, w, h) {
        this.ctx.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(w), npx(h));
        return this;
    }

    fillText(text, x, y) {
        // this.ctx.font.size = 30;
        // console.log("203:", this.ctx.font);
        this.ctx.fillText(text, npx(x), npx(y));
        return this;
    }

    selfAdaptionHeight(box, txt, font) {
        if (font === undefined || txt === undefined)
            return;
        let n = 1;
        const textLine = {len: 0, start: 0};
        let innerWidth = box.width - box.padding * 2;
        for (let i = 0; i < txt.length; i += 1) {
            if (textLine.len + box.padding >= innerWidth) {
                n = n + 1;
                textLine.len = 0;
                textLine.start = i;
            }
            textLine.len += this.selfAdaptionOneTxtWidth(txt[i], font);
        }

        return n;
    }

    selfAdaptionTxtWidth(txt, font, box) {
        if (isHave(txt) === false || isHave(font) === false || txt.length <= 0)
            return 0;
        const {ctx} = this;
        ctx.font = `${font.italic ? 'italic' : ''} ${font.bold ? 'bold' : ''} ${npx(font.size)}px ${font.name}`;
        return ctx.measureText(txt).width * font.size / npx(font.size);
    }

    selfAdaptionOneTxtWidth(txt, font) {
        if (isHave(txt) === false || isHave(font) === false || txt.length <= 0)
            return 0;
        const {ctx} = this;
        ctx.font = `${font.italic ? 'italic' : ''} ${font.bold ? 'bold' : ''} ${npx(font.size)}px ${font.name}`;

        return ctx.measureText(txt).width;
    }

    /*
      txt: render text
      box: DrawBox
      attr: {
        align: left | center | right
        valign: top | middle | bottom
        color: '#333333',
        strike: false,
        font: {
          name: 'Arial',
          size: 14,
          bold: false,
          italic: false,
        }
      }
      textWrap: text wrapping
    */
    text(txt, box, attr = {}, textWrap = true) {
        const {ctx} = this;
        // const {
        //     align, valign, font, color, strike, underline, ignore, cindex
        // } = attr;
        const {
            align, valign, font, color, strike, underline, ignore
        } = attr;

        const tx = box.textx(align);
        ctx.save();
        ctx.beginPath();

        this.attr({
            textAlign: align,
            textBaseline: valign,
            font: `${font.italic ? 'italic' : ''} ${font.bold ? 'bold' : ''} ${npx(font.size)}px ${font.name}`,
            fillStyle: color,
            strokeStyle: color,
        });

        let txtWidth = this.selfAdaptionTxtWidth(txt, font, box);
        let hoffset = 0;
        let innerWidth = box.innerWidth();
        if (textWrap) {
            innerWidth = box.width - box.padding * 2;
            const n = this.selfAdaptionHeight(box, txt, font);
            hoffset = ((n - 1) * font.size) / 2;
            // for (let i = 0; i < ignore.length; i++) {
            //     if (cindex != ignore[i]) {
            //         // hoffset = 0;
            //     } else if (cindex == ignore[i]) {
            //     }
            // }
        }
        let ty = box.texty(valign, font.size, hoffset);
        if (textWrap && txtWidth > innerWidth) {
            const textLine = {len: 0, start: 0};
            for (let i = 0; i < txt.length; i += 1) {
                if (textLine.len + box.padding >= innerWidth) {
                    // debugger
                    this.fillText(txt.substring(textLine.start, i), tx, ty);
                    if (strike) {
                        drawFontLine.call(this, 'strike', tx, ty, align, valign, font.size, textLine.len);
                    }
                    if (underline) {
                        drawFontLine.call(this, 'underline', tx, ty, align, valign, font.size, textLine.len);
                    }
                    ty += font.size + 2;
                    textLine.len = 0;
                    textLine.start = i;
                }
                textLine.len += this.selfAdaptionOneTxtWidth(txt[i], font);
            }
            if (textLine.len > 0) {
                this.fillText(txt.substring(textLine.start), tx, ty);
                if (strike) {
                    drawFontLine.call(this, 'strike', tx, ty, align, valign, font.size, textLine.len);
                }
                if (underline) {
                    drawFontLine.call(this, 'underline', tx, ty, align, valign, font.size, textLine.len);
                }
            }
        } else {
            this.fillText(txt, tx, ty);
            if (strike) {
                drawFontLine.call(this, 'strike', tx, ty, align, valign, font.size, txtWidth);
            }
            if (underline) {
                drawFontLine.call(this, 'underline', tx, ty, align, valign, font.size, txtWidth);
            }
        }
        ctx.restore();
        return this;
    }

    border(style, color) {
        const {ctx} = this;
        ctx.lineWidth = thinLineWidth;
        ctx.strokeStyle = color;
        // console.log('style:', style);
        if (style === 'medium') {
            ctx.lineWidth = npx(2) - 0.5;
        } else if (style === 'thick') {
            ctx.lineWidth = npx(3);
        } else if (style === 'dashed') {
            ctx.setLineDash([npx(3), npx(2)]);
        } else if (style === 'dotted') {
            ctx.setLineDash([npx(1), npx(1)]);
        } else if (style === 'double') {
            ctx.setLineDash([npx(2), 0]);
        }
        return this;
    }

    line(...xys) {
        const {ctx} = this;
        if (xys.length > 1) {
            const [x, y] = xys[0];
            ctx.moveTo(npxLine(x), npxLine(y));
            for (let i = 1; i < xys.length; i += 1) {
                const [x1, y1] = xys[i];
                ctx.lineTo(npxLine(x1), npxLine(y1));
            }
            ctx.stroke();
        }
        return this;
    }

    strokeBorders(box) {
        const {ctx} = this;
        ctx.save();
        ctx.beginPath();
        // border
        const {
            borderTop, borderRight, borderBottom, borderLeft,
        } = box;
        if (borderTop) {
            this.border(...borderTop);
            // console.log('box.topxys:', box.topxys());
            this.line(...box.topxys());
        }
        if (borderRight) {
            this.border(...borderRight);
            this.line(...box.rightxys());
        }
        if (borderBottom) {
            this.border(...borderBottom);
            this.line(...box.bottomxys());
        }
        if (borderLeft) {
            this.border(...borderLeft);
            this.line(...box.leftxys());
        }
        ctx.restore();
    }

    dropUp(box, state, diff) {
        const {ctx} = this;
        const {
            x, y, height,
        } = box;

        const sx = x + 10;
        const sy = y + height - 18 - diff;

        // if (state) {
        //   img.src = "http://starimage.oss-cn-beijing.aliyuncs.com/2019418/1557278539177.svg";
        // } else {
        //   img.src = "http://starimage.oss-cn-beijing.aliyuncs.com/2019418/1557278579742.svg";
        // }
        // img.onload = function () {
        //   ctx.drawImage(img, npx(sx), npx(sy), 16, 16);
        // }
        if (state) {
            drawFlexTrue.call(this, ctx, npx(sx), npx(sy))
        } else {
            drawFlexFalse.call(this, ctx, npx(sx), npx(sy))
        }
    }


    lineTo(x, y) {
        this.cxc.canvasContext.lineTo(x + this.cxc.indent, y + this.cxc.vIndent);
    }

    moveTo(x, y) {
        this.cxc.canvasContext.moveTo(x + this.cxc.indent, y + this.cxc.vIndent);
    };


    dropdown(box) {
        const {ctx} = this;
        const {
            x, y, width, height,
        } = box;

        const sx = x + width - 15;
        const sy = y + height - 15;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(npx(sx), npx(sy));
        ctx.lineTo(npx(sx + 8), npx(sy));
        ctx.lineTo(npx(sx + 4), npx(sy + 6));
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 0, 0, .45)';
        ctx.fill();
        ctx.restore();
    }

    error(box) {
        const {ctx} = this;
        const {x, y, width} = box;
        const sx = x + width - 1;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(npx(sx - 8), npx(y - 1));
        ctx.lineTo(npx(sx), npx(y - 1));
        ctx.lineTo(npx(sx), npx(y + 8));
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 0, 0, .65)';
        ctx.fill();
        ctx.restore();
    }

    rect(box, dtextcb) {
        const {ctx} = this;
        const {
            x, y, width, height, bgcolor,
        } = box;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = bgcolor || '#fff';
        ctx.rect(npxLine(x + 1), npxLine(y + 1), npx(width - 2), npx(height - 2));
        ctx.clip();
        ctx.fill();
        dtextcb();
        ctx.restore();
    }

    rect2(box, dtextcb) {
        const {ctx} = this;
        const {
            x, y, width, bgcolor,
        } = box;
        let {height} = box;
        // if (textwrap == true) {
        //     console.log("487")
        //     const n = this.selfAdaptionHeight(box, cellText);
        //     height = height * n;
        //     console.log("495", height)
        // }
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = bgcolor === "rgba(0, 0, 0, 0)" ? '#fff' : bgcolor || '#fff';
        ctx.rect(npxLine(x + 1), npxLine(y + 1), npx(width - 2), npx(height - 2));
        ctx.clip();
        ctx.fill();
        dtextcb();
        ctx.restore();
    }
}

export {
    Draw,
    DrawBox,
    thinLineWidth,
    npx,
};
