// Type definitions for Gamepad API
// Project: http://www.w3.org/TR/gamepad/
// Definitions by: Kon <http://phyzkit.net/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// Modified by Joe Julik 2014

interface GamepadList {
    [index: number]: Gamepad;
    length: number;
}

interface Navigator {
    /**
     * The currently connected and interacted-with gamepads. Gamepads must only appear in the list if they are currently connected to the user agent, and have been interacted with by the user. Otherwise, they must not appear in the list to avoid a malicious page from fingerprinting the user based on connected devices.
     * @readonly
     */
    getGamepads(): Gamepad[];

    webkitGetGamepads(): GamepadList;
}

/*
 * @event gamepadconnected
 * A user agent must dispatch this event type to indicate the user has connected a gamepad. If a gamepad was already connected when the page was loaded, the gamepadconnected event will be dispatched when the user presses a button or moves an axis.
 */

/*
 * @event gamepaddisconnected 
 * When a gamepad is disconnected from the user agent, if the user agent has previously dispatched a gamepadconnected event, a gamepaddisconnected event must be dispatched.
 */