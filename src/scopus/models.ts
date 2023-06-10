import {JsonProperty, ObjectMapper} from "json-object-mapper";

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

export interface RunSearchResponse {
    resultCount: number;
    papers: Paper[];
}

class OpenSearchQuery {
    @JsonProperty({name: '@role'})
    role: string | undefined;
    @JsonProperty({name: '@searchTerms'})
    searchTerms: string | undefined;
    @JsonProperty({name: '@startPage'})
    startPage: number | undefined;
}

class Entry {
    @JsonProperty({name: 'dc:title'})
    dcTitle: string | undefined;
    @JsonProperty({name: 'prism:doi'})
    prismDoi: string | undefined;
    @JsonProperty({name: 'dc:creator'})
    dcCreator: string | undefined;
    @JsonProperty({name: 'prism:publicationName'})
    prismPublicationName: string | undefined;
    @JsonProperty({type: Date, name: 'prism:coverDate'})
    prismCoverDate: Date | undefined;
}

class SearchResults {
    @JsonProperty({name: 'entry'})
    entry: Entry[] | undefined;
    @JsonProperty({name: 'opensearch:totalResults'})
    openSearchTotalResults: number | undefined;
    @JsonProperty({type: OpenSearchQuery, name: 'opensearch:Query'})
    openSearchQuery: OpenSearchQuery | undefined;
}

export class ScopusResponse {
    @JsonProperty({type: SearchResults, name: 'search-results'})
    searchResults: SearchResults | undefined;

    static deserialize = (data: any): ScopusResponse => {
        let result = ObjectMapper.deserialize(ScopusResponse, data);
        if (result.searchResults?.entry) {
            result.searchResults.entry = result.searchResults.entry.map(entry =>
                ObjectMapper.deserialize(Entry, entry)
            );
        }
        return result;
    }
}