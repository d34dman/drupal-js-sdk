<script lang="ts">
  import Highlight from "svelte-highlight";
  import typescript from "svelte-highlight/languages/typescript";
  import javascript from "svelte-highlight/languages/javascript";
  import json from "svelte-highlight/languages/json";
  import bash from "svelte-highlight/languages/bash";
  import plaintext from "svelte-highlight/languages/plaintext";
  import xml from "svelte-highlight/languages/xml";
  import github from "svelte-highlight/styles/github";
  import { Code2 } from "@lucide/svelte";

  export let code: string;
  export let language: "typescript" | "javascript" | "json" | "bash" | "text" | "svelte" = "typescript";
  export let title: string = "";
  // Using const export to avoid unused export let warning
  export const showLineNumbers: boolean = false;

  const languageMap = {
    typescript,
    javascript,
    json,
    bash,
    text: plaintext,
    svelte: xml,
  };

  $: selectedLanguage = languageMap[language] || typescript;
</script>

<svelte:head>
  {@html github}
</svelte:head>

<div class="code-block-container group">
  {#if title}
    <div class="code-title bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 px-4 py-3 rounded-t-xl border-b border-slate-200/50 dark:border-slate-600/50 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
          <Code2 class="w-4 h-4 text-white" />
        </div>
        <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="px-2 py-1 text-xs font-medium bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-md uppercase tracking-wide">{language}</span>
        <button aria-label="Copy code" class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" title="Copy code">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  {/if}
  
  <div class="code-content {title ? 'rounded-t-none' : ''} rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 {title ? 'border-t-0' : ''}">
    <Highlight 
      language={selectedLanguage} 
      {code} 
      class="text-sm leading-relaxed"
    />
  </div>
</div>

<style>
  :global(.code-block-container .hljs) {
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: none;
    border-radius: 0;
    font-size: 0.875rem;
    line-height: 1.6;
  }
  
  :global(.dark .code-block-container .hljs) {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }
  
  :global(.code-content.rounded-t-none .hljs) {
    border-top: none;
  }
  
  :global(.code-block-container .hljs code) {
    font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-weight: 500;
  }
  
  /* Enhanced syntax highlighting */
  :global(.code-block-container .hljs-string) {
    color: #10b981;
  }
  
  :global(.code-block-container .hljs-keyword) {
    color: #8b5cf6;
    font-weight: 600;
  }
  
  :global(.code-block-container .hljs-function) {
    color: #3b82f6;
  }
  
  :global(.code-block-container .hljs-comment) {
    color: #64748b;
    font-style: italic;
  }
  
  :global(.dark .code-block-container .hljs-string) {
    color: #34d399;
  }
  
  :global(.dark .code-block-container .hljs-keyword) {
    color: #a855f7;
  }
  
  :global(.dark .code-block-container .hljs-function) {
    color: #60a5fa;
  }
  
  :global(.dark .code-block-container .hljs-comment) {
    color: #94a3b8;
  }
</style>
