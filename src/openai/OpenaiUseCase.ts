import OpenaiRepository from "./openaiRepository";
import { OpenaiAndKeywordsResponse, OpenaiOrKeywordsResponse } from "./types";

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

    mockGetOrKeywords: async (query: string[][]): Promise<OpenaiOrKeywordsResponse | null> => {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Adding delay
        return {
            list: [
                {
                    id: 0,
                    synonyms: [
                        { word: "exampleWord1", why: "exampleWhy1" },
                        { word: "exampleWord2", why: "exampleWhy2" },
                        { word: "exampleWord3", why: "exampleWhy3" },
                    ]
                },
                {
                    id: 1,
                    synonyms: [
                        { word: "exampleWord4", why: "exampleWhy4" },
                        { word: "exampleWord5", why: "exampleWhy5" },
                        { word: "exampleWord6", why: "exampleWhy6" },
                    ]
                }
            ]
        };
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