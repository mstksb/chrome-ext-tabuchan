import { createController } from "./controller.js";
import { createInputBridge } from "./input-bridge.js";

export const controller = createController(chrome);

createInputBridge(chrome, controller).start();
void controller.start();
