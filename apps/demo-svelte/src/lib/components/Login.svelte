<script>
	import Alert from '$lib/components/Alert.svelte';
	let user = { username: '', password: '' };
	export let error = '';
	export let inProgress = false;
	let rememberMe = false;
</script>

<div class="hero min-h-screen bg-base-200">
  <div class="flex-col justify-center hero-content lg:flex-row">
    <div class="text-center lg:text-left">
      <h1 class="mb-5 text-5xl font-bold">
            Hello Dave
          </h1> 
    <div class="mockup-code mr-4 mb-4 p-4">
      <pre data-prefix="🧑"><code>Hello, HAL. Do you read me, HAL?</code></pre> 
      <pre data-prefix="⭕"><code>Affirmative, Dave. I read you.</code></pre> 
      <pre data-prefix="🧑"><code>Open the pod bay doors, HAL.</code></pre> 
      <pre data-prefix="⭕" class="bg-warning text-neutral"><code>I am afraid I can't do that Dave!</code></pre>
    </div>

      <p class="mb-5">
            

            Oddly enough "admin" never made it into the top ten worst passwords. 
            The closest it ranked was 11th in the list published by internt security firm - SplashData.
            
          </p>
          <p class="mb-5">
            Username : admin
          </p>
          <p class="mb-5">
            Password : admin
          </p>
    </div> 
    <form
			autocomplete={rememberMe ? 'on' : 'off'}
			method="POST"
      action="?/login"
      class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
		>
      {#if error}
        <Alert message={error} type="error" />
      {/if}
      <div >
        <div class="card-body">
          <div class="form-control">
            <label class="label" for="username">
              <span class="label-text">Username</span>
            </label> 
            <input 
              bind:value={user.username}
              autocomplete={rememberMe ? 'name' : 'off'}
              required
              name="username"
              id="username" type="text" placeholder="username" class="input input-bordered">
          </div> 
          <div class="form-control">
            <label class="label" for="password">
              <span class="label-text">Password</span>
            </label> 
            <input 
              bind:value={user.password}
              autocomplete={rememberMe ? 'current-password' : 'off'}
              required
              name="password"
              id="password" type="password" placeholder="password" class="input input-bordered"> 
          </div> 
          <div class="flex items-center justify-between mt-2  ">
            <div class="text-sm">
              <a href="/user/password" class="label-text-alt">
                Forgot your password?
              </a>
            </div>
            <label class="cursor-pointer label" for="remember_me">
              <span class="label-text-alt mr-2">Remember me</span> 
              <div>
                <input 
                bind:checked={rememberMe}
                id="remember_me"
                name="remember_me"
                type="checkbox" 
                class="checkbox checkbox-accent"> 
                <span class="checkbox-mark"></span>
              </div>
            </label>
          </div>
          <div class="form-control mt-6">
            <button 
            disabled={inProgress}
					  type="submit"
            class="btn btn-primary">Sign in</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>