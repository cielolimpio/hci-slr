import { createSearchParams, useLoaderData, useNavigate, useRouteError } from "react-router-dom";
import { Paper, RunSearchResponse } from "../scopus/models";
import IncludeSection from '../components/IncludeSection';
import { RunSearchParams, ScopusSrcType } from "../scopus/searchParams";
import { useEffect, useRef, useState } from "react";
import ExcludeSection from "../components/ExcludeSection";
import FilterSection from "../components/FilterSection";
import { OpenaiAndKeywordsResponse, OpenaiOrKeywordsResponse } from '../openai/types';
import runSearch, { MAX_COUNT } from "../scopus/run-search";
import OrQueryHelper from "../components/OrQueryHelper";
import AndQueryHelper from "../components/AndQueryHelper";

import exportIcon from '../icons/export.svg';
import loadingIcon from '../icons/loading.svg';
import PaperTable from "../components/PaperTable";
import scrollTopIcon from '../icons/scrolltop.svg';
import drawerRightIcon from '../icons/drawerright.svg';
import drawerLeftIcon from '../icons/drawerleft.svg';
import { checkExcludeKeywordsHasEmptyString, checkQueryHasEmptyString } from "./Home";
import QueryHelper from "../components/QueryHelper";

import Papa from "papaparse";
import { saveAs } from 'file-saver';
import { run } from "node:test";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const runSearchParams = JSON.parse(url.searchParams.get("data") as string) as RunSearchParams;
  const data = await runSearch(runSearchParams);
  return { runSearchResponse: data, runSearchParams: runSearchParams };
}

