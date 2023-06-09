import Select, { SingleValue } from 'react-select';
import { ScopusSrcType, sourceToLabelMap } from "../scopus/searchParams";

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

const years: string[] = Array.from({ length: 63 }, (_, i) => (2023 - i).toString());
const fromYearOptions = [{ value: '', label: "None" }, ...years.map(year => ({ value: year, label: year })), { value: '-1', label: "Before 1960" }];
const toYearOptions = [{ value: '', label: "None" }, ...years.map(year => ({ value: year, label: year }))];
const sources = Object.values(ScopusSrcType);
const sourceOptions = [{ value: undefined, label: 'All' }, ...sources.map(source => ({ value: source, label: sourceToLabelMap[source] }))];

export default function FilterSection({ fromYear, toYear, source, setFromYear, setToYear, setSource }: FilterSectionProps) {

  const handleFromYearChange = (option: SingleValue<OptionType>) => {
    const selectedYear = option?.value;
    if (selectedYear && toYear && selectedYear > toYear) {
      setToYear('');
    }
    setFromYear(selectedYear);
  };

  const handleToYearChange = (option: SingleValue<OptionType>) => {
    const selectedYear = option?.value;
    if (selectedYear && fromYear && selectedYear < fromYear) {
      setFromYear('');
    }
    setToYear(selectedYear);
  };

  return (
    <div className='w-full h-full flex flex-col items-center'>
      <div className='w-full flex flex-col gap-4 px-2'>
        <div className='w-full flex flex-col gap-2'>
          <h3 className='text-xl'>Publish Date</h3>
          <div className='w-full flex flex-row gap-2 items-center justify-between'>
            <Select className='flex-1'
              placeholder="From"
              options={fromYearOptions}
              styles={{ menuList: base => ({ ...base, maxHeight: 200 }) }}
              value={fromYearOptions.find(option => option.value === fromYear)}
              onChange={handleFromYearChange}
            />
            <span>~</span>
            <Select className='flex-1'
              placeholder="To"
              options={toYearOptions}
              styles={{ menuList: base => ({ ...base, maxHeight: 200 }) }}
              value={toYearOptions.find(option => option.value === toYear)}
              onChange={handleToYearChange}
            />
          </div>
        </div>
        <div className='w-full flex flex-col gap-2'>
          <h3 className='text-xl'>Source</h3>
          <div className='w-full'>
            <Select className='flex-1'
              placeholder="Source"
              options={sourceOptions}
              styles={{ menuList: base => ({ ...base, maxHeight: 200 }) }}
              value={sourceOptions.find(option => option.value === source)}
              onChange={(option) => { setSource(option?.value) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
