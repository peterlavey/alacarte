import React, {useEffect, useState} from "react";
import {Html5QrcodeScanner, Html5QrcodeScanType} from "html5-qrcode";

const config = {
    fps: 10,
    qrbox: {width: 100, height: 100},
    rememberLastUsedCamera: true,
    // Only support camera scan type.
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
};

const QrScanner = () => {
    const [ result, setResult ] = useState();
    const onScanSuccess = (decodedText, decodedResult) => setResult(decodedResult);

    useEffect(() => {
        let html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            config,
            false);
        html5QrcodeScanner.render(onScanSuccess);
        // html5QrCode.clear();

    }, []);

    return (
        <>
            <div id="reader"></div>
            <span>{JSON.stringify(result)}</span>
        </>
    )
};

export default QrScanner;