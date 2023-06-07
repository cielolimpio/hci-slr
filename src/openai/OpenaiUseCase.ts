import OpenaiRepository from "./openaiRepository";
import {OpenaiAndKeywordsResponse, OpenaiOrKeywordsResponse} from "./types";

const MAXIMUM_ITER_COUNT = 3;

const queryToString = (query: string[][]): string => {
    return query.map((list, index) => {
        const keywordsWithDoubleQuote = list.map(keyword => `\"${keyword}\"`);
        return `{\"id\": ${index}, \"group\": [${keywordsWithDoubleQuote.toString()}]}`;
    }).toString();
}

const OpenaiUseCase = {
    getOrKeywords: async (query: string[][]): Promise<OpenaiOrKeywordsResponse | null> => {
        const queryString = queryToString(query);

        let iterCount = 0;
        while (iterCount < MAXIMUM_ITER_COUNT) {
            try {
                const data = await OpenaiRepository.getOrKeywords(queryString);
                if (data.data.choices[0].message) {
                    return JSON.parse(data.data.choices[0].message.content);
                } else iterCount++;
            } catch (e) {
                iterCount++;
            }
        }
        return null;
    },

    getAndKeywords: async (query: string[][]): Promise<OpenaiAndKeywordsResponse | null> => {
        const queryString = queryToString(query);

        let iterCount = 0;
        while (iterCount < MAXIMUM_ITER_COUNT) {
            try {
                const data = await OpenaiRepository.getAndKeywords(queryString);
                if (data.data.choices[0].message) {
                    return JSON.parse(data.data.choices[0].message.content);
                } else iterCount++;
            } catch (e) {
                iterCount++;
            }
        }
        return null;
    }
}

export default OpenaiUseCase;