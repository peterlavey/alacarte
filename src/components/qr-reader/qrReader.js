import React, {useState} from "react";
import QrReader from 'react-qr-scanner'

const config = {
    delay: 100,
    style: {
        height: 240,
        width: 320,
    }
};

const QrScanner = () => {
    const [ result, setResult ] = useState();
    const handleScan = data => setResult(data);
    const handleError = err => console.error(err);

    return (
        <>
            <QrReader
                delay={config.delay}
                style={config.style}
                onError={handleError}
                onScan={handleScan}
            />
            <p>{JSON.stringify(result)}</p>
        </>
    )
};

export default QrScanner;