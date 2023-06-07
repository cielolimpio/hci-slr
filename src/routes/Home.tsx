import dbIcon from '../icons/db.svg';
import addIcon from '../icons/add.svg';
import deleteIcon from '../icons/delete.svg';
import { useRef, useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { ValueType } from 'tailwindcss/types/config';
import runSearch from '../scopus/run-search';
import { ScopusSrcType } from '../scopus/searchParams';

const years: string[] = Array.from({ length: 64 }, (_, i) => i === 63 ? "Before 1960" : (2023 - i).toString());
const yearOptions = years.map(year => ({ value: year, label: year }));

const sources = Object.values(ScopusSrcType);
const sourceOptions = sources.map(source => ({ value: source, label: source }));

export default function Home() {

  const [query, setQuery] = useState<string[][]>([['keyword1', 'keyword2'], ['keyword3']]);
  const [excludeKeywords, setExcludeKeywords] = useState<string[]>([]);
  const [fromYear, setFromYear] = useState<undefined | string>();
  const [toYear, setToYear] = useState<undefined | string>();
  const [source, setSource] = useState<undefined | ScopusSrcType>();

  const handleRunSearch = () => {
    runSearch({ query, excludeKeywords, fromYear, toYear, source });
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className='w-full px-8 py-6'>
        <h1 className='text-4xl text-indigo-600 font-bold'>
          New Scopus
        </h1>
      </div>
      <div className='w-full flex-1 px-8 pb-8'>
        <div className='w-full h-full bg-lightgray rounded-2xl flex flex-row gap-10 px-16 py-12'>
          <div className='w-full h-full flex-1 flex flex-col gap-4 items-center pt-4'>
            <div className='basis-1/3'></div>
            <img className='w-28' src={dbIcon} alt="database icon" />
            <h2 className='text-3xl'>Search Literature</h2>
            <p className='text-center px-8'>
              Add include and exclude conditions with filters
              to complete your search from the <span className='text-red-500'>Scopus</span> database
            </p>
            <div className='h-4'></div>
            <div className='bg-blue px-4 py-2.5 rounded-xl cursor-pointer' onClick={handleRunSearch}>
              <p className='text-white font-bold text-2xl'>RUN SEARCH</p>
            </div>
            <div className='basis-2/3'></div>
          </div>
          <div className='h-full border-r-2 border-darkgray'></div>
          <div className='h-full flex-1 flex flex-row gap-4'>
            <div className='h-full flex-1 flex flex-col gap-6 items-center'>
              <h3 className='text-center font-semibold text-2xl'>Include</h3>
              <div className='w-full flex-1'>
                <IncludeSection query={query} setQuery={setQuery} />
              </div>
            </div>
          </div>
          <div className='h-full flex-1 flex flex-col gap-8'>
            <div className='flex-1 flex flex-col gap-6 items-center'>
              <h3 className='text-center font-semibold text-2xl'>Exclude</h3>
              <div className='w-full flex-1'>
                <ExcludeSection excludeKeywords={excludeKeywords} setExcludeKeywords={setExcludeKeywords} />
              </div>
            </div>
            <div className='flex-1 flex flex-col gap-6 items-center pb-20'>
              <h3 className='text-center font-semibold text-2xl'>Filter</h3>
              <div className='w-full flex-1 flex flex-col gap-4 items-center'>
                <FilterSection
                  fromYear={fromYear} toYear={toYear} source={source}
                  setFromYear={setFromYear} setToYear={setToYear} setSource={setSource}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface IncludeSectoinProps {
  query: string[][];
  setQuery: React.Dispatch<React.SetStateAction<string[][]>>;
}

function IncludeSection({ query, setQuery }: IncludeSectoinProps) {

  const [isAddedCurrently, setIsAddedCurrently] = useState<boolean>(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, andIndex: number, orIndex: number) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (e.shiftKey) {
        handleAddAndButtonClick();
      } else {
        handleAddOrButtonClick(andIndex);
      }
    }
  }

  const handleAddOrButtonClick = (andIndex: number) => {
    const newQuery = [...query];
    newQuery[andIndex].push('');
    setQuery(newQuery);
    setIsAddedCurrently(true);
  }

  const handleAddAndButtonClick = () => {
    const newQuery = [...query];
    newQuery.push(['']);
    setQuery(newQuery);
    setIsAddedCurrently(true);
  }

  const handleItemEdit = (e: React.ChangeEvent<HTMLInputElement>, andIndex: number, orIndex: number) => {
    const newQuery = [...query];
    newQuery[andIndex][orIndex] = e.target.value;
    setQuery(newQuery);
  }

  const handleDeleteButtonClick = (andIndex: number, orIndex: number) => {
    console.log(query);
    if (query.length === 1 && query[0].length === 1) {
      setQuery([['']]);
    } else {
      const newQuery = [...query];
      newQuery[andIndex].splice(orIndex, 1);
      if (newQuery[andIndex].length === 0) {
        newQuery.splice(andIndex, 1);
      }
      setQuery(newQuery);
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && isAddedCurrently) {
      inputRef.current.focus();
    }
    return () => {
      setIsAddedCurrently(false);
    }
  }, [isAddedCurrently]);

  return (
    <div className='w-full h-full flex flex-col items-center'>
      <div className='w-72 flex flex-col items-center p-2 rounded-2xl bg-white shadow-md'>
        {query.map((group, i) => (
          <div className='w-full flex flex-col items-center' key={i}>
            <div className='w-full p-2 rounded-xl bg-lightgray shadow-inner flex flex-col items-center' key={i}>
              {group.map((item, j) => (
                <div className='w-full flex flex-col items-center' key={j}>
                  <div key={j} className='w-full px-2 py-1.5 rounded-md shadow-md flex flex-row justify-between bg-white'>
                    <input
                      className='w-full text-black outline-none'
                      type='text' value={item} onChange={(e) => { handleItemEdit(e, i, j) }}
                      onKeyDown={(e) => handleKeyDown(e, i, j)}
                      ref={inputRef}
                    />
                    <img
                      className='w-4 cursor-pointer'
                      src={deleteIcon} alt="add icon" onClick={() => { handleDeleteButtonClick(i, j) }}
                    />
                  </div>
                  {j < group.length - 1 && (
                    <>
                      <div className='w-[1px] h-1.5 bg-darkgray'></div>
                      <div className='px-1.5 py-0.5 bg-blue rounded-md'>
                        <p className='text-white font-bold text-lg leading-5'>OR</p>
                      </div>
                      <div className='w-[1px] h-1.5 bg-darkgray'></div>
                    </>
                  )}
                </div>
              ))}
              <div className='h-2'></div>
              <div className='w-full flex flex-row justify-end'>
                <div
                  className='rounded-md outline-dashed outline-1 outline-gray flex flex-row gap-2 px-1 py-0.5 cursor-pointer'
                  onClick={() => { handleAddOrButtonClick(i) }}
                >
                  <img src={addIcon} alt="add icon" />
                  <p className='text-darkgray font-bold text-md leading-4'>OR</p>
                </div>
              </div>
            </div>
            {i < query.length - 1 && (
              <>
                <div className='w-[1px] h-2 bg-darkgray'></div>
                <div className='px-1.5 py-0.5 bg-blue rounded-md'>
                  <p className='text-white font-bold text-lg leading-5'>AND</p>
                </div>
                <div className='w-[1px] h-2 bg-darkgray'></div>
              </>
            )}
          </div>

        ))}
        <div className='w-[1px] h-3 bg-darkgray'></div>
        <div
          className='rounded-md outline-dashed outline-1 outline-gray flex flex-row gap-2 px-1 py-0.5 cursor-pointer'
          onClick={handleAddAndButtonClick}
        >
          <img src={addIcon} alt="add icon" />
          <p className='text-darkgray font-bold text-md leading-4'>AND</p>
        </div>
        <div className='h-1'></div>
      </div>
    </div>
  );
}

