OnOff = require('./onoff')
chai = require('chai')
chai.should()

describe('the thing', function(){

    it('should work', function(){
        var EM = new OnOff();
        EM.on.should.exist;
    });

});