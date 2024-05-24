<script>
  import Home from '$assets/icons/home.svelte';
  import Message from '$assets/icons/inbox.svelte';
  import Media from '$assets/icons/photo.svelte';
  import Article from '$assets/icons/document-text.svelte';
  import Photo from '$assets/icons/camera.svelte';
  import Video from '$assets/icons/video-camera.svelte';
  import Memo from '$assets/icons/light-bulb.svelte';
  import Comment from '$assets/icons/chat-bubble-left.svelte';
  import User from '$assets/icons/users.svelte';
  import Tag from '$assets/icons/tag.svelte';
  import Setting from '$assets/icons/cog.svelte';
  import {page} from '$app/stores';
  import { t, locale, locales } from '$lib/functions/i18n'

  const navItems = [
    {name: 'home', href: '/', icon: Home},
    {name: 'message', href: '/message', icon: Message},
    {name: 'media', href: '/media', icon: Media},
    {name: 'article', href: '/article', icon: Article},
    {name: 'photo', href: '/photo', icon: Photo},
    {name: 'video', href: '/video', icon: Video},
    {name: 'thought', href: '/thought', icon: Memo},
    {name: 'comment', href: '/comment', icon: Comment},
    {name: 'user', href: '/user', icon: User},
    {name: 'tag', href: '/tag', icon: Tag},
    {name: 'setting', href: '/setting', icon: Setting},
  ];

  let menuOpen = false;
</script>

<div>
  <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
  <div
    class = "relative z-50 p-4 bg-white border-b flex items-center lg:hidden" role =
    "dialog"
    aria-modal = "true"
  >
    <button
      type = "button"
      on:click = {() => menuOpen = true}
      class="rounded-full p-2 hover:bg-gray-100"
    >
      <span class = "sr-only">Open sidebar</span>
      <svg
        xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 24 24"
        fill = "currentColor" class = "w-6 h-6"
      >
        <path
          fill-rule = "evenodd"
          d = "M3 9a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9Zm0 6.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
          clip-rule = "evenodd"
        />
      </svg>
    </button>

    {#if menuOpen}
      <div class =
             "fixed inset-0 bg-gray-900/80 transition-opacity ease-linear duration-300 overflow-hidden"></div>
      <div class = "fixed inset-0 flex">
        <div class = "relative mr-16 flex w-full max-w-xs flex-1">
          <div class = "absolute left-full top-0 flex w-16 justify-center pt-5">
            <button
              type = "button"
              class = "-m-2.5 p-2.5"
              on:click = {() => menuOpen = false}
            >
              <span class = "sr-only">Close sidebar</span>
              <svg
                class = "h-6 w-6 text-white" fill = "none" viewBox = "0 0 24 24"
                stroke-width = "1.5" stroke = "currentColor"
                aria-hidden = "true"
              >
                <path
                  stroke-linecap = "round" stroke-linejoin = "round"
                  d = "M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Sidebar component, swap this element with another sidebar if you like -->
          <div
            class = "flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4"
          >
            <div class = "flex h-16 shrink-0 items-center">
              <img
                class = "h-8 w-auto"
                src = "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt = "Your Company"
              >
            </div>
            <nav class = "flex flex-1 flex-col">
              <ul role = "list" class = "flex flex-1 flex-col gap-y-2">
                {#each navItems as item}
                  <li>
                    <a
                      href = {item.href}
                      on:click={() => menuOpen = false}
                      data-sveltekit-preload-data="tap"
                      class = {
                       $page.url.pathname === item.href
                         ? 'text-cyan-600 bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                         :
                         'text-gray-700 hover:text-cyan-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                     }
                    >
                      <svelte:component
                        this = {item.icon} classList = {
                    $page.url.pathname === item.href
                      ? 'h-6 w-6 shrink-0 text-cyan-600'
                      : 'h-6 w-6 shrink-0 text-gray-400 group-hover:text-cyan-600'
                    }
                      />
                      {$t(item.name)}
                    </a>
                  </li>
                {/each}
              </ul>
            </nav>
            <select
              bind:value={$locale}
              class="rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm hover:bg-gray-50"
            >
              {#each locales as language}
                <option value={language.lang}>{language.locale}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Static sidebar for desktop -->
  <div
    class = "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
  >
    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div
      class = "flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4"
    >
      <div class = "flex h-16 shrink-0 items-center">
        <img
          class = "h-8 w-auto"
          src = "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt = "可可托海没有海管理后台"
        >
      </div>
      <nav class = "flex flex-1 flex-col">
        <ul role = "list" class = "flex flex-1 flex-col gap-y-7">
          <li>
            <ul role = "list" class = "-mx-2 space-y-2">
              {#each navItems as item}
                <li>
                  <a
                    href = {item.href}
                    data-sveltekit-preload-data="hover"
                    class = {
                       $page.url.pathname === item.href
                         ? 'text-cyan-600 bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                         :
                         'text-gray-700 hover:text-cyan-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                     }
                  >
                    <svelte:component
                      this = {item.icon} classList = {
                    $page.url.pathname === item.href
                      ? 'h-6 w-6 shrink-0 text-cyan-600'
                      : 'h-6 w-6 shrink-0 text-gray-400 group-hover:text-cyan-600'
                    }
                    />
                    {$t(item.name)}
                  </a>
                </li>
              {/each}
            </ul>
          </li>
        </ul>
      </nav>
      <select
        bind:value={$locale}
        class="rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm hover:bg-gray-50"
      >
        {#each locales as language}
          <option value={language.lang}>{language.locale}</option>
        {/each}
      </select>
    </div>
  </div>
</div>
