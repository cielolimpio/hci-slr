import {JsonProperty} from "json-typescript-mapper/index";

export interface Paper {
    title: string,
    doi: string;
    authorName: string;
    publicationYear: number;
    source: string;
}

export interface RunSearchResponse {
    resultCount: number;
    papers: Paper[];
}

export class ScopusResponse {
    @JsonProperty('search-results')
    searchResults: SearchResults | undefined;
}

class SearchResults {
    @JsonProperty('opensearch:totalResults')
    openSearchTotalResults: number | undefined;
    @JsonProperty('opensearch:Query')
    openSearchQuery: OpenSearchQuery | undefined;
    entry: Entry[] | undefined;
}

class OpenSearchQuery {
    @JsonProperty('@role')
    role: string | undefined;
    @JsonProperty('@searchTerms')
    searchTerms: string | undefined;
    @JsonProperty('@startPage')
    startPage: number | undefined;
}

class Entry {
    @JsonProperty('dc:title')
    dcTitle: string | undefined;
    @JsonProperty('prism:doi')
    prismDoi: string | undefined;
    @JsonProperty('dc:creator')
    dcCreator: string | undefined;
    @JsonProperty('prism:publicationName')
    prismPublicationName: string | undefined;
    @JsonProperty('prism:coverDate')
    prismCoverDate: Date | undefined;
}

