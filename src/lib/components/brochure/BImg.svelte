<script>
	/** Image that falls back to a labelled placeholder when no URL is set. */
	let { src = '', alt = '', label = 'Photo' } = $props();
</script>

{#if src}
	<img class="b-img" {src} {alt} />
{:else}
	<div class="b-img b-img--empty">{label}</div>
{/if}
