<script lang="ts">
  import Navbar from "$components/Navbar.svelte";
  import Footer from "$components/Footer.svelte";

  export let data;
</script>

<svelte:head></svelte:head>

<div class = "frame">
  <nav class = "sidebar">
    <Navbar/>
  </nav>
  <main class = "main bg-white">
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
