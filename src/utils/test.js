import {isHave} from "../helper/check_value";

export function testValid(valid = this.valid) {
    if(isHave(valid)) {
       valid.assert();
    }
}
