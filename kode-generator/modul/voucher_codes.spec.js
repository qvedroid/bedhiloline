var kode_voucher = require('../kode_voucher.js');

describe('kode_voucher', function(){

    it('should generate code of request length', function(){
        var length = 5;
        var code = kode_voucher.generate({length: length})[0];

        expect(code.length).toBe(length);
    });

    it('should generate code of default length', function(){
        var default_length = 8;
        var code = kode_voucher.generate({})[0];

        expect(code.length).toBe(default_length);
    });

    it('should generate code if no config provided', function(){
        var default_length = 8;
        var code = kode_voucher.generate()[0];

        expect(code.length).toBe(default_length);
    });

    it('should generate 5 unique codes', function(){
        var codes = kode_voucher.generate({
            length: 2,
            count: 5
        });

        expect(codes.length).toBe(5);
        codes.forEach(function(code) {
            expect(code.length).toBe(2);
            expect(codes.indexOf(code)).toBe(codes.lastIndexOf(code)); // check uniqueness
        })
    });

    it('should generate a code consisting of numbers only', function(){
        var numbers = "0123456789";
        var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var code = kode_voucher.generate({
            length: 10,
            charset: numbers
        })[0];

        expect(code.length).toBe(10);
        code.split('').forEach(function(char) {
            expect(numbers).toContain(char);
            expect(letters).not.toContain(char);
        });
    });

    it('should generate a code consisting of letters only', function(){
        var numbers = "0123456789";
        var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var code = kode_voucher.generate({
            length: 10,
            charset: letters
        })[0];

        expect(code.length).toBe(10);
        code.split('').forEach(function(char) {
            expect(letters).toContain(char);
            expect(numbers).not.toContain(char);
        });
    });

    it('should generate code with prefix', function(){
        var code = kode_voucher.generate({
            prefix: "promo-"
        })[0];

        expect(code).toMatch(/^promo-/);
    });

    it('should generate code with postfix', function(){
        var code = kode_voucher.generate({
            postfix: "-extra"
        })[0];

        expect(code).toMatch(/-extra$/);
    });

    it('should generate code with prefix and postfix', function(){
        var code = kode_voucher.generate({
            prefix: "promo-",
            postfix: "-extra"
        })[0];

        expect(code).toMatch(/^promo-.*-extra$/);
    });

    it('should generate code from pattern', function(){
        var code = kode_voucher.generate({
            pattern: "##-###-##"
        })[0];

        expect(code).toMatch(/^([0-9a-zA-Z]){2}-([0-9a-zA-Z]){3}-([0-9a-zA-Z]){2}$/);
    });

    it('should detect infeasible config', function(){
        var config = {
            count: 1000,
            charset: "abc",
            length: 5
        }; // there are only 125 (5^3) possible codes for this config

        expect(function() {
            kode_voucher.generate(config);
        }).toThrow("Not possible to generate requested number of codes.");
    });

    it('should generate fixed code', function(){
        var config = {
            count: 1,
            pattern: "FIXED"
        };

        var codes = kode_voucher.generate(config);

        expect(codes.length).toEqual(1);
        expect(codes[0]).toEqual("FIXED");
    });

});
