import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    organization: process.env.REACT_APP_OPENAI_ORGANIZATION,
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const OpenaiRepository =  {
    getOrKeywords: (query: string) => {
        return openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant to find similar words."
                },
                {
                    role: "user",
                    content: 'I want to expand my search by adding a synonym using the OR operator for just one group to my query. \bRecommend me maximum three different synonyms for each suggested groups. Tell me the reason why you recommend this keyword in detail, and id of the original suggested group in query for each synonyms, too. Write reason like "This keyword is recommended because ~~". The output should be the JSON format. \n' +
                        'EXAMPLE:\n' +
                        'input:\n' +
                        '{"id": 0, "group": ["CI/CD", "CICD"]},\n' +
                        '{"id": 1, "group": ["backend"]},\n' +
                        '{"id": 2, "group": ["Docker"]}\n' +
                        'output:\n' +
                        '{\n' +
                        '"list": [ {"id": 0, "synonyms": [{"word": "CI CD", "why": "This keyword is recommended because ~~"}, {"word": "Continuous Integration", "why": "reason"}, {"word": "Continuous Delivery", "why": "reason"}]}, {"id": 1, "synonyms": [{"word": "back-end", "why": "reason"},  { "word": "backside", "why": "reason"}, {"word": "server", "why": "reason"}]}, {"id": 2, "synonyms": [{"word": "Kubernetes", "why": "reason"} , {"word": "container", "why": "reason"}]} ]\n' +
                        '}\n' +
                        '\n' +
                        'SUGGESTED GROUPS:\n' +
                        query +
                        '\n' +
                        'Tell me only output for suggested groups except your descriptions.'
                }
            ],
            temperature: 0.2
        });
    },

    getAndKeywords: (query: string) => {
        return openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant to find additional keywords to use for AND query."
                },
                {
                    role: "user",
                    content: 'I am a researcher who is doing SLR through the Scopus search engine. Please recommend maximum 5 different words in the direction of adding keywords to AND query used in suggested query. Please explain why you did so about the keywords you recommended at this time. Write reason like "This keyword is recommended because ~~". The response should be only JSON format.\n' +
                        '\n' +
                        'EXAMPLE:\n' +
                        'input:\n' +
                        '{\id": 0, "group": ["CI/CD", "CICD"]},\n' +
                        '{"id": 1, "group": ["backend"]},\n' +
                        'output:\n' +
                        '{\n' +
                        '"list": [ { "word": "Docker", "why": “This keyword is recommended because ~~" }, {"word": "Kubernetes", "why": "reason"}, …]\n' +
                        '}\n' +
                        '\n' +
                        'Suggested Query: \n' +
                        query +
                        '\n' +
                        'Tell me only output for suggested groups except your descriptions.'
                }
            ],
            temperature: 0.2
        });
    }
}

export default OpenaiRepository;