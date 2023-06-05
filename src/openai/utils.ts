import {OpenaiSynonymsRequest} from "./types";

export const queryToSynonymsString = (query: string[][]): string => {
    return query.map((list, index) => {
        const keywordsWithDoubleQuote = list.map(keyword => `\"${keyword}\"`);
        return `{\"id\": ${index}, \"group\": [${keywordsWithDoubleQuote.toString()}]}`;
    }).toString();
}