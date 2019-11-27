import {debugout} from "./debugout";
let bugout = "";
try {
    bugout = new debugout();
} catch (e) {
    console.error(e);
}

export {
    bugout,
}