export default function Result() {
  const loaderData = useLoaderData() as { runSearchResponse: RunSearchResponse, runSearchParams: RunSearchParams };
  const runSearchResponse = loaderData.runSearchResponse as RunSearchResponse;
  const runSearchParams = loaderData.runSearchParams as RunSearchParams;
  const navigate = useNavigate();

  const [query, setQuery] = useState<string[][]>([]);

  useEffect(() => {
    const newQuery = runSearchParams.query.filter((orQuery) => orQuery.length !== 0);
    setQuery([...newQuery.map((orQuery) => [...orQuery])]);
    setPapers(runSearchResponse.papers);
  }, [loaderData]);

  const [excludeKeywords, setExcludeKeywords] = useState<string[]>(runSearchParams.excludeKeywords);
  const [fromYear, setFromYear] = useState<undefined | string>(runSearchParams.fromYear);
  const [toYear, setToYear] = useState<undefined | string>(runSearchParams.toYear);
  const [source, setSource] = useState<undefined | ScopusSrcType>(runSearchParams.source);
  const [papers, setPapers] = useState<Paper[]>(runSearchResponse.papers);
  const keywordQuery = runSearchParams.query.map(innerArray => `(${innerArray.join(' OR ')})`).join(' AND ');
  const excludeQuery = excludeKeywords.map(keyword => ` AND NOT ${keyword}`);

  const [showQueryHelperModal, setShowQueryHelperModal] = useState<boolean>(true);
  const [showOrQueryHelper, setShowOrQueryHelper] = useState<boolean>(false);
  const [showAndQueryHelper, setShowAndQueryHelper] = useState<boolean>(false);
  const [showQueryHelper, setShowQueryHelper] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const observeTarget = useRef<HTMLDivElement>(null);

  const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setCurrentPage(prev => prev + 1);
    }
  }

  const loadMore = async (count = 25) => {
    if ((papers.length < runSearchResponse.resultCount) && !isLoading) {
      setIsLoading(true);
      const newData = await runSearch({ ...runSearchParams, start: papers.length, count: count });
      if (newData == null) {
        alert('Something went wrong');
      } else {
        setPapers(prev => [...prev, ...newData.papers]);
      }
      setIsLoading(false);
    }
  }

  const observer = new IntersectionObserver(intersectionCallback);

  useEffect(() => {
    observer.observe(observeTarget.current as HTMLDivElement);
    return () => {
      if (observeTarget.current)
        observer.unobserve(observeTarget.current as HTMLDivElement);
    }
  }, []);

  useEffect(() => {
    loadMore();
  }, [currentPage]);

  const showAnyQueryHelper = showAndQueryHelper || showOrQueryHelper || showQueryHelper;

  const handleDrawerIconClick = () => {
    if (showAnyQueryHelper) {
      setShowAndQueryHelper(false);
      setShowOrQueryHelper(false);
      setShowQueryHelper(false);
    } else {
      setShowQueryHelper(true);
      setShowQueryHelperModal(false);
    }
  }

  const handleRunSearchClick = () => {
    if (checkQueryHasEmptyString(query)) return alert('Please fill all the keywords');
    if (checkExcludeKeywordsHasEmptyString(excludeKeywords)) return alert('Please fill all the exclude keywords');
    navigate({
      pathname: '/result',
      search: createSearchParams({
        data: JSON.stringify({
          query: query,
          excludeKeywords: excludeKeywords,
          fromYear: fromYear,
          toYear: toYear,
          source: source,
        }),
      }).toString(),
    });
  }
  const handleLogoClick = () => {
    navigate('/');
  }

  const handleQueryHelperClick = ({ wantIncrease }: { wantIncrease: boolean }) => {
    if (wantIncrease) {
      setShowOrQueryHelper(true);
      setShowAndQueryHelper(false);
      setShowQueryHelper(false);
    } else {
      setShowAndQueryHelper(true);
      setShowOrQueryHelper(false);
      setShowQueryHelper(false);
    }
  }

  const handleDecreaseResultsClick = () => {
    setShowAndQueryHelper(true);
    setShowOrQueryHelper(false);
  }

  const handleIncreaseResultsClick = () => {
    setShowOrQueryHelper(true);
    setShowAndQueryHelper(false);
  }

  const handleExportButtonClick = async () => {
    setIsExportLoading(true);
    const newPapers = await fetchAllPapers();
    await exportCsv(newPapers);
    setIsExportLoading(false);
  };

  const fetchAllPapers = async () => {
    let newPapers = papers;
    if (papers.length < runSearchResponse.resultCount) {
      const countToRepeatFetching = Math.ceil((runSearchResponse.resultCount - papers.length) / MAX_COUNT);
      for (const _ of Array(countToRepeatFetching)) {
        if (!isLoading) {
          setIsLoading(true);
          const newData = await runSearch({ ...runSearchParams, start: newPapers.length, count: MAX_COUNT });
          if (newData == null) {
            alert('Something went wrong');
          } else {
            setPapers(prev => [...prev, ...newData.papers]);
            newPapers = [...newPapers, ...newData.papers];
          }
          setIsLoading(false);
        }
      }
    }

    return newPapers;
  };

  const exportCsv = async (papers: Paper[]) => {
    const csv = Papa.unparse(papers.map((paper, index) => {
      return {
        Index: index + 1,
        Doi: paper.doi,
        Title: paper.title,
        Author: paper.authorName,
        Year: paper.publicationYear,
        Source: paper.source,
      }
    }));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'papers.csv');
  };

  const mainScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollToTop = () => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="w-full h-full flex flex-row bg-lightgray">
      <div className="w-80 h-full bg-white relative z-10">
        <div className="h-full flex flex-col pt-6 pb-24 px-4 gap-6 overflow-y-scroll">
          <h1 className="text-4xl font-bold text-blue cursor-pointer" onClick={handleLogoClick}>New Scopus</h1>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-2xl font-semibold">Include</h2>
              <img className="w-5 h-5 cursor-pointer"
                src={showAnyQueryHelper ? drawerLeftIcon : drawerRightIcon}
                alt={showAndQueryHelper ? 'drawer left icon' : 'drawer right icon'} onClick={handleDrawerIconClick}
              />
            </div>
            <div className="w-full">
              <IncludeSection query={query} setQuery={setQuery} handleQueryHelperClick={handleQueryHelperClick}
                showQueryHelperModal={showQueryHelperModal} setShowQueryHelperModal={setShowQueryHelperModal}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold">Exclude</h2>
            <ExcludeSection excludeKeywords={excludeKeywords} setExcludeKeywords={setExcludeKeywords} />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold">Filter</h2>
            <FilterSection fromYear={fromYear} toYear={toYear} source={source} setFromYear={setFromYear} setToYear={setToYear} setSource={setSource} />
          </div>
        </div>
        <div className="absolute left-0 right-0 bottom-0 pl-4 pr-8 py-4">
          <div className="w-full h-full rounded-xl py-2.5 bg-blue cursor-pointer" onClick={handleRunSearchClick}>
            <p className="text-2xl font-semibold text-white text-center">RUN SEARCH</p>
          </div>
        </div>
      </div>
      <div className="flex-1 relative px-4 pt-4 pb-12 overflow-y-scroll" ref={mainScrollRef}>
        <div className="w-full bg-white rounded-2xl flex flex-col">
          <div className="w-full flex flex-row justify-between">
            <div className="w-7/12 flex flex-col p-6">
              <h1 className="text-4xl font-bold ">Total: {runSearchResponse.resultCount} results</h1>
              <p className="text-xl font-light">{keywordQuery}{excludeQuery}</p>
            </div>
            <div className="flex flex-row p-6 items-start gap-5">
              {
                isExportLoading
                  ?
                  <div className="rounded-lg bg-blue px-2.5 py-2.5 flex flex-row gap-2.5 cursor-not-allowed">
                    <img src={loadingIcon} alt="loading Icon" />
                    <p className="text-white ">Export</p>
                  </div>
                  :
                  <div className="rounded-lg bg-blue px-2.5 py-2.5 flex flex-row gap-2.5 cursor-pointer" onClick={handleExportButtonClick}>
                    <img src={exportIcon} alt="export Icon" />
                    <p className="text-white ">Export</p>
                  </div>
              }
            </div>
          </div>
          <div className="px-4 pb-2 flex flex-col">
            <div className="w-full h-[1px] bg-gray"></div>
            <PaperTable papers={papers} />
            <div className="w-full" ref={observeTarget}>
              {
                isLoading &&
                <div className="w-full py-4">
                  <p className="text-center text-xl">Loading...</p>
                </div>
              }
            </div>
          </div>
        </div>
        <div className={`fixed left-[338px] top-20 w-80 transition-transform duration-500 ${showOrQueryHelper ? 'translate-x-0' : '-translate-x-96'}`}>
          <OrQueryHelper
            runSearchParams={runSearchParams} showOrQueryHelper={showOrQueryHelper}
            resultCount={runSearchResponse.resultCount}
            handleDecreaseResultsClick={handleDecreaseResultsClick} setShowOrQueryHelper={setShowOrQueryHelper}
          />
        </div>
        <div className={`fixed left-[338px] top-20 w-80 transition-transform duration-500 ${showAndQueryHelper ? 'translate-x-0' : '-translate-x-96'}`}>
          <AndQueryHelper
            runSearchParams={runSearchParams} showAndQueryHelper={showAndQueryHelper}
            resultCount={runSearchResponse.resultCount}
            handleIncreaseResultsClick={handleIncreaseResultsClick} setShowAndQueryHelper={setShowAndQueryHelper}
          />
        </div>
        <div className={`fixed left-[338px] top-20 w-80 transition-transform duration-500 ${showQueryHelper ? 'translate-x-0' : '-translate-x-96'}`}>
          <QueryHelper
            setShowQueryHelper={setShowQueryHelper}
            setShowAndQueryHelper={setShowAndQueryHelper}
            setShowOrQueryHelper={setShowOrQueryHelper}
          />
        </div>
        <div className="fixed right-4 bottom-4 rounded-full bg-lightergray border-2 border-lightgray shadow-2xl cursor-pointer" onClick={handleScrollToTop}>
          <img className="w-12 h-12" src={scrollTopIcon} alt="scroll top" />
        </div>
      </div>
    </div>
  );
}

