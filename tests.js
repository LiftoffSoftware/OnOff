OnOff = require('./onoff')
chai = require('chai')
chai.should()

describe('The event manager', function(){

    describe('itself', function(){
        var em, newEm;

        beforeEach(function(){
            em = OnOff();
            newEm = new OnOff();
        })

        it('should be constructable with or without `new`', function(){
            em.should.be.an.instanceOf(OnOff);
            newEm.should.be.an.instanceOf(OnOff);
        });

        it('should publish all of its methods', function(){
            var methods = ['on', 'off', 'trigger', 'once'];
            methods.forEach(function(m){
                em.should.respondTo(m);
                newEm.should.respondTo(m);
            });
        });
    });

    describe('should', function(){
        var em;

        beforeEach(function(){
            em = new OnOff();
        });

        it('allow listening and triggering of events', function(done){
            em.on('myevent', function(){
                done();
            });
            em.trigger('myevent');
        });

        it('allow triggering multiple events', function(){
            var first, second;
            em.on('event1', function(){ first = true; });
            em.on('event2', function(){ second = true; });
            em.trigger('event1 event2');
            first.should.be.true;
            second.should.be.true;
        });

        describe('allow unregistering handlers', function(){
            it('globally', function(){
                var callCount = 0;
                em.on('event', function(){ callCount++; });
                em.trigger('event');
                em.off();
                em.trigger('event');
                callCount.should.equal(1);
            });
            it('by name', function(){
                var firstCallCount = 0,
                    secondCallCount = 0;
                em.on('event1', function(){ firstCallCount++; });
                em.on('event2', function(){ secondCallCount++; });
                em.trigger('event1 event2');
                em.off('event1');
                em.trigger('event1 event2');
                firstCallCount.should.equal(1);
                secondCallCount.should.equal(2);
            });
        });

        it('allow timed listeners', function(){
            var callCount = 0, maxTimes = 2;
            em.on('event', function(){ callCount++; }, null, maxTimes);
            for (var i=0; i<maxTimes+1; i++) {
                em.trigger('event');
            }
            callCount.should.equal(maxTimes);
        });

        it('allow one-shot listeners', function(){
            var callCount = 0;
            em.once('event', function(){ callCount++; });
            em.trigger('event');
            em.trigger('event');
            callCount.should.equal(1);
        });

        it('handle multiple triggering without surprises', function(){
            var callCount = 0;
            em.on('event', function(){ callCount++; }, null, 2);
            em.trigger('event event event');
            callCount.should.equal(2);
        });

        it('allow binding listener handlers with contexts', function(done){
            var ctx = {};
            em.on('event', function(){
                this.should.equal(ctx);
                done();
            }, ctx);
            em.trigger('event');
        });

        it('allow passing arguments when triggering', function(done){
            var arg1 = {}, arg2 = {};
            em.on('event', function(a1, a2){
                a1.should.equal(arg1);
                a2.should.equal(arg2);
                done();
            })
            em.trigger('event', arg1, arg2);
        });

    });

});