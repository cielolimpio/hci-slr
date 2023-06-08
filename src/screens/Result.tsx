import { Params, useLoaderData, useLocation, useRouteError } from "react-router-dom";
import { RunSearchResponse } from "../scopus/models";
import IncludeSection from '../components/IncludeSection';
import { RunSearchParams, ScopusSrcType } from "../scopus/searchParams";
import { useState } from "react";
import ExcludeSection from "../components/ExcludeSection";
import FilterSection from "../components/FilterSection";
import sparkleIcon from '../icons/sparkle.svg';
import Select from 'react-select';
import { OpenaiOrKeywordsResponse } from '../openai/types';
import runSearch from "../scopus/run-search";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const runSearchParams = JSON.parse(url.searchParams.get("data") as string) as RunSearchParams;
  const data = await runSearch(runSearchParams);
  return { runSearchResponse: data, runSearchParams: runSearchParams };
}

export default function Result() {
  const loaderData = useLoaderData() as { runSearchResponse: RunSearchResponse, runSearchParams: RunSearchParams };

  const runSearchResponse = loaderData.runSearchResponse as RunSearchResponse;
  const runSearchParams = loaderData.runSearchParams as RunSearchParams;

  const [query, setQuery] = useState<string[][]>(runSearchParams.query);
  const [excludeKeywords, setExcludeKeywords] = useState<string[]>(runSearchParams.excludeKeywords);
  const [fromYear, setFromYear] = useState<undefined | string>(runSearchParams.fromYear);
  const [toYear, setToYear] = useState<undefined | string>(runSearchParams.toYear);
  const [source, setSource] = useState<undefined | ScopusSrcType>(runSearchParams.source);

  const handleQueryHelperClick = ({ wantIncrease }: { wantIncrease: boolean }) => {
    if (wantIncrease) {
      console.log('increase!');
    } else {
      console.log('decrease!');
    }
  }

  return (
    <div className="w-full h-full flex flex-row">
      <div className="w-80 h-full bg-white relative">
        <div className="h-full flex flex-col pt-6 pb-24 px-4 gap-6 overflow-scroll">
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
        <div className="absolute left-0 right-0 bottom-0 px-4 py-4">
          <div className="w-full h-full rounded-xl py-2.5 bg-blue">
            <p className="text-2xl font-semibold text-white text-center">RUN SEARCH</p>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-green-300 relative">
        <QueryHelper query={query} openaiOrKeywordsResponse={mockOpenaiOrKeywordsResponse} />
      </div>
    </div>
  );
}

interface QueryHelperProps {
  query: string[][];
  openaiOrKeywordsResponse: OpenaiOrKeywordsResponse;
}

function QueryHelper({ query, openaiOrKeywordsResponse }: QueryHelperProps) {

  const subQueryGroups: string[] = query.map((subQuery, i) => {
    return `Group ${i + 1}: ${subQuery.join(' OR ')}`;
  });

  const subQueryGroupOptions = subQueryGroups.map((subQueryGroup, i) => {
    return { value: i, label: subQueryGroup };
  });

  const [selectedSubQueryGroupIndex, setSelectedSubQueryGroupIndex] = useState<number>(0);

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleAddKeywordClick = () => {
    console.log('add keyword!');
  }

  const handleDecreaseResultsClick = () => {
    console.log('decrease results!');
  }

  return (
    <div className="absolute left-4 top-12 w-80 bg-white rounded-2xl shadow-lg flex flex-col items-center pt-4 pb-6 px-4 gap-5">
      <div className="flex flex-row gap-2.5">
        <img src={sparkleIcon} alt="sparkle Icon" />
        <h3 className="font-bold text-xl text-blue">Query Helper</h3>
        <img src={sparkleIcon} alt="sparkle Icon" />
      </div>
      <div className="w-full flex flex-col gap-0.5">
        <p className="text-sm text-darkgray">Add keyword to OR Group</p>
        <Select
          options={subQueryGroupOptions}
          styles={{ menuList: base => ({ ...base, maxHeight: '200px' }) }}
          value={subQueryGroupOptions.find(option => option.value === selectedSubQueryGroupIndex)}
          onChange={(option) => { setSelectedSubQueryGroupIndex(option!.value) }}
        />
      </div>
      <div className="w-full rounded-lg bg-white shadow-md py-2.5 px-2.5 flex flex-col">
        {openaiOrKeywordsResponse.list.find((e) => e.id === selectedSubQueryGroupIndex)!.synonyms.map((synonym, i) => (
          <div key={i}>
            {i !== 0 && <div className="w-full h-[0.5px] my-2.5 bg-gray"></div>}
            <div className="w-full flex flex-col gap-2.5 cursor-pointer" onClick={() => { setSelectedOption(synonym.word) }}>
              <div className="flex flex-row items-center gap-2.5">
                <input
                  type="radio"
                  value={synonym.word}
                  checked={selectedOption === synonym.word}
                  onChange={handleOptionChange}
                />
                <p className="text-lg">{synonym.word}</p>
                <div className="flex-grow"></div>
                <p className="text-md text-skyblue">+28</p>
              </div>
              <p className="text-md font-light pl-2 pr-4">
                {synonym.why}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col gap-2.5">
        <div className="w-full rounded-lg shadow-md py-2 px-3 border-blue border-2 cursor-pointer" onClick={handleAddKeywordClick}>
          <p className="w-full text-center text-blue font-bold font-xl">
            ADD KEYWORD
          </p>
        </div>
        <div className="w-full rounded-lg shadow-md py-2 px-3 cursor-pointer" onClick={handleDecreaseResultsClick}>
          <p className="w-full text-center font-bold font-xl">
            Decrease results
          </p>

        </div>
      </div>


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

export function ResultErrorElement(){
  const error = useRouteError();
  console.error(error);
  return (
    <div className="text-5xl">
      ERROR

    </div>
  );
}