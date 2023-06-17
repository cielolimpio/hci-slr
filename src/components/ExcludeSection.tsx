import addIcon from '../icons/add.svg';
import deleteIcon from '../icons/delete.svg';

import { useRef } from "react";

export interface ExcludeSectionProps {
  excludeKeywords: string[];
  setExcludeKeywords: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ExcludeSection({ excludeKeywords, setExcludeKeywords }: ExcludeSectionProps) {
  const handleAddButtonClick = () => {
    setExcludeKeywords([...excludeKeywords, '']);
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
      <div className='w-full h-full flex flex-col items-center gap-4'>
        <div className='w-full rounded-md border-dashed border-[1px] border-darkgray px-2 gap-4 py-1.5 flex flex-row justify-between cursor-pointer' onClick={handleAddButtonClick}>
          <p className='w-full text-darkgray whitespace-nowrap text-ellipsis overflow-hidden'>
            add keyword to click
          </p>
          <img
            className='w-4 fill-black caret-black'
            src={addIcon} alt="add icon"
          />
        </div>
        {
          excludeKeywords.map((keyword, index) => (
            <div key={index} className='w-full px-2 py-1.5 rounded-md shadow-md flex flex-row justify-between bg-white'>
              <input
                className='w-full text-black outline-none'
                type='text'
                placeholder="keyword"
                value={keyword}
                onChange={(e) => { hanldeUpdateKeyword(e, index) }}
              />
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

