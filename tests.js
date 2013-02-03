OnOff = require('./onoff')
chai = require('chai')
chai.should()

describe('The event manager', function(){

    var em, newEm,
        methods = ['on', 'off', 'trigger', 'once'];

    beforeEach(function(){
        em = OnOff();
        newEm = new OnOff();
    })

    it('should be constructable with or without `new`', function(){
        em.should.be.an.instanceOf(OnOff);
        newEm.should.be.an.instanceOf(OnOff);
    });

    it('should publish all of its methods', function(){
        methods.forEach(function(m){
            em.should.respondTo(m);
            newEm.should.respondTo(m);
        });
    });

    it('should support chaining for all its methods', function(){
        var nop = function(){};

        em.on('event', nop).once('event', nop).trigger('event')
            .off().trigger('event');
        newEm.on('event', nop).once('event', nop).trigger('event')
            .off().trigger('event');
    });
});



describe('An event manager instance', function(){
    var em;

    beforeEach(function(){
        em = new OnOff();
    });



    it('should allow listening and triggering of events', function(done){
        em.on('myevent', function(){
            done();
        });
        em.trigger('myevent');
    });



    describe('should allow listening', function(){

        it('to events with complex names', function(){
            var callCount = 0,
                events = 'event event.scoped namespaced:event a-strange-event';
            em.on(events, function(){ callCount++; })
            em.trigger(events);
            callCount.should.equal(events.split(' ').length);
        });

        it('to the same event multiple times', function(){
            var first = false, second = false;
            em.on('event', function(){ first = true; });
            em.on('event', function(){ second = true; });
            em.trigger('event');
            first.should.be.true;
            second.should.be.true;
        });

        it('with a maximum trigger count', function(){
            var callCount = 0, maxTimes = 2;
            em.on('event', function(){ callCount++; }, null, maxTimes);
            for (var i=0; i<maxTimes+1; i++) {
                em.trigger('event');
            }
            callCount.should.equal(maxTimes);
        });

        it('with the one-shot shortcut', function(){
            var callCount = 0;
            em.once('event', function(){ callCount++; });
            em.trigger('event');
            em.trigger('event');
            callCount.should.equal(1);
        });

        it('while respecting custom contexts', function(done){
            var ctx = {};
            em.on('event', function(){
                this.should.equal(ctx);
                done();
            }, ctx);
            em.trigger('event');
        });

    });



    describe('should allow triggering', function(){

        it('to multiple events at the same time', function(){
            var first, second;
            em.on('event1', function(){ first = true; });
            em.on('event2', function(){ second = true; });
            em.trigger('event1 event2');
            first.should.be.true;
            second.should.be.true;
        });

        it('to multiple events as separate triggers', function(){
            var callCount = 0;
            em.on('event', function(){ callCount++; }, null, 2);
            em.trigger('event event event');
            callCount.should.equal(2);
        });

        it('while passing arguments to the handler', function(done){
            var arg1 = {}, arg2 = {};
            em.on('event', function(a1, a2){
                a1.should.equal(arg1);
                a2.should.equal(arg2);
                done();
            })
            em.trigger('event', arg1, arg2);
        });

        it('inside a timed listener handler', function(){
            var callCount = 0;
            em.on('event', function(){
                callCount++;
                em.trigger('event');
            }, null, 2)
            em.trigger('event');
            callCount.should.equal(2);
        })

    });



    describe('should allow unregistering handlers', function(){

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
            em.on('event', function(){ firstCallCount++; });
            em.on('event', function(){ firstCallCount++; });
            em.on('other-event', function(){ secondCallCount++; });
            em.trigger('event other-event');
            em.off('event');
            em.trigger('event other-event');
            firstCallCount.should.equal(2);
            secondCallCount.should.equal(2);
        });

        it('during triggering', function(){
            var first, second, third, fourth;
            first = second = third = fourth = false;
            em.on('event1', function(){ first = true; });
            em.on('event2', function(){ second = true; em.off('event3'); });
            em.on('event3', function(){ third = true; });
            em.on('event4', function(){ fourth = true; });
            em.trigger('event1 event2 event3 event4');
            first.should.be.true;
            second.should.be.true;
            third.should.be.false;
            fourth.should.be.true;
        });

    });

});