import React, {useEffect, useState} from "react";
import {Html5Qrcode, Html5QrcodeScanner, Html5QrcodeScanType} from "html5-qrcode";

const config = {
    facingMode: 'rear',
    delay: 100,
    style: {
        height: 240,
        width: 320,
    }
};

const QrScanner = () => {
    const [ result, setResult ] = useState();
    const onScanSuccess = (decodedText, decodedResult) => console.log(`Code matched = ${decodedText}`, decodedResult);

    useEffect(() => {
        let config = {
            fps: 10,
            qrbox: {width: 100, height: 100},
            rememberLastUsedCamera: true,
            // Only support camera scan type.
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
        };

        let html5QrcodeScanner = new Html5QrcodeScanner(
            "reader", config, /* verbose= */ false);
        html5QrcodeScanner.render(onScanSuccess);
        // html5QrCode.clear();

    }, []);

    return (
        <>
            <div id="reader"></div>
        </>
    )
};

export default QrScanner;