export interface OpenaiOrKeywordsResponse {
    list: OrKeyword[]
}
interface OrKeyword {
    id: number,
    synonyms: WordAndWhy[]
}

export interface OpenaiAndKeywordsResponse {
    list: WordAndWhy[]
}

interface WordAndWhy {
    word: string,
    why: string
}