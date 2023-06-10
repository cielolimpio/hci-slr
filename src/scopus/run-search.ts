import axios from 'axios';
import { RunSearchParams, ScopusSrcType } from './searchParams';
import { Paper, RunSearchResponse, ScopusResponse } from "./models";

const API_KEY = process.env.REACT_APP_SCOPUS_API_KEY;
const API_URL = 'https://api.elsevier.com/content/search/scopus';
export const MAX_COUNT = 25;

export default async function runSearch({
  query,
  excludeKeywords,
  fromYear,
  toYear,
  source,
  start = 0,
  count = 25,
}: RunSearchParams): Promise<RunSearchResponse | null> {
  const keywordQuery = query.map(innerArray => `(${innerArray.join(' OR ')})`).join(' AND ');
  const excludeQuery = excludeKeywords.map(keyword => ` AND NOT ${keyword}`);
  const sourceQuery = source ? ` AND (SRCTYPE(${source}))` : '';
  const dateQuery = `${fromYear ? ` AND PUBYEAR > ${fromYear} ` : ''}${toYear ? `AND PUBYEAR < ${toYear}` : ''}`;

  const countForQuery = count > MAX_COUNT ? MAX_COUNT : count;

  const queryParams = {
    apiKey: API_KEY,
    query: `TITLE-ABS-KEY(${keywordQuery}${excludeQuery})${sourceQuery}${dateQuery}`,
    start,
    count: countForQuery
  };

 
  try {
    const response = await axios.get<any>(API_URL, {
      params: queryParams,
    });

    const scopusResponse = ScopusResponse.deserialize(response.data);

    //검색 총 개수
    const resultCount = scopusResponse.searchResults?.openSearchTotalResults;
    console.log(`RESULT COUNT: ${resultCount}`);

    //검색 결과
    // @ts-ignore
    const papers: Paper[] = scopusResponse.searchResults?.entry?.map((entry) => ({
      title: entry.dcTitle,
      doi: entry.prismDoi,
      authorName: entry.dcCreator,
      source: entry.prismPublicationName,
      publicationYear: entry.prismCoverDate?.getFullYear(),
    }));

    if (!resultCount) {
      return null;
    }

    return {
      resultCount: resultCount,
      papers,
    };

  } catch (error) {
    console.log(error);
    return null;
  }
}

const exampleSearchParams: RunSearchParams = {
  query: [['computer science'], ['HCI', 'Human computer interaction']],
  excludeKeywords: ['algorithm', 'machine learning'],
  fromYear: '2015',
  toYear: '2020',
  source: ScopusSrcType.Journal
};

