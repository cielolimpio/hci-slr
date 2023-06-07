export interface Paper {
    title: string,
    doi: string;
    authorName: string;
    publicationYear: string;
    source: string;
}

export interface ScopusResponse {
    searchResults: {
        documents: {
            'dc:title': string;
            'prism:doi': string;
            'prism:coverDate': string;
            'dc:creator': string;
            'prism:publicationName': string;
        }[];
    };
}