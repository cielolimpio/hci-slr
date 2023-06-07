import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    organization: process.env.REACT_APP_OPENAI_ORGANIZATION,
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const OpenaiRepository =  {
    getSynonyms: (query: string) => {
        return openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant to find similar words."
                },
                {
                    role: "user",
                    content: "I want to expand my search by adding a synonym using the OR operator for just one group to my query. \bRecommend me two different synonyms for each suggested groups. Tell me the reason and id of the original suggested group in query for each synonyms, too. The output should be the JSON format. \n" +
                        "EXAMPLE:\n" +
                        "input:\n" +
                        "{\"id\": 0, \"group\": [\"CI/CD\", \"CICD\"]},\n" +
                        "{\"id\": 1, \"group\": [\"backend\"]},\n" +
                        "{\"id\": 2, \"group\": [\"Docker\"]}\n" +
                        "output:\n" +
                        "{\n" +
                        "\"list\": [ {\"id\": 0, \"synonyms\": [\"Continuous Integration\", \"Continuous Delivery\"], \"why\": \"reason\"}, {\"id\": 1, \"synonyms\": [\"back-end\", \"backside\"], \"why\": \"reason\"}, {\"id\": 2, \"synonyms\": [\"Kubernetes\", \"container\"], \"why\": \"reason\"} ]\n" +
                        "}\n" +
                        "\n" +
                        "SUGGESTED GROUPS:\n" +
                        query +
                        "\n" +
                        "Tell me only output for suggested groups except your descriptions."
                }
            ],
            temperature: 0.2
        });
    }
}

export default OpenaiRepository;