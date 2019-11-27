import {describe, it} from 'mocha';
import DataProxy from "../src/core/data_proxy";
import EditorText from "../src/component/editor_text";

let assert = require('assert');
describe('calc', () => {
  let data = new DataProxy("sheet1", {}, {});
  describe(' F4 ', () => {
    it(' =A1+A2 ', () => {
      let editorText = new EditorText('A1');
      editorText.setText('=A1+A2');
      let args = editorText.f4ShortcutKey(3);
      assert.equal(args.inputText, '=$A$1+A2');
      assert.equal(args.pos, 5);
      args = editorText.f4ShortcutKey(args.pos);
      assert.equal(args.inputText, '=$A1+A2');
      assert.equal(args.pos, 4);
    });
  });
});