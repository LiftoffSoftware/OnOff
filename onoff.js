/* ===================================================
 * onoff.js v1.0.2
 * https://github.com/LiftoffSoftware/OnOff
 * http://liftoffsoftware.com/
 * ===================================================
 * Copyright 2013 Liftoff Software Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */
var OnOff = function() {
    /**:OnOff()

    Author: Dan McDougall (daniel.mcdougall@liftoffsoftware.com).

    A tiny JavaScript module that provides `on()`, `off()`, and `trigger()` event management.

    .. note:: A convenient `once()` function is also provided for events that should only be called one time.
    */
    if (!(this instanceof OnOff)) { return new OnOff(); }
    var self = this, // Explicit is better than implicit.
        keys = function (dict) {
            var keyList = [];
            for (var i in dict) {
                if (dict.hasOwnProperty(i)) { keyList.push(i); }
            }
            return keyList;
        };
    self.__version__ = "1.0.2";
    self._events = {};
    self.on = function(events, callback, context, times) {
        /**:OnOff.on(events, callback, context, times)

        Adds the given *callback* / *context* combination to the given *events*; to be called when the given *events* are triggered.

        :param string events: A space-separated list of events that will have the given *callback* / *context* attached.
        :param function callback: The function to be called when the given *event* is triggered.
        :param object context: An object that will be bound to *callback* as `this` when it is called.
        :param integer times: The number of times this callback will be called before it is removed from the given *event*.

        Examples::

            > // Create an instance of OnOff()
            > EventManager = new OnOff(); // NOTE: "new" is actually optional
            > // A little test function
            > var testFunc = function(args) { console.log('args: ' + args + ', this.foo: ' + this.foo) };
            > // Call testFunc whenever the "test_event" event is triggered
            > EventManager.on("test_event", testFunc);
            > // Fire the test_event with 'an argument' as the only argument
            > EventManager.trigger("test_event", 'an argument');
            args: an argument, this.foo: undefined
            > // Remove the event so we can change it
            > EventManager.off("test_event", testFunc);
            > // Now let's pass in a context object
            > EventManager.on("test_event", testFunc, {'foo': 'bar'});
            > // Now fire it just like before
            > EventManager.trigger("test_event", 'an argument');
            args: an argument, this.foo: bar

        .. note:: Each instance of `OnOff` maintains its own list of events and callbacks so there shouldn't be conflicts when two libraries happen to use it.
        */
        events.split(/\s+/).forEach(function(event) {
            var callList = self._events[event],
                callObj = {
                    callback: callback,
                    context: context,
                    times: times
                };
            if (!callList) {
                // Initialize the callback list for this event
                callList = self._events[event] = [];
            }
            callList.push(callObj);
        });
        return self;
    }
    self.off = function(events, callback, context) {
        /**:OnOff off(events, callback, context)

        Removes the given *callback* / *context* combination from the given *events*

        :param string events: A space-separated list of events.
        :param function callback: The function that's attached to the given events to be removed.
        :param object context: The context attached to the given event/callback to be removed.

        Example::

            > EventManager.off("your_event", someFunction);
            > // Or to clear *all* events in one go:
            > EventManager.off();
            > // A bit more interesting...  Clear all events with a given context:
            > EventManager.off(null, null, someContext);
        */
        var eventList, i, n;
        if (!arguments.length) {
            self._events = {}; // Clear all events/callbacks
        } else {
            eventList = events ? events.split(/\s+/) : keys(self._events);
            for (i in eventList) {
                var event = eventList[i],
                    callList = self._events[event];
                if (callList) { // There's a matching event
                    var newList = [];
                    for (var n in callList) {
                        if (callback) {
                             if (callList[n].callback.toString() == callback.toString()) {
                                if (context && callList[n].context != context) {
                                    newList.push(callList[n]);
                                } else if (context === null && callList[n].context) {
    // If the context is undefined assume the dev wants to remove all matching callbacks for this event
    // However, if the context was set to null assume they only want to match callbacks that have no context.
                                    newList.push(callList[n]);
                                }
                             } else {
                                newList.push(callList[n]);
                             }
                        } else if (context && callList[n].context != context) {
                            newList.push(callList[n]);
                        }
                    }
                    self._events[event] = newList;
                }
            }
        }
        return self;
    }
    self.once = function(events, callback, context) {
        /**:OnOff.once(events, callback, context)

        A shortcut that performs the equivalent of `OnOff.on(events, callback, context, 1)`
        */
        self.on(events, callback, context, 1);
        return self;
    }
    self.trigger = function(events) {
        /**:OnOff.trigger(events)

        Triggers the given *events*.  Any additional provided arguments will be passed to the callbacks attached to the given events.

        :param string events: A space-separated list of events to trigger

        Example::

            > // The '1' below will be passed to each callback as the only argument
            > EventManager.trigger("your_app:some_event", 1);
        */
        var args = Array.prototype.slice.call(arguments, 1); // Everything after *events*
        events.split(/\s+/).forEach(function(event) {
            var callList = self._events[event];
            if (callList) {
                callList.forEach(function(callObj) {
                    if (callObj.times) {
                        callObj.times -= 1;
                        if (callObj.times == 0) {
                            self.off(event, callObj.callback, callObj.context);
                        }
                    }
                    callObj.callback.apply(callObj.context || this, args);
                });
            }
        });
        return self;
    }
}

if (typeof module !== 'undefined' && 'exports' in module) {
    module.exports = OnOff;
}
