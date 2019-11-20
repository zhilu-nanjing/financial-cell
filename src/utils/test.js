import {isHave} from "../core/helper";

export function testValid(valid = this.valid) {
    if(isHave(valid)) {
       valid.assert();
    }
}