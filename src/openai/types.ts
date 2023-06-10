export interface OpenaiOrKeywordsResponse {
    list: OrKeyword[]
}
export interface OrKeyword {
    id: number,
    synonyms: WordAndWhy[]
}

export interface OpenaiAndKeywordsResponse {
    list: WordAndWhy[]
}

export interface WordAndWhy {
    word: string,
    why: string
    count?: number
}