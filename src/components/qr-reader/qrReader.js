import React, {useEffect, useState} from "react";
import {Html5QrcodeScanner, Html5QrcodeScanType} from "html5-qrcode";
import {read, save} from "../../services/file";

const config = {
    fps: 10,
    qrbox: {width: 100, height: 100},
    rememberLastUsedCamera: true,
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
};

const QrScanner = () => {
    const [ result, setResult ] = useState();
    const init = () => {
        let html5QrcodeScanner = new Html5QrcodeScanner("reader", config, false);
        html5QrcodeScanner.render(decodedText => {
            setResult(decodedText)
        });
        // html5QrCode.clear();
    }

    useEffect(() => {
        // init();
        // save('test').then(r => console.log(r));
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