OnOff
=====
**Author:** Dan McDougall (daniel.mcdougall@liftoffsoftware.com).
**License:**  Apache 2.0 (see LICENSE.txt)

OnOff is a tiny JavaScript library that provides `on()`, `off()`, and `trigger()` event management functions.  A convenient `once()` function is also provided for events that should only be called one time.

Examples::

    > // Create an instance of OnOff()
    > EventManager = new OnOff(); // NOTE: "new" is actually optional
    > // A little test function:
    > var testFunc = function(args) { console.log('args: ' + args + ', this.foo: ' + this.foo) };
    > // Call testFunc() whenever "test_event" is triggered:
    > EventManager.on("test_event", testFunc);
    > // Fire the test_event with 'an argument' as the only argument:
    > EventManager.trigger("test_event", 'an argument');
    args: an argument, this.foo: undefined
    > // Remove the event so we can change it:
    > EventManager.off("test_event", testFunc);
    > // Now let's pass in a context object:
    > EventManager.on("test_event", testFunc, {'foo': 'bar'});
    > // Now fire it just like before
    > EventManager.trigger("test_event", 'an argument');
    args: an argument, this.foo: bar

.. note:: Each instance of `OnOff` maintains its own list of events and callbacks so there shouldn't be conflicts when two libraries happen to use it.

Code Documentation
==================

OnOff.on
--------
`OnOff.on(events, callback, context, times)`

    Adds the given *callback* / *context* combination to the given *events*; to be called when the given *events* are triggered.

        :events (string): A space-separated list of events that will have the given *callback* / *context* attached.
        :callback (function): The function to be called when the given *event* is triggered.
        :context (object): An object that will be bound to *callback* as `this` when it is called.
        :times (integer): The number of times this callback will be called before it is removed from the given *event*.

    Example::

        > EventManager = OnOff();
        > EventManager.on("app:some_event", someFunction);

OnOff.off
---------
`OnOff.off(events, callback, context)`

    Removes the given *callback* / *context* combination from the given *events*

        :param string events: A space-separated list of events.
        :param function callback: The function that's attached to the given events to be removed.
        :param object context: The context attached to the given event/callback to be removed.

    Example::

        > EventManager.off("app:some_event", someFunction);
        > // Or to clear *all* events in one go:
        > EventManager.off();

OnOff.once
----------
`OnOff.once(events, callback, context)`

    A convenience function that executes the following::

        > EventManager.on(events, callback, context, 1);

OnOff.trigger
-------------
`OnOff.trigger(events[, *arguments*])`

    Triggers the given *events*.  Any additional provided arguments will be passed to the callbacks attached to the given events.

        :param string events: A space-separated list of events to trigger

        Example::

            > // The '1' below will be passed to each callback as the only argument
            > EventManager.trigger("your_app:some_event", 1);

OnOff.callbacks
---------------
For inspection purposes only; all events and their respective callbacks are stored here.
