from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def index():
    return render_template('index.html')

# Add other Flask routes as needed

if __name__ == '__main__':
    app.run(debug=True)
