import { useEffect, useRef, useState } from "react";
import addIcon from '../icons/add.svg';
import deleteIcon from '../icons/delete.svg';

interface IncludeSectoinProps {
  query: string[][];
  setQuery: React.Dispatch<React.SetStateAction<string[][]>>;
}

export default function IncludeSection({ query, setQuery }: IncludeSectoinProps) {

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