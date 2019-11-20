import {h} from "../component/element";
import {cssPrefix} from "../config";
import ContextMenu from "./contextmenu";
import {t} from "../locale/locale";
import {buildButtonWithIcon} from "../component/toolbar";
import {sheetReset} from "../component/sheet";
import {createEvent} from "../component/event";

let chooseColor = "#0EAA10";
let rightColor = "#f5f5f5";

export function setColor(key = "backgroundColor", value = rightColor, replaceColor = '#fafafa') {
    for (let i = 0; i < this.dateArr.length; i++) {
        let d = this.dateArr[i];
        d.css(key, replaceColor);
    }
}

function loadNeatFlex(neat_flex) {
    if (neat_flex) {
        return neat_flex.neat_flex;
    }
    return {};
}

function findData(sp) {
    for (let i = 0; i < this.sheet_data.length; i++) {
        let {sheet_path} = this.sheet_data[i];
        if (sp === sheet_path) {
            return this.sheet_data[i];
        }
    }

    return null;
}

function loadRowAndCol(options, neat_flex, op) {
    if (neat_flex) {
        options.row = {
            len: neat_flex["rows"],
        };
        options.rowWidth = {
            state: !0,
            width: 240
        };
        options.view = {
            height: () => 150 * 25,
        };
        options.col = {
            len: neat_flex["col"],
        };

    }
    options.view = {
        width: () => {
            return document.body.clientWidth - 280 - 10 - 68;
        }
    };
    if(typeof op === 'string') {
        op = JSON.parse(op)
    }
    if(op.cols) {
        options.cols = op.cols
    }
    if(op.row) {
        options.row = op.row
    }
    options.showFreeze = true;
    return options;
}

function sendRequest(info, sheet_path, el, right = false, date) {
    let {axios, url} = info;

    axios.get(url, {
        params: {
            sheet_path: sheet_path,
        }
    }).then(res => {
        if(res.data.state === true) {
            if(res.data.data === "error") {
                return;
            }
            let data = typeof res.data.data.sheet_details == 'string'
                ? JSON.parse(res.data.data.sheet_details) : res.data.data.sheet_details;
            let styles = "";
            if (typeof res.data.data.sheet_styles === "string" && JSON.parse(res.data.data.sheet_styles)) {
                styles = JSON.parse(res.data.data.sheet_styles);
            } else {
                styles = res.data.data.sheet_styles;
            }
            let options = loadRowAndCol({}, res.data.data.neat_flex, res.data.data.sheet_options);

            let args = {
                styles: styles,
                rows:  data,
                options: options,
                merges:  res.data.data.sheet_merges,
                autofilter:  res.data.data.sheet_auto_filter,
                pictures:  res.data.data.sheet_pictures,
                flex: loadNeatFlex(res.data.data.neat_flex),
                cols: ( options && options.cols) || {}
            };

            this.sheet_data.push({
                "sheet_path": sheet_path,
                "sheet_data": args,
                "sheet_date": date
            });
            if(!right) {
                let {tipMesage} = this;
                tipMesage.$notify({message: "打开成功",title: '成功', type: 'success', showClose: true});
                this.sheet.loadData(args);
            } else {
                this.rightEl = findData.call(this, sheet_path);
            }
        }
    })
}

function closeFrame(history, save = false, date = "") {
    let {revision} = this;
    if (revision) {
        this.sheet.loadData(history);
        revision.el.removeEl();
        this.data.settings.showEditor = true;
        this.data.settings.view.width = () => {
            let result = this.w();
            result = result + 150;
            return result;
        };
        this.sheet.el.css('left', '0px');
        this.sheet.toolbar.el.css('left', '0px');
        createEvent.call(this, 8, false, 'resize');
        sheetReset.call(this.sheet);
        if(save) {
            let {tipMesage} = this.revision;
            tipMesage.$notify({message: "以还原至 " + date + " 的版本",title: '成功', type: 'success', showClose: true});
            this.data.change(this.data.getData());
        }
    }
}

