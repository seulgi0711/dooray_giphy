import { BUTTON_TYPE } from '../constant';
import { createSendResult, extractKeyword, isSendButton } from "./reqHandler";

describe("isSendButton", () => {
    test("return true when actionValue is SEND", () => {
        const body = { actionValue: BUTTON_TYPE.SEND };
        expect(isSendButton(body)).toEqual(true);
    });

    test('return false when actionValue is not SEND', () => {
        const body = { actionValue: 'asdasd' };
        expect(isSendButton(body)).toEqual(false);
    });
});

describe('createSendResult', () => {
    test('return send result', () => {
        const body = {
            originalMessage: {
                text: 'text'
            }
        };
        expect(createSendResult(body).value).toEqual(expect.objectContaining({
            responseType: 'inChannel',
            deleteOriginal: true,
            text: body.originalMessage.text
        }))
    });
});

describe('extractKeyword', () => {
    test('return keyword', () => {
        const body = {
            text: 'test'
        };
        expect(extractKeyword(body)).toEqual('test');
    });
});