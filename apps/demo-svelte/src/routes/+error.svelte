<script>
  import { page } from '$app/stores';
</script>
<div class="grid grid-cols-4 gap-4">
  <div class="col-start-2 col-span-2 m-10 alert alert-error shadow-lg">
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <dl>
          <dt><strong>{$page.error.message}</strong></dt>
          <dt>We encountered an unexpected error, havin't we?</dt>
          <dt>
            <br>
            <ol>
              <lh>Possible reasons:</lh>
              <li>Demo is down since the app can't connect to a Drupal backend.</li>
              <li>We encountered some un-implemented feature</li>
              <li>We encountered some un-implemented bug</li>
            </ol>
          </dt>
          <dt><br><a class="btn btn-outline btn-sm" href="/">Click here to go back to homepage</a> and try again or fail again ¯\_(ツ)_/¯.</dt>
          
        </dl>
    </div>
    <div>   </div>
    </div>
</div>

