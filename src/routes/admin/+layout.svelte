<script lang="ts">
  import Navbar from "$components/Navbar.svelte";
  import Footer from "$components/Footer.svelte";
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
    width: 100%;
    display: grid;
    grid-template-columns: 240px 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas:
    "sidebar main"
    "sidebar footer";
  }

  .sidebar {
    grid-area: sidebar;
    height: 100vh;
    width: 100%;
    position: sticky;
    top: 0;
  }

  .main {
    grid-area: main;
    padding: 36px;
  }

  .footer {
    grid-area: footer;
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

    .footer {
      flex-grow: 0;
    }
  }
</style>
