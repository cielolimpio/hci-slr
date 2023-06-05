import {Configuration, OpenAIApi} from "openai";
import React, {useEffect, useState} from "react";

const configuration = new Configuration({
    organization: process.env.REACT_APP_OPENAI_ORGANIZATION,
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const QueryHelper = () => {
    const [result, setResult] = useState(null);

    useEffect(() => {
        const getSynonyms = async () => {
            if (result !== null) {
                return;
            }

            const data = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant to find similar words."
                    },
                    {
                        role: "user",
                        content: "Give maximum 5 English words for each words.\n" +
                            "QUESTION: [\"MOSFET\", \"BJT\", \"saturation\", \"blackhole\"]\n" +
                            "\n" +
                            "response:\n" +
                            "{\n" +
                            "    \"list\": [\n" +
                            "        [\"```{synonym of first word}```\", \"```{synonym of first word}```\", \"```{synonym of first word}```\"],\n" +
                            "        [\"```{synonym of second word}```\"],\n" +
                            "        [\"```{synonym of third word}```\", \"```{synonym of third word}```\"],\n" +
                            "        ...\n" +
                            "    ]\n" +
                            "}"
                    }
                ],
                temperature: 0.2
            });

            const response = data.data;

            // Parse response and format as desired
            if (response.choices[0].message) {
                let synonyms = JSON.parse(response.choices[0].message.content);
                const lines = response.choices[0].message.content.split('\n');
                lines.forEach(line => {
                    const parts = line.split(':');
                    if (parts.length === 2) {
                        synonyms[parts[0].trim()] = parts[1].split(',').map(word => word.trim());
                    }
                });

                setResult(synonyms);
            }
        };

        getSynonyms();
    }, []);

    return (
        <div className="App">
            {result && Object.keys(result).map(key =>
                <div key={key}>
                    {/* <strong>{key}:</strong> {result[key].join(', ')} */}
                </div>
            )}
        </div>
    );
};

export default QueryHelper;