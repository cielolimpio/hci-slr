import { useEffect, useState } from "react";
import { OpenaiOrKeywordsResponse } from "../openai/types";
import { RunSearchParams } from "../scopus/searchParams";
import { createSearchParams, useNavigate, useRouteError } from "react-router-dom";
import sparkleIcon from '../icons/sparkle.svg';
import Select from 'react-select';

interface OrQueryHelperProps {
  runSearchParams: RunSearchParams;
  openaiOrKeywordsResponse: OpenaiOrKeywordsResponse;
  handleDecreaseResultsClick: () => void;
  setShowOrQueryHelper: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OrQueryHelper({ runSearchParams, openaiOrKeywordsResponse, handleDecreaseResultsClick, setShowOrQueryHelper }: OrQueryHelperProps) {


  const query = runSearchParams.query;
  const subQueryGroups: string[] = query.map((subQuery, i) => {
    return `Group ${i + 1}: ${subQuery.join(' OR ')}`;
  });

  const subQueryGroupOptions = subQueryGroups.map((subQueryGroup, i) => {
    return { value: i, label: subQueryGroup };
  });

  const [selectedSubQueryGroupIndex, setSelectedSubQueryGroupIndex] = useState<number>(0);

  const [selectedOption, setSelectedOption] = useState(openaiOrKeywordsResponse.list[0].synonyms[0].word);

  useEffect(() => {
    setSelectedOption(openaiOrKeywordsResponse.list[selectedSubQueryGroupIndex].synonyms[0].word);
  }, [selectedSubQueryGroupIndex]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const navigate = useNavigate();

  const handleAddKeywordClick = () => {
    const newQuery = [...query];
    newQuery[selectedSubQueryGroupIndex] = [...newQuery[selectedSubQueryGroupIndex], selectedOption];
    const newRunSearchParams = {
      ...runSearchParams,
    };
    newRunSearchParams.query = newQuery;
    setShowOrQueryHelper(false);
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
      <div className="w-full flex flex-col gap-0.5">
        <p className="text-md text-darkgray">Add keyword to OR Group</p>
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
        <div className="w-full rounded-lg shadow-md py-2 px-3 bg-white border-blue border-2 cursor-pointer" onClick={handleAddKeywordClick}>
          <p className="w-full text-center text-blue font-bold font-xl">
            ADD KEYWORD
          </p>
        </div>
        <div className="w-full rounded-lg shadow-md py-2 px-3 bg-white cursor-pointer" onClick={handleDecreaseResultsClick}>
          <p className="w-full text-center font-bold font-xl">
            Decrease results
          </p>

        </div>
      </div>


    </div>
  );
}