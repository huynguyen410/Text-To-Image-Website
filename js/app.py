from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import io
from rembg import remove
from PIL import Image

app = Flask(__name__)
CORS(app)  # Cho phép CORS để client có thể gọi API

@app.route('/remove-background', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    try:
        input_image = Image.open(file.stream).convert("RGBA")
    except Exception as e:
        return jsonify({"error": f"Invalid image: {str(e)}"}), 400

    try:
        output_image = remove(input_image)
    except Exception as e:
        return jsonify({"error": f"Background removal failed: {str(e)}"}), 500

    buf = io.BytesIO()
    output_image.save(buf, format='PNG')
    buf.seek(0)
    return send_file(buf, mimetype='image/png')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
