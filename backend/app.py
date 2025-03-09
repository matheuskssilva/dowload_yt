from flask import Flask, request, jsonify, send_from_directory
from pytubefix import YouTube

from flask_cors import CORS
import os
import re

app = Flask(__name__)

CORS(app)

# Diretório de destino para salvar os vídeos
DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

# Função para sanitizar o nome do arquivo
def sanitize_filename(filename):
    return re.sub(r'[\/:*?"<>|]', '_', filename)

@app.route('/download', methods=['POST'])
def download_video():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL não fornecida"}), 400

    try:
        yt = YouTube(url)
        
        ys = yt.streams.filter(progressive=True, file_extension="mp4").get_highest_resolution()
        
        filename = f"{sanitize_filename(yt.title)}.mp4"
        file_path = os.path.join(DOWNLOAD_FOLDER, filename)

        ys.download(output_path=DOWNLOAD_FOLDER, filename=filename)

        return jsonify({"message": "Download concluído!", "file": filename})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/files/<filename>', methods=['GET'])
def serve_file(filename):
    return send_from_directory(DOWNLOAD_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
