import React, { useState } from "react";

const App = () => {
    const [url, setUrl] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [downloadLink, setDownloadLink] = useState<string>("");

    // Função para lidar com o download
    const handleDownload = async () => {
        setMessage("Baixando...");
        setDownloadLink(""); // Limpa o link anterior

        try {
            // Fazendo a requisição POST para o backend
            const response = await fetch("http://localhost:5000/download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            // Obtendo a resposta do servidor
            const data = await response.json();

            if (data.file) {
                // Atualizando o link para o arquivo de download
                setDownloadLink(`http://localhost:5000/files/${encodeURIComponent(data.file)}`);
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
            {/* Input para inserir a URL do vídeo */}
            <input
                type="text"
                placeholder="Cole a URL do vídeo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button onClick={handleDownload}>Baixar</button>

            {/* Mensagem de status */}
            {message && <p>{message}</p>}

            {/* Link para baixar o arquivo, se o download for concluído */}
            {downloadLink && (
                <a href={downloadLink} download>
                    Baixar Vídeo
                </a>
            )}
        </div>
    );
};

export default App;
