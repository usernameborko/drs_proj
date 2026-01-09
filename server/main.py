from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/test", methods=['GET'])
def users():
    return jsonify(
        {
            "message": "pocetna"
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)