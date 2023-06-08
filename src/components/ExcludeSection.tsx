import addIcon from '../icons/add.svg';
import deleteIcon from '../icons/delete.svg';

import { useRef } from "react";

export interface ExcludeSectionProps {
  excludeKeywords: string[];
  setExcludeKeywords: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ExcludeSection({ excludeKeywords, setExcludeKeywords }: ExcludeSectionProps) {

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

