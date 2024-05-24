<script lang="ts">
  import type {Configs} from "$types/config.js";

  export let data: Configs;
</script>

<h1>Location</h1>

<p>{JSON.stringify(data.map)}</p>
