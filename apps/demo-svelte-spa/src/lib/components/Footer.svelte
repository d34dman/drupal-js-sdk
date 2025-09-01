<script lang="ts">
  import { ExternalLink, BookOpen } from "@lucide/svelte";
</script>

<!-- Footer -->
<footer class="mt-8">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Author Information Card -->
    <div class="card bg-base-100 shadow-md rounded-2xl">
      <div class="card-body">
        <h3 class="card-title text-lg mb-4">About the Author</h3>
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            SD
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 dark:text-white">Shibin Das</h4>
            <p class="text-slate-600 dark:text-slate-400">D34dMan</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="https://www.linkedin.com/in/d34dman/" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 hover:scale-105">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
          <a href="https://github.com/d34dman" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>

    <!-- Project Resources Card -->
    <div class="card bg-base-100 shadow-md rounded-2xl">
      <div class="card-body">
        <h3 class="card-title text-lg mb-4">Project Resources</h3>
        <div class="space-y-3">
          <a href="https://github.com/d34dman/drupal-js-sdk" target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02] group">
            <div class="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">Source Code</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">View code, issues, and contribute</p>
            </div>
            <ExternalLink class="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
          </a>

          <a href="https://d34dman.github.io/drupal-js-sdk/" target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02] group">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
              <BookOpen class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">Documentation</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">API reference and guides</p>
            </div>
            <ExternalLink class="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Copyright Card -->
  <div class="card bg-base-100 shadow-md rounded-2xl mt-6">
    <div class="card-body py-4 text-center">
      <p class="text-sm text-slate-600 dark:text-slate-400">
        © 2025 <a href="https://github.com/d34dman" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">Shibin Das</a>. All rights reserved.
      </p>
    </div>
  </div>
</footer>
