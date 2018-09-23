var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage function',()=>{

    it(' : should create the correct message', ()=>{
        var mFrom = "probinson@eircom.net";
        var mText = "This is the message text"

        var returnMessage = generateMessage(mFrom, mText);

        expect(returnMessage.from).toBe(mFrom);
        expect(returnMessage.text).toBe(mText);
        expect(returnMessage.createdAt).toBeA('string');


    })

})