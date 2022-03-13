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

    function handleClick() {
        promise = searchPubmed();
    }
    
</script>
<input type="text" bind:value={query} name="query" placeholder="Enter query">
<button on:click={handleClick}>Search</button>

{#await promise then json}
    {#if json}
        <ul>
            {#each json.eSearchResult[1].IdList.Id as id}
                <li>{id['#text']}</li>
            {/each}
        </ul>
    {/if}
{/await}