export default class revision {
    constructor(width, sheet, tipMesage, plugIn) {
        this.el = h('div', `${cssPrefix}-revisions-sidebar`);
        this.el.css('width', width);
        this.sheet = sheet;
        this.plugIn = plugIn;
        this.comeback = buildButtonWithIcon(`${t('revision.comeBack')}`, 'comeback', () => closeFrame.call(plugIn,  this.history));
        this.title = h('div', `${cssPrefix}-revisions-sidebar-title`)
        this.contextMenu = new ContextMenu(() => () => {
            return "300px";
        }, false);
        this.el.children(
            this.title,
        );
        this.title_content = h('span', `${cssPrefix}-revisions-sidebar-title-content`).html('版本历史记录');
        this.comeback.css('display', 'inline');
        this.title.children(
            this.comeback,
            this.title_content
        );

        this.initContextEvent();
        this.history = {};
        this.tipMesage = tipMesage;
        this.sheet_data = [];
        this.dateArr = [];
        this.rightEl = '';
        this.el.on('mousedown', evt => {
            let {buttons, target} = evt;
            let className = target.className;
            if (buttons === 2 && className === `${cssPrefix}-revisions-sidebar-date`) {
                setColor.call(this, "backgroundColor",rightColor, '#fafafa');
                target.style['background-color'] = rightColor;
                this.contextMenu.setPosition(evt.layerX, evt.layerY, this);
            } else if (buttons === 2) {
                setColor.call(this, "backgroundColor", rightColor, '#fafafa');
                this.contextMenu.hide();
            }
        });
    }

    initContextEvent() {
        this.contextMenu.itemClick = (type, evt) => {
            if(type === 'recover') {
                let {sheet_data, sheet_date} = this.rightEl;
                this.history = sheet_data;
                closeFrame.call(this.plugIn,  this.history, true, sheet_date);
            }
        }
    }

    clickEvent(el, data, info, date) {
        el.on('mousedown', evt => {
            let {buttons} = evt;
            if(buttons === 2) {
                let {sheet_path} = data;
                let sd = findData.call(this, sheet_path);
                if (sd && sd.sheet_data) {
                    this.rightEl = sd;
                } else {
                    sendRequest.call(this, info, sheet_path, el, true, date);
                }
            } else {
                let {sheet_path} = data;
                let sd = findData.call(this, sheet_path);
                if (sd && sd.sheet_data) {
                    setColor.call(this, "color", chooseColor, 'black');
                    el.css('color', chooseColor);
                    this.sheet.loadData(sd.sheet_data);
                    this.contextMenu.hide();
                    let {tipMesage} = this;
                    tipMesage.$notify({message: "打开成功",title: '成功', type: 'success', showClose: true});
                    evt.stopPropagation();
                } else {
                    setColor.call(this, "color", chooseColor, 'black');
                    el.css('color', chooseColor);
                    sendRequest.call(this, info, sheet_path, el, false, date);
                }
            }
        });
    }

    historyData(args) {
        this.history = args;
    }

    setData(d, args, info) {
        let enter = false;
        Object.keys(d).forEach(i => {
            let year = d[i];
            let el = h('div', `${cssPrefix}-revisions-sidebar-year`).html(i);
            this.el.children(el);
            Object.keys(year).forEach(j => {
                let {date, history_id, sheet_id, sheet_path} = year[j];
                el = h('div', `${cssPrefix}-revisions-sidebar-date`).html(date);
                this.dateArr.push(el);
                this.el.children(el);
                this.clickEvent(el, {
                    "history_id": history_id,
                    "sheet_id": sheet_id,
                    "sheet_path": sheet_path
                }, info, date);
                if (!enter) {
                    el.css('color', chooseColor);
                    this.sheet.loadData(args);
                    enter = true;
                    this.sheet_data.push({
                        "sheet_path": sheet_path,
                        "sheet_data": args,
                        "sheet_date": date
                    })
                }
            });
        });
    }
}