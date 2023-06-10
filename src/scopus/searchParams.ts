export enum ScopusSrcType {
    Journal = 'j',
    Book = 'b',
    Book_Series = 'k',
    Conference_Proceeding = 'p',
    Report = 'r',
    Trade_Journal = 'd',
}

export const sourceToLabelMap = {
    [ScopusSrcType.Journal]: 'journal',
    [ScopusSrcType.Book]: 'book',
    [ScopusSrcType.Book_Series]: 'book series',
    [ScopusSrcType.Conference_Proceeding]: 'conference proceeding',
    [ScopusSrcType.Report]: 'report',
    [ScopusSrcType.Trade_Journal]: 'trade journal',
}

export interface RunSearchParams {
    query: string[][],
    excludeKeywords: string[],
    fromYear: string | undefined,
    toYear: string | undefined,
    source: ScopusSrcType | undefined,
    start?: number,
    count?: number,
}


