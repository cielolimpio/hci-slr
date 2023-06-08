export enum ScopusSrcType {
    Journal = 'j',
    Book = 'b',
    Book_Series = 'k',
    Conference_Proceeding = 'p',
    Report = 'r',
    Trade_Journal = 'd',
}

export interface RunSearchParams {
    query: string[][],
    excludeKeywords: string[],
    fromYear: string | undefined,
    toYear: string | undefined,
    source: ScopusSrcType | undefined,
}


