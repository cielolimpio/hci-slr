import axios from 'axios';
import {runSearchParams, ScopusSrcType} from './searchParams';
import {Paper, ScopusResponse} from "./models";

const API_KEY = process.env.REACT_APP_SCOPUS_API_KEY;
const API_URL = 'https://api.elsevier.com/content/search/scopus';
const MAX_COUNT = 25;

export default async function runSearch({ query, excludeKeywords, fromYear, toYear, source }: runSearchParams,
                                        start= 0, //검색 결과 페이지 시작
                                        count= 25 //한번에 보이는 검색 결과 개수
) {
  const keywordQuery = query.map(innerArray => `(${innerArray.join(' OR ')})`).join(' AND ');
  const excludeQuery = excludeKeywords.map(keyword => `"${keyword}"`).join(' AND NOT ');
  const sourceQuery = source ? `AND (SRCTYPE(${source}))` : '';
  const dateQuery = `${fromYear ? `AND PUBYEAR > ${fromYear} ` : ''}${toYear ? `AND PUBYEAR < ${toYear}` : ''}`;

  count = count > MAX_COUNT ? MAX_COUNT : count;

  const queryParams = {
      apiKey: API_KEY,
      query: `TITLE-ABS-KEY(${keywordQuery} AND NOT ${excludeQuery}) ${sourceQuery} ${dateQuery}`,
      start,
      count
  };

  try {
      const response = await axios.get<ScopusResponse>(API_URL, {
          params: queryParams,
      });

      //검색 총 개수
      const resultCount = response.data['search-results']['opensearch:totalResults'];
      console.log(`RESULT COUNT: ${resultCount}`);
      console.log(response.data['search-results']['opensearch:Query']);

      //검색 결과
      const papers: Paper[] = response.data['search-results'].entry.map((entry) => ({
          title: entry['dc:title'],
          doi: entry['prism:doi'],
          authorName: entry['dc:creator'],
          source: entry['prism:publicationName'],
          publicationYear: entry['prism:coverDate'].substring(0, 4),
      }));

      console.log(papers);

  } catch (error) {
      console.error('Error:', error);
  }
}

const exampleSearchParams: runSearchParams = {
    query: [['computer science'], ['HCI', 'Human computer interaction']],
    excludeKeywords: ['algorithm', 'machine learning'],
    fromYear: '2015',
    toYear: '2020',
    source: ScopusSrcType.Journal
};

runSearch(exampleSearchParams);


