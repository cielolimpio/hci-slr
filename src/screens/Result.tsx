import { useLoaderData, useRouteError } from "react-router-dom";
import { RunSearchResponse } from "../scopus/models";
import IncludeSection from '../components/IncludeSection';
import { RunSearchParams, ScopusSrcType } from "../scopus/searchParams";
import { useEffect, useState } from "react";
import ExcludeSection from "../components/ExcludeSection";
import FilterSection from "../components/FilterSection";
import { OpenaiAndKeywordsResponse, OpenaiOrKeywordsResponse } from '../openai/types';
import runSearch from "../scopus/run-search";
import OrQueryHelper from "../components/OrQueryHelper";
import AndQueryHelper from "../components/AndQueryHelper";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const runSearchParams = JSON.parse(url.searchParams.get("data") as string) as RunSearchParams;
  console.log(runSearchParams);
  const data = await runSearch(runSearchParams);
  return { runSearchResponse: data, runSearchParams: runSearchParams };
}

export default function Result() {
  const loaderData = useLoaderData() as { runSearchResponse: RunSearchResponse, runSearchParams: RunSearchParams };
  const runSearchResponse = loaderData.runSearchResponse as RunSearchResponse;
  const runSearchParams = loaderData.runSearchParams as RunSearchParams;

  const [query, setQuery] = useState<string[][]>(runSearchParams.query);

  useEffect(() => {
    const newQuery = runSearchParams.query.filter((orQuery) => orQuery.length !== 0);
    setQuery(newQuery);
  }, [loaderData]);

  const [excludeKeywords, setExcludeKeywords] = useState<string[]>(runSearchParams.excludeKeywords);
  const [fromYear, setFromYear] = useState<undefined | string>(runSearchParams.fromYear);
  const [toYear, setToYear] = useState<undefined | string>(runSearchParams.toYear);
  const [source, setSource] = useState<undefined | ScopusSrcType>(runSearchParams.source);

  const [showOrQueryHelper, setShowOrQueryHelper] = useState<boolean>(false);
  const [showAndQueryHelper, setShowAndQueryHelper] = useState<boolean>(false);

  const handleQueryHelperClick = ({ wantIncrease }: { wantIncrease: boolean }) => {
    if (wantIncrease) {
      setShowOrQueryHelper(true);
    } else {
      setShowAndQueryHelper(true);
    }
  }

  const handleDecreaseResultsClick = () => {
    setShowOrQueryHelper(false);
    setShowAndQueryHelper(true);
  }

  const handleIncreaseResultsClick = () => {
    setShowAndQueryHelper(false);
    setShowOrQueryHelper(true);
  }

  return (
    <div className="w-full h-full flex flex-row">
      <div className="w-80 h-full bg-white relative z-10">
        <div className="h-full flex flex-col pt-6 pb-24 px-4 gap-6 overflow-y-scroll">
          <h1 className="text-4xl font-bold text-blue">New Scopus</h1>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold">Include</h2>
            <div className="w-full">
              <IncludeSection query={query} setQuery={setQuery} handleQueryHelperClick={handleQueryHelperClick} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold">Exclude</h2>
            <ExcludeSection excludeKeywords={excludeKeywords} setExcludeKeywords={setExcludeKeywords} />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold">Filter</h2>
            <FilterSection fromYear={fromYear} toYear={toYear} source={source} setFromYear={setFromYear} setToYear={setToYear} setSource={setSource} />
          </div>
        </div>
        <div className="absolute left-0 right-0 bottom-0 pl-4 pr-8 py-4">
          <div className="w-full h-full rounded-xl py-2.5 bg-blue">
            <p className="text-2xl font-semibold text-white text-center">RUN SEARCH</p>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-green-100 relative">
        <div className={`absolute left-4 top-12 w-80 transition-transform duration-500 ${showOrQueryHelper ? 'translate-x-0' : '-translate-x-96'}`}>
          <OrQueryHelper 
          runSearchParams={runSearchParams} openaiOrKeywordsResponse={mockOpenaiOrKeywordsResponse} 
          handleDecreaseResultsClick={handleDecreaseResultsClick} setShowOrQueryHelper={setShowOrQueryHelper}
          />
        </div>
        <div className={`absolute left-4 top-12 w-80 transition-transform duration-500 ${showAndQueryHelper ? 'translate-x-0' : '-translate-x-96'}`}>
          <AndQueryHelper 
          runSearchParams={runSearchParams} openaiAndKeywordsResponse={mockOpenaiAndKeywordsResponse} 
          handleIncreaseResultsClick={handleIncreaseResultsClick} setShowAndQueryHelper={setShowAndQueryHelper}
          />
        </div>
      </div>
    </div>
  );
}

export function ResultErrorElement() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="text-5xl">
      ERROR
    </div>
  );
}

const mockOpenaiOrKeywordsResponse: OpenaiOrKeywordsResponse = {
  list: [
    {
      id: 0,
      synonyms: [
        {
          word: "Kiwi",
          why: "This modification expands the scope to include literature that discusses the mass and black holes in the context of accretion disks, which are commonly associated with black hole physics.",
        },
        {
          word: "Pineapple",
          why: "This keyword relates to tropical fruits and their properties, expanding the search to include such topics.",
        },
        {
          word: "Strawberry",
          why: "By including this keyword, the search would consider literature relating to berries and their characteristics.",
        },
      ],
    },
    {
      id: 1,
      synonyms: [
        {
          word: "asdf",
          why: "This modification expands the scope to include literature that discusses the mass and black holes in the context of accretion disks, which are commonly associated with black hole physics.",
        },
        {
          word: "aasdfasdfsdf",
          why: "By including this keyword, the search would consider literature relating to berries and their characteristics.",
        },
      ],
    },
  ],
};

const mockOpenaiAndKeywordsResponse: OpenaiAndKeywordsResponse = {
  list: [
    {
      word: "Apple",
      why: "Including this keyword will allow the search to consider literature relating to apples and their characteristics.",
    },
    {
      word: "Banana",
      why: "This keyword relates to tropical fruits and their properties, expanding the search to include such topics.",
    },
    {
      word: "Cherry",
      why: "By including this keyword, the search would consider literature relating to cherries and their characteristics.",
    },
  ],
};

