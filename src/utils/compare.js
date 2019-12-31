import * as assert from "assert"

export function assertArrayEqual(array1, array2){
  array1.map((val, index)=> assert.equal(val,array2[index]))
}
