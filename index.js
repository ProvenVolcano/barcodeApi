const video = document.getElementById('video');
const resultDiv = document.getElementById('result');
const statusDiv = document.getElementById('status');

async function startScanner() {
    // 1. Kontrola, zda prohlížeč API podporuje
    if (!('BarcodeDetector' in window)) {
        statusDiv.innerText = "Chyba: BarcodeDetector není v tomto prohlížeči podporován.";
        return;
    }

    const detector = new BarcodeDetector({
        formats: ['ean_13', 'code_128', 'qr_code', 'upc_a']
    });

    try {
        // 2. Přístup k zadní kameře mobilu
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });
        video.srcObject = stream;
        statusDiv.innerText = "Skener aktivní (zadní kamera)";

        // 3. Smyčka detekce
        setInterval(async () => {
            try {
                const barcodes = await detector.detect(video);
                if (barcodes.length > 0) {
                    const code = barcodes[0].rawValue;
                    resultDiv.innerText = "Nalezen kód: " + code;

                    // Volitelná haptická odezva (vibrace), pokud to mobil umí
                    if (navigator.vibrate) navigator.vibrate(100);
                }
            } catch (e) {
                // Během ostření může detekce občas selhat, to ignorujeme
            }
        }, 500); // Kontrola každých 500ms

    } catch (err) {
        console.error(err);
        statusDiv.innerText = "Chyba: Nepodařilo se získat přístup k fotoaparátu.";
    }
}

startScanner();
