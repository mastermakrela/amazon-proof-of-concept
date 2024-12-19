<script lang="ts">
	import Resizeable from "./Resizeable.svelte";

	/**
	 * Sends a message to plugin's `code.ts` file.
	 * We wrap `parent.postMessage` to get the type safety.
	 *
	 * @param message - The message to be sent.
	 */
	function postMessage(message: UiMessage, targetOrigin: string = "*") {
		parent.postMessage({ pluginMessage: message }, targetOrigin);
	}

	onmessage = async (event: MessageEvent<{ pluginMessage: PluginMessage }>) => {
		console.log("🚀 ~ onmessage= ~ event:", event);
		const data = event.data.pluginMessage;

		switch (data.type) {
			case "a-thing-happened":
				alert("Image added successfully!");
				break;
		}
	};

	async function button_click() {
		if (!image_url) return;

		const resp = await fetch(image_url);
		if (!resp.ok) {
			alert(`Something went wrong\n\n${await resp.text()}`);
			return;
		}

		const blob = await resp.blob();
		console.log(`[kek] 🦔 ~ file: Plugin.svelte:41 ~ button_click ~ blob:`, blob);
		postMessage({ type: "image", blob: new Uint8Array(await blob.arrayBuffer()) });
	}

	let image_url = $state("https://m.media-amazon.com/images/I/51vSJ9xAQtL._AC_SY879_.jpg");
</script>

<Resizeable />

<main
	class="prose max-w-none h-full bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center py-8 px-4 text-center"
>
	<h1>Amazon Images</h1>

	<div class="space-y-4">
		<input bind:value={image_url} placeholder="Amazon url" />

		<button onclick={button_click}>Get image</button>
	</div>
</main>

<style lang="postcss">
	button {
		@apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg;
	}

	input {
		@apply border-2 border-gray-300 rounded-lg py-2 px-4 w-full;
	}
</style>
