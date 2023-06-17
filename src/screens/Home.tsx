import dbIcon from '../icons/db.svg';
import { useState } from 'react';
import { ScopusSrcType } from '../scopus/searchParams';
import FilterSection from '../components/FilterSection';
import ExcludeSection from '../components/ExcludeSection';
import IncludeSection from '../components/IncludeSection';
import { createSearchParams, useNavigate, useNavigation } from 'react-router-dom';
import loadingIcon from '../icons/loading.svg';

export const checkQueryHasEmptyString = (query: string[][]) => {
  for (let i = 0; i < query.length; i++) {
    for (let j = 0; j < query[i].length; j++) {
      if (query[i][j] === '') return true;
    }
  }
  return false;
}

export const checkExcludeKeywordsHasEmptyString = (excludeKeywords: string[]) => {
  for (let i = 0; i < excludeKeywords.length; i++) {
    if (excludeKeywords[i] === '') return true;
  }
  return false;
}

export default function Home() {

  const [query, setQuery] = useState<string[][]>([['', ''], ['']]);
  const [excludeKeywords, setExcludeKeywords] = useState<string[]>([]);
  const [fromYear, setFromYear] = useState<undefined | string>();
  const [toYear, setToYear] = useState<undefined | string>();
  const [source, setSource] = useState<undefined | ScopusSrcType>();

  const navigate = useNavigate();
  const searching = useNavigation().location;

  const handleRunSearch = async () => {
    console.log(query);
    if (checkQueryHasEmptyString(query)) return alert('Please fill all the keywords');
    if (checkExcludeKeywordsHasEmptyString(excludeKeywords)) return alert('Please fill all the exclude keywords');


    navigate({
      pathname: '/result',
      search: createSearchParams({
        data: JSON.stringify(
          {
            query,
            excludeKeywords,
            fromYear,
            toYear,
            source,
          }
        ),
      }).toString(),
    });
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {
        searching &&
        <div className="fixed inset-0 w-full h-full flex flex-row items-center justify-center bg-black bg-opacity-40 z-50 gap-2">
          <p className="text-white font-bold text-3xl">searching </p>
          <img className="w-12" src={loadingIcon} alt="loading Icon" />
        </div>
      }
      <div className='w-full px-12 py-6 flex flex-row justify-between items-center'>
        <h1 className='text-4xl text-blue font-bold'>
          New Scopus
        </h1>
        <div className='bg-blue px-4 py-2.5 rounded-xl cursor-pointer' onClick={handleRunSearch}>
          <p className='text-white font-bold text-2xl'>RUN SEARCH</p>
        </div>
      </div>
      <div className='w-full flex-1 px-8 pb-8'>
        <div className='w-full h-full bg-lightgray rounded-2xl flex flex-row gap-10 px-16 py-12'>
          <div className='w-full h-full basis-5/12 flex flex-col gap-4 items-center pt-4'>
            <div className='basis-5/12'></div>
            <img className='w-28' src={dbIcon} alt="database icon" />
            <h2 className='text-3xl'>Search Literature</h2>
            <p className='text-center px-8'>
              Add include and exclude conditions with filters
              to complete your search from the <span className='text-red-500'>Scopus</span> database
            </p>
            <div className='flex flex-col gap-1 items-center opacity-50'>

              <p className='text-xl'>(example)</p>
              <p className='text-center'>“human computer interaction” OR “HCI”
                AND “visualization” AND NOT “statistics”
              </p>
              <div className='flex flex-row scale-90 pointer-events-none select-none'>
                <div className='flex flex-col gap-2'>
                  <h3 className='text-center font-semibold text-xl'>Include</h3>
                  <IncludeSection query={[['human computer interaction', 'HCI'], ['visualization']]} setQuery={() => { }} showQueryHelperModal={false} />
                </div>
                <div className='w-16'></div>
                <div className='flex flex-col gap-2'>
                  <h3 className='text-center font-semibold text-xl'>Exclude</h3>
                  <ExcludeSection excludeKeywords={['statistics']} setExcludeKeywords={() => { }} />
                </div>
              </div>
            </div>
            <div className='basis-7/12'></div>
          </div>
          <div className='h-full border-r-2 border-darkgray'></div>
          <div className='basis-7/12 h-full flex flex-row'>
            <div className='h-full flex-1 flex flex-row gap-4'>
              <div className='h-full flex-1 flex flex-col gap-6 items-center'>
                <h3 className='text-center font-semibold text-2xl'>Include</h3>
                <div className='w-72 flex-1'>
                  <IncludeSection query={query} setQuery={setQuery} showQueryHelperModal={false} />
                </div>
              </div>
            </div>
            <div className='h-full flex-1 flex flex-col gap-8'>
              <div className='flex-1 flex flex-col gap-6 items-center'>
                <h3 className='text-center font-semibold text-2xl'>Exclude</h3>
                <div className='w-72 flex-1'>
                  <ExcludeSection excludeKeywords={excludeKeywords} setExcludeKeywords={setExcludeKeywords} />
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-6 items-center pb-20'>
                <h3 className='text-center font-semibold text-2xl'>Filter</h3>
                <div className='w-72 flex-1 flex flex-col gap-4 items-center'>
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
    </div>
  );
}