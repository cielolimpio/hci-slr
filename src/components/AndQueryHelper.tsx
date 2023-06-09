import { useState } from "react";
import { OpenaiAndKeywordsResponse } from "../openai/types";
import { RunSearchParams } from "../scopus/searchParams";
import { createSearchParams, useNavigate, useRouteError } from "react-router-dom";
import sparkleIcon from '../icons/sparkle.svg';
import Select from 'react-select';
import { isForInStatement } from "typescript";

interface AndQueryHelperProps {
  runSearchParams: RunSearchParams;
  openaiAndKeywordsResponse: OpenaiAndKeywordsResponse;
  handleIncreaseResultsClick: () => void;
  setShowAndQueryHelper: React.Dispatch<React.SetStateAction<boolean>> ;
}

export default function AndQueryHelper({ runSearchParams, openaiAndKeywordsResponse, handleIncreaseResultsClick, setShowAndQueryHelper }: AndQueryHelperProps) {

  const query = runSearchParams.query;

  const [selectedOption, setSelectedOption] = useState(openaiAndKeywordsResponse.list[0].word);

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
        <div className="w-full rounded-lg bg-white shadow-md py-2.5 px-2.5 flex flex-col">
          {openaiAndKeywordsResponse.list.map((synonym, i) => (
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
      </div>

      <div className="w-full flex flex-col gap-2.5">
        <div className="w-full rounded-lg shadow-md py-2 px-3 bg-white border-blue border-2 cursor-pointer" onClick={handleAddKeywordClick}>
          <p className="w-full text-center text-blue font-bold font-xl">
            ADD KEYWORD
          </p>
        </div>
        <div className="w-full rounded-lg shadow-md py-2 px-3 bg-white cursor-pointer" onClick={handleIncreaseResultsClick}>
          <p className="w-full text-center font-bold font-xl">
            Increase results
          </p>

        </div>
      </div>


    </div>
  );
}