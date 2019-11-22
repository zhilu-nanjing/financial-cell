const recast = require("recast");

const colon = "$$$";
const fqm = '';
const exclamationPoint = "";
const braceLeft = "";
const braceRight = "";

export default class Recast {
    constructor(formula) {
        this.formula = formula;
        this.ast = "";
    }
    preProcess() {
        this.formula = this.formula.replace(/=/g, '');
        this.formula = this.formula.replace(/:/g, colon);
        this.formula = this.formula.replace(/""""/g, fqm);
        this.formula = this.formula.replace(/!/g, exclamationPoint);
        this.formula = this.formula.replace(/{/g, braceLeft);
        this.formula = this.formula.replace(/}/g, braceRight);
        this.formula = this.formula.replace(/#/g, '');
        this.formula = this.formula.replace(/\./g, 'a');
        this.formula = this.formula.replace(/[0-9][0-9]*/g, 'a');
        this.formula = this.formula.replace(/\“/g, '"');
        this.formula = this.formula.replace(/\（/g, '(');
        this.formula = this.formula.replace(/\）/g, ')');
        this.formula = this.formula.replace(/\”/g, '"');
        this.formula = this.formula.replace(/\%/g, '');
        this.formula = this.formula.replace(/\,/g, '');
        this.formula = this.formula.replace(/\，/g, '');
        // this.formula = this.formula.replace(/"([\s\S]{1,})"""/g, '');
        this.formula = this.formula.replace(/"([\s\S]+)"""/g, '');
        this.formula = this.formula.replace(/""/, "")
    }

    parse() {
        this.preProcess();
        let {formula} = this;
        this.ast = recast.parse(formula);
    }

    ignoreSpace() {

    }
}