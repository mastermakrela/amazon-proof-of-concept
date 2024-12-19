import { get_random_number } from "$lib";

// MARK: - Helpers

/**
 * Sends a message from the plugin to the UI.
 * We wrap `figma.ui.postMessage` to get the type safety.
 *
 * @param message - The message to be sent.
 */
function postMessage(message: PluginMessage) {
	figma.ui.postMessage(message);
}

// MARK: - Plugin

figma.showUI(__html__, { themeColors: true, width: 500, height: 800 });
figma.clientStorage.getAsync("size").then((size) => {
	if (size) figma.ui.resize(size.width, size.height);
});

// save some state
let count = 0;
let text = "";

/**
 * Handle messages received from the UI.
 *
 * @param {UiMessage} msg - The message received from the UI.
 */
figma.ui.onmessage = async (msg: UiMessage) => {
	switch (msg.type) {
		case "resize":
			const { width, height } = msg;
			figma.ui.resize(width, height);
			figma.clientStorage.setAsync("size", { width, height });
			break;

		case "button-click":
			console.log("Message received: button clicked in UI");
			const random_number = get_random_number();
			figma.notify(`You did the thing! (your lucky number is ${random_number}`);
			break;

		case "increment":
			console.log("Message received: increment in UI");
			count++;
			postMessage({ type: "count", count });
			break;

		// @bebke: read from here
		case "image":
			console.log("[kek] Message received: image in UI");
			const blob = msg.blob;
			console.log("[kek] image blob", blob);

			const image = figma.createImage(blob);
			const img_size = await image.getSizeAsync();

			const rect = figma.createRectangle();
			rect.resize(img_size.width, img_size.height);

			rect.fills = [{ type: "IMAGE", imageHash: image.hash, scaleMode: "FILL" }];
			figma.currentPage.appendChild(rect);

			figma.viewport.scrollAndZoomIntoView([rect]);

			postMessage({ type: "a-thing-happened" });

			break;

		default:
			return msg satisfies never;
	}
};
