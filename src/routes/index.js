export async function GET() {
    const response = await fetch('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=dementia')
    const resText = await response.text();
    return {
        props: {resText}
    }
}
