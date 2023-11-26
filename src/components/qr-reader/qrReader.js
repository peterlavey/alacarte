import React, {useEffect, useState} from "react";
import {read} from "../../services/file";

const QrScanner = () => {
    const [ result, setResult ] = useState();

    useEffect(() => {
        read().then(r => setResult(r));
    }, []);

    return (
        <>
            <div id="reader"></div>
            <span>{JSON.stringify(result)}</span>
        </>
    )
};

export default QrScanner;