interface ExcludeSectionProps {
  excludeKeywords: string[];
  setExcludeKeywords: React.Dispatch<React.SetStateAction<string[]>>;
}

function ExcludeSection({ excludeKeywords, setExcludeKeywords }: ExcludeSectionProps) {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      setExcludeKeywords([...excludeKeywords, e.currentTarget.value]);
      e.currentTarget.value = '';
    }
  }

  const addInputRef = useRef<HTMLInputElement>(null);

  const handleAddButtonClick = () => {
    setExcludeKeywords([...excludeKeywords, addInputRef.current!.value]);
    addInputRef.current!.value = '';
    addInputRef.current?.focus();
  }

  const handleDeleteButtonClick = (index: number) => {
    const newExcludeKeywords = [...excludeKeywords];
    newExcludeKeywords.splice(index, 1);
    setExcludeKeywords(newExcludeKeywords);
  }

  const hanldeUpdateKeyword = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newExcludeKeywords = [...excludeKeywords];
    newExcludeKeywords[index] = e.target.value;
    setExcludeKeywords(newExcludeKeywords);
  }

  return (
    <div className='w-full h-full flex flex-col items-center'>
      <div className='w-64 h-full flex flex-col items-center gap-4'>
        <div className='w-full rounded-md border-dashed border-[1px] border-darkgray px-2 gap-4 py-1.5 flex flex-row justify-between'>
          <input
            className='w-full text-black placeholder:text-darkgray outline-none bg-lightgray'
            type="text" placeholder='add keyword' onKeyDown={handleKeyDown}
            ref={addInputRef}
          />
          <img
            className='w-4 fill-black caret-black cursor-pointer'
            src={addIcon} alt="add icon" onClick={handleAddButtonClick}
          />
        </div>
        {
          excludeKeywords.map((keyword, index) => (
            <div key={index} className='w-full px-2 py-1.5 rounded-md shadow-md flex flex-row justify-between bg-white'>
              <input className='w-full text-black outline-none' type='text' value={keyword} onChange={(e) => { hanldeUpdateKeyword(e, index) }} />
              <img
                className='w-4 cursor-pointer'
                src={deleteIcon} alt="add icon" onClick={() => { handleDeleteButtonClick(index) }} />
            </div>
          ))
        }
      </div>
    </div>
  );
}

