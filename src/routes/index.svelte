<!--
<script context="module">
    import {browser} from '$app/env';
    import {xmlToJson} from '$lib/utils';

    export const load = async ({fetch}) => {
        const response = await fetch('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=dementia')
        const resText = await response.text();
        if (browser) {
                let parser = new DOMParser();
                // Parse text as XML, then convert to JSON
                const json = xmlToJson(parser.parseFromString(resText, "application/xml"));
                return {
                    props: {json}
                }
        }

        return {
                    props: response.status
                }
    }
</script>
-->

<script>
    import {browser} from '$app/env';
    import {xmlToJson} from '$lib/utils';

    let json;
    let query;

    $: url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=' + query;

    const searchPubmed = async () => {
        console.log(url)
        const response = await fetch(url)
        const resText = await response.text();
        if (browser) {
                // Parse text as XML, then convert to JSON (DOMParser only works in browser)
                let parser = new DOMParser();
                json = xmlToJson(parser.parseFromString(resText, "application/xml"));
                console.log(json)
                return json
        }

        return {
            props: response.status
        }
    }

    let promise;
    let emptyQuery = false;

    function handleClick() {
        if (query) {
            emptyQuery = false;
            promise = searchPubmed();
        }
        else 
            emptyQuery = true;
    }
    
</script>

<div class="navbar bg-base-100">
    <div class="flex-1">
      <a href="/" class="normal-case font-semibold text-xl">PubMed API</a>
    </div>
    <div class="flex-none gap-2">
      <div class="form-control">
        <div class="relative w-full h-full">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg class="w-5 h-5 text-base-content" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
            </div>
            <input autofocus bind:value={query} type="text" id="search-icon" class="block p-2 pl-10 w-full h-full bg-base-100 placeholder:text-neutral rounded-lg border focus:placeholder:text-base-300 border-2 outline-none hover:border-base-content border-base-300 focus:border-base-content" placeholder="Search posts">
        </div>
      </div>
        <button on:click={handleClick} class="bg-primary rounded-lg p-2 h-full text-white">Search</button>
    </div>
</div>

{#if emptyQuery}
<p>Please provide a query</p>
{/if}
{#await promise}
<button class="btn btn-square mx-auto loading"></button>
{:then json}
    {#if json}
        <ul>
            {#each json.eSearchResult[1].IdList.Id as id}
                <li>{id['#text']}</li>
            {/each}
        </ul>
    {/if}
{/await}
