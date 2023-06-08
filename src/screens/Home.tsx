import dbIcon from '../icons/db.svg';
import { useState } from 'react';
import runSearch from '../scopus/run-search';
import { ScopusSrcType } from '../scopus/searchParams';
import FilterSection from '../components/FilterSection';
import ExcludeSection from '../components/ExcludeSection';
import IncludeSection from '../components/IncludeSection';

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