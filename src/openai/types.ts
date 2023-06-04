export interface OpenaiSynonymsRequest {
    query: string[][]
}

export interface OpenaiSynonymsResponse {
    list: Synonym[]
}

interface Synonym {
    id: number,
    synonyms: string[]
}