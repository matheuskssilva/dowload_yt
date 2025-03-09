import React, { useState } from "react";

const App = () => {
    const [url, setUrl] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [downloadLink, setDownloadLink] = useState<string>("");

    const handleDownload = async () => {
        setMessage("Baixando...");
        setDownloadLink("");

        try {
            const response = await fetch("http://localhost:5001/download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (data.file) {
                setDownloadLink(`http://localhost:5001/files/${encodeURIComponent(data.file)}`);
                setMessage("Download concluído! Clique no botão abaixo para baixar.");
            } else {
                setMessage(data.error || "Erro ao baixar vídeo");
            }
        } catch (error) {
            setMessage("Erro ao baixar vídeo");
        }
    };

    return (
        <div className="App">
            <h1>Baixar Vídeo do YouTube</h1>
            <input
                type="text"
                placeholder="Cole a URL do vídeo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button onClick={handleDownload}>Baixar</button>

            {message && <p>{message}</p>}

            {downloadLink && (
                <a href={downloadLink} download>
                    Baixar Vídeo
                </a>
            )}
        </div>
    );
};

export default App;
