var expect = require('expect');
const {isRealString} = require('./../utils/validation');

describe('isRealString function',()=>{
    it(' : should return false if not of string type',()=>{
        var result = isRealString(4);

        expect(result).toBe(false);
    });

    it(' : should return false if string is empty or just whiespaces',()=>{
        var result = isRealString('                        ');
        expect(result).toBe(false);
    })

    it(' : should return true if passed string',()=>{
        var result = isRealString('aString');
        expect(result).toBe(true);
    })
})