// InputManager.js
import { KeyboardEventTypes } from "@babylonjs/core";

class InputManager {
    inputMap = {};
    actions = {};

    constructor(scene) {
        scene.onKeyboardObservable.add((kbInfo) => {
            const code = kbInfo.event.code;
            if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
                this.inputMap[code] = true;
            } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
                this.inputMap[code] = false;
                this.actions[code] = true;
            }
        });
    }

    isPressed(code) {
        return !!this.inputMap[code];
    }

    wasReleased(code) {
        return !!this.actions[code];
    }

    resetActions() {
        this.actions = {};
    }
}

export default InputManager;