interface FilterSectionProps {
  fromYear: undefined | string;
  toYear: undefined | string;
  source: undefined | ScopusSrcType;
  setFromYear: React.Dispatch<React.SetStateAction<undefined | string>>;
  setToYear: React.Dispatch<React.SetStateAction<undefined | string>>;
  setSource: React.Dispatch<React.SetStateAction<undefined | ScopusSrcType>>;
}

interface OptionType {
  value: string;
  label: string;
}

function FilterSection({ fromYear, toYear, source, setFromYear, setToYear, setSource }: FilterSectionProps) {

  const handleFromYearChange = (option: SingleValue<OptionType>) => {
    const selectedYear = option?.value;
    if (selectedYear && toYear && selectedYear > toYear) {
      setToYear('2023');
    }
    setFromYear(selectedYear);
  };

  const handleToYearChange = (option: SingleValue<OptionType>) => {
    const selectedYear = option?.value;
    if (selectedYear && fromYear && selectedYear < fromYear) {
      setFromYear('Before 1960');
    }
    setToYear(selectedYear);
  };

  return (
    <div className='w-full h-full flex flex-col items-center'>
      <div className='w-72 flex flex-col gap-4'>
        <div className='w-full flex flex-col gap-2'>
          <h3 className='ml-2'>Publish Date</h3>
          <div className='w-full flex flex-row gap-2 pl-6 items-center justify-between'>
            <Select className='flex-1'
              placeholder="From"
              options={yearOptions}
              styles={{ menuList: base => ({ ...base, maxHeight: 200 }) }}
              value={yearOptions.find(option => option.value === fromYear)}
              onChange={handleFromYearChange}
            />
            <span>~</span>
            <Select className='flex-1'
              placeholder="To"
              options={yearOptions}
              styles={{ menuList: base => ({ ...base, maxHeight: 200 }) }}
              value={yearOptions.find(option => option.value === toYear)}
              onChange={handleToYearChange}
            />
          </div>
        </div>
        <div className='w-full flex flex-col gap-2'>
          <h3 className='ml-2'>Source</h3>
          <div className='w-full pl-6'>
            <Select className='flex-1'
              placeholder="Source"
              options={sourceOptions}
              styles={{ menuList: base => ({ ...base, maxHeight: 200 }) }}
              value={sourceOptions.find(option => option.value === source)}
              onChange={(option) => setSource(option?.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
