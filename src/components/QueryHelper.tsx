import sparkleIcon from '../icons/sparkle.svg';

interface QueryHelperProps {
  setShowQueryHelper: React.Dispatch<React.SetStateAction<boolean>>;
  setShowOrQueryHelper: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAndQueryHelper: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function QueryHelper({ setShowQueryHelper, setShowOrQueryHelper, setShowAndQueryHelper }: QueryHelperProps) {

  const handleIncreaseResultsClick = () => {
    setShowOrQueryHelper(true);
    setShowQueryHelper(false);
  }

  const handleDecreaseResultsClick = () => {
    setShowAndQueryHelper(true);
    setShowQueryHelper(false);
  }

  return (
    <div className="w-full h-full bg-blurwhite bg-opacity-50 backdrop-blur-md rounded-2xl shadow-lg flex flex-col items-center pt-4 pb-6 px-4 gap-5" >
      <div className="flex flex-row gap-2.5">
        <img src={sparkleIcon} alt="sparkle Icon" />
        <h3 className="font-bold text-xl text-blue">Query Helper</h3>
        <img src={sparkleIcon} alt="sparkle Icon" />
      </div>
      <div className="w-full flex flex-col gap-2.5">
        <div className="w-full rounded-lg shadow-md py-2 px-3 bg-white cursor-pointer" onClick={handleIncreaseResultsClick}>
          <p className="w-full text-center font-bold font-xl">
            Increase results
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