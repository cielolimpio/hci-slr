import React, {useEffect, useState} from "react";
import {OpenaiSynonymsRequest, OpenaiSynonymsResponse} from "./types";
import {queryToSynonymsString} from "./utils";
import OpenaiRepository from "./openaiRepository";
const QueryHelper = ({query}: OpenaiSynonymsRequest) => {
    const [result, setResult] = useState<OpenaiSynonymsResponse | null>(null);

    const queryToString = queryToSynonymsString(query);

    useEffect(() => {
        const getSynonyms = async () => {
            if (result !== null) {
                return;
            }

            const data = await OpenaiRepository.getSynonyms(queryToString);
            if (data.data.choices[0].message) {
                let synonyms: OpenaiSynonymsResponse = JSON.parse(data.data.choices[0].message.content);
                setResult(synonyms);
            }
        };

        getSynonyms();
    }, []);

    return (
        <div className="App">
            <div>
                <strong>QUERY: </strong>
                <br />
                {query.map((keywords, id) =>
                    <div>
                        <strong>{id}. </strong>{`[${keywords.join(', ')}]`}<br/>
                    </div>
                )}
            </div>
            <br/><br/>
            <strong>RESPONSE: </strong>
            {result && result.list.map(synonym =>
                <div>
                    <strong>{synonym.id}:</strong> {synonym.synonyms.join(', ')}
                </div>
            )}
        </div>
    );
};

export default QueryHelper;