export function ResultErrorElement() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="text-5xl">
      ERROR
    </div>
  );
}

const mockOpenaiOrKeywordsResponse: OpenaiOrKeywordsResponse = {
  list: [
    {
      id: 0,
      synonyms: [
        {
          word: "Kiwi",
          why: "This modification expands the scope to include literature that discusses the mass and black holes in the context of accretion disks, which are commonly associated with black hole physics.",
        },
        {
          word: "Pineapple",
          why: "This keyword relates to tropical fruits and their properties, expanding the search to include such topics.",
        },
        {
          word: "Strawberry",
          why: "By including this keyword, the search would consider literature relating to berries and their characteristics.",
        },
      ],
    },
    {
      id: 1,
      synonyms: [
        {
          word: "asdf",
          why: "This modification expands the scope to include literature that discusses the mass and black holes in the context of accretion disks, which are commonly associated with black hole physics.",
        },
        {
          word: "aasdfasdfsdf",
          why: "By including this keyword, the search would consider literature relating to berries and their characteristics.",
        },
      ],
    },
  ],
};

const mockOpenaiAndKeywordsResponse: OpenaiAndKeywordsResponse = {
  list: [
    {
      word: "Apple",
      why: "Including this keyword will allow the search to consider literature relating to apples and their characteristics.",
    },
    {
      word: "Banana",
      why: "This keyword relates to tropical fruits and their properties, expanding the search to include such topics.",
    },
    {
      word: "Cherry",
      why: "By including this keyword, the search would consider literature relating to cherries and their characteristics.",
    },
  ],
};

