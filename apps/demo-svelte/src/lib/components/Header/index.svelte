<script>
	import dlogo from './logo.svg';
  export let menu = [];
</script>
<div class="navbar  shadow-lg bg-neutral text-neutral-content">
  <div class="flex-1 px-2 mx-2">
    <a href="/" class="w-6  mr-2">
			<img src={dlogo} class="w-6 mr-2" alt="SvelteKit" />
		</a>
    <span class="text-lg font-bold">
            Demo
          </span>
  </div> 
  <div class="flex-none hidden px-2 mx-2 lg:flex">
    <div class="flex items-stretch">
      <a class="btn btn-ghost btn-sm rounded-btn" href="https://drupal-js-sdk-docs.netlify.app/">
        <svg xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mr-2 inline-block stroke-current"
         fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
</svg>
              Guide
            
      </a> 
      <a class="btn btn-ghost btn-sm rounded-btn" href="https://github.com/d34dman/drupal-js-sdk">
        <svg xmlns="http://www.w3.org/2000/svg" 
        class="h-5 w-5 mr-2 inline-block stroke-current"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
</svg>
              Github
            
      </a> 
      <a class="btn btn-ghost btn-sm rounded-btn" href="https://d34dman.github.io/drupal-js-sdk/">
        <svg 
        class="h-5 w-5 mr-2 inline-block stroke-current"
        xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
</svg>
              API
            
      </a>
    </div>
  </div> 
  <div class="flex-none">
    <div class="dropdown dropdown-end">
      <div tabindex="-1" class="btn btn-ghost btn-square">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> 
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!---->
        </svg>
      </div> 
      <ul class="shadow menu dropdown-content bg-neutral rounded-box w-52">
{#each menu as menu_item}
    <li><a href="{menu_item.href}">{menu_item.label}</a></li>
{/each}
      </ul>
    </div>

  </div>
</div>

