// import helper from '../helper';
import {deleteAllImg, mountImg} from "../event/paste";
import {h} from "../component/element";

export default class History {
    constructor(data) {
        this.undoItems = [];
        this.redoItems = [];
        this.data = data;
    }

    add(data) {
        console.time("dbclick time 4");
        if(!this.data.settings.showEditor) {
            return;
        }
        this.undoItems.push(JSON.stringify(data));
        this.redoItems = [];
        console.timeEnd("dbclick time 4");

    }

    addPic(data, operation) {
        if(!this.data.settings.showEditor) {
            return;
        }

        let newData = Object.assign([], data);
        this.undoItems.push({
            type: "picture",
            pic: newData,
            operation: operation
        });

        this.redoItems = [];
    }

    canUndo() {
        return this.undoItems.length > 0;
    }

    canRedo() {
        return this.redoItems.length > 0;
    }

    undo(currentd, cb, sheet) {
        if(!this.data.settings.showEditor) {
            return;
        }

        const {undoItems, redoItems} = this;
        if (this.canUndo()) {
            let item = undoItems.pop();
            redoItems.push(JSON.stringify(currentd));
            console.log(undoItems);

            if (item && item.type && item.type === 'picture') {
                let data = item.pic;
                deleteAllImg.call(sheet);
                sheet.data.pasteDirectionsArr = [];
                Object.keys(data).forEach(i => {
                    // container.child(data[i].src);
                    let img = h('img', '');
                    img.el.src = data[i].src;
                    mountImg.call(sheet, img.el, true, data[i].ri, data[i].ci, data[i].range, false);
                });
                // sheet.data.pasteDirectionsArr = data;
            } else {
                cb(JSON.parse(item));
            }
        }
    }

    redo(currentd, cb) {
        if(!this.data.settings.showEditor) {
            return;
        }

        const {undoItems, redoItems} = this;
        if (this.canRedo()) {
            undoItems.push(JSON.stringify(currentd));
            cb(JSON.parse(redoItems.pop()));
        }
    }
}
