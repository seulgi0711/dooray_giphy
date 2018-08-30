"use strict";

var _constant = require("../constant");

var _reqHandler = require("./reqHandler");

describe("isSendButton", function () {
    test("return true when actionValue is SEND", function () {
        var body = { actionValue: _constant.BUTTON_TYPE.SEND };
        expect((0, _reqHandler.isSendButton)(body)).toEqual(true);
    });

    test('return false when actionValue is not SEND', function () {
        var body = { actionValue: 'asdasd' };
        expect((0, _reqHandler.isSendButton)(body)).toEqual(false);
    });
});

describe('createSendResult', function () {
    test('return send result', function () {
        var body = {
            originalMessage: {
                text: 'text'
            }
        };
        expect((0, _reqHandler.createSendResult)(body).value).toEqual(expect.objectContaining({
            responseType: 'inChannel',
            deleteOriginal: true,
            text: body.originalMessage.text
        }));
    });
});

describe('extractKeyword', function () {
    test('return keyword', function () {
        var body = {
            text: 'test'
        };
        expect((0, _reqHandler.extractKeyword)(body)).toEqual('test');
    });
});
//# sourceMappingURL=reqHandler.spec.js.map