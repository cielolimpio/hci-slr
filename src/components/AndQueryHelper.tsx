import { useEffect, useState } from "react";
import { OpenaiAndKeywordsResponse } from "../openai/types";
import { RunSearchParams } from "../scopus/searchParams";
import { createSearchParams, useNavigate, useRouteError } from "react-router-dom";
import sparkleIcon from '../icons/sparkle.svg';
import OpenaiUseCase from "../openai/OpenaiUseCase";
import runSearch from "../scopus/run-search";

interface AndQueryHelperProps {
  runSearchParams: RunSearchParams;
  resultCount: number;
  handleIncreaseResultsClick: () => void;
  showAndQueryHelper: boolean;
  setShowAndQueryHelper: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AndQueryHelper({ runSearchParams, handleIncreaseResultsClick, resultCount, showAndQueryHelper, setShowAndQueryHelper }: AndQueryHelperProps) {

  const query = runSearchParams.query;

  const [selectedOption, setSelectedOption] = useState('');

  const [openaiAndKeywordsResponse, setOpenaiAndKeywordsResponse] = useState<OpenaiAndKeywordsResponse>({ list: [] });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setSelectedOption(openaiAndKeywordsResponse.list[0].word);
    }
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
    setOpenaiAndKeywordsResponse({ list: [] });
    const getCountsForEachNewQueries = async () => {
      if (showAndQueryHelper) {
        const response = await OpenaiUseCase.getAndKeywords(runSearchParams.query);
        if (response === null) {
          alert('Error getting AND keywords');
        } else {
          const newResponse: OpenaiAndKeywordsResponse = {
            list: await Promise.all(
              response.list.map(async (wordAndWhy) => {
                let newQuery = [...query, [wordAndWhy.word]];
                let newRunSearchParams = { ...runSearchParams };
                newRunSearchParams.query = newQuery;
                const runSearchResponse = await runSearch({ ...newRunSearchParams, count: 1 });
                return {
                  ...wordAndWhy,
                  count: runSearchResponse?.resultCount
                };
              })
            )
          }
          setOpenaiAndKeywordsResponse(newResponse);
          setSelectedOption(newResponse.list[0].word);
          setIsLoading(false);
        }
      }
    };
    getCountsForEachNewQueries();
  }, [showAndQueryHelper, runSearchParams]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const navigate = useNavigate();

  const handleAddKeywordClick = () => {
    const newQuery = [...query, [selectedOption]];
    const newRunSearchParams = {
      ...runSearchParams,
    };
    newRunSearchParams.query = newQuery;
    setShowAndQueryHelper(false);
    navigate({
      pathname: '/result',
      search: createSearchParams({
        data: JSON.stringify(newRunSearchParams),
      }).toString(),
    });
  }

  return (
    <div className="w-full h-full bg-blurwhite bg-opacity-50 backdrop-blur-md rounded-2xl shadow-lg flex flex-col items-center pt-4 pb-6 px-4 gap-5">
      <div className="flex flex-row gap-2.5">
        <img src={sparkleIcon} alt="sparkle Icon" />
        <h3 className="font-bold text-xl text-blue">Query Helper</h3>
        <img src={sparkleIcon} alt="sparkle Icon" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Add keyword to AND Group</h2>
        {
          isLoading
            ?
            <div className="w-full h-80 rounded-lg bg-white shadow-md py-2.5 px-2.5 flex flex-col justify-center items-center">
              <svg className="w-16 h-16" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g transform="rotate(180 12 12) translate(24 0) scale(-1 1)"><circle cx="18" cy="12" r="0" fill="#4758f5"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="12" r="0" fill="#4758f5"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="6" cy="12" r="0" fill="#4758f5"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle></g></svg>
              <p className="text-center text-blue font-semibold text-lg">GPT is generating<br />keyword recommendations</p>
              <div className="h-8"></div>
            </div>
            :
            <div className="w-full rounded-lg bg-white shadow-md py-2.5 px-2.5 flex flex-col">
              {openaiAndKeywordsResponse.list.map((words, i) => (
                <div key={i}>
                  {i !== 0 && <div className="w-full h-[0.5px] my-2.5 bg-gray"></div>}
                  <div className="w-full flex flex-col gap-2.5 cursor-pointer" onClick={() => { setSelectedOption(words.word) }}>
                    <div className="flex flex-row items-center gap-2.5">
                      <input
                        type="radio"
                        value={words.word}
                        checked={selectedOption === words.word}
                        onChange={handleOptionChange}
                      />
                      <p className="text-lg">{words.word}</p>
                      <div className="flex-grow"></div>
                      <p className="text-md text-red-500" >-{resultCount - words.count!}</p>
                    </div>
                    <p className="text-md font-light pl-2 pr-4">
                      {words.why}
                    </p>
                  </div>
                </div>
              ))
              }
            </div>
        }
      </div>
      <div className="w-full flex flex-col gap-2.5">
        <div className="w-full rounded-lg shadow-md py-2 px-3 bg-white border-blue border-2 cursor-pointer" onClick={handleAddKeywordClick}>
          <p className="w-full text-center text-blue font-bold font-xl">
            ADD KEYWORD
          </p>
        </div>
        <div className="w-full rounded-lg shadow-md py-2 px-3 bg-white cursor-pointer" onClick={handleIncreaseResultsClick}>
          <p className="w-full text-center font-bold font-xl">
            Expand results
          </p>
        </div>
      </div>
    </div>
  );
}