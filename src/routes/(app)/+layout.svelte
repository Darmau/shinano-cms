<script lang="ts">
  import Navbar from "$components/Navbar.svelte";
  import Footer from "$components/Footer.svelte";
  import { goto, invalidate } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;
  $: ({ session, supabase } = data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (!newSession) {
        /**
         * Queue this as a task so the navigation won't prevent the
         * triggering function from completing
         */
        setTimeout(() => {
          goto('/', { invalidateAll: true });
        });
      }
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<svelte:head></svelte:head>

<div class = "frame">
  <nav class = "sidebar">
    <Navbar/>
  </nav>
  <main class = "main">
    <slot/>
  </main>
  <footer class = "footer border-t">
    <Footer/>
  </footer>
</div>

<style>
  .frame {
    min-height: 100vh;
    width: 100%;
    display: grid;
    grid-template-columns: 288px 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas:
    "sidebar main"
    "sidebar footer";
  }

  .sidebar {
    grid-area: sidebar;
    height: 100vh;
  }

  .main {
    grid-area: main;
    padding: 36px;
  }

  .footer {
    grid-area: footer;
    padding: 24px;
  }

  @media (max-width: 1024px) {
    .frame {
      display: flex;
      flex-direction: column;
    }

    .sidebar {
      height: auto;
    }

    .main {
      flex-grow: 1;
      padding: 24px;
    }
  }
</style>
