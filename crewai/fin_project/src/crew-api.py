# app.py
from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import timedelta
from fin_project.crew import FinProject
from flask_cors import CORS # Enable CORS for all routes

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Secret key for JWT (keep this secure)
app.config["JWT_SECRET_KEY"] = "supersecretkey123"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)  # Token expires in 24 hours

jwt = JWTManager(app)

# Dummy user database (replace with a real database)
users = {
    "admin": generate_password_hash("admin123"),
    "user": generate_password_hash("user123")
}

@app.route('/login', methods=['POST'])
def login():
    """Login endpoint to generate JWT token"""
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    if username in users and check_password_hash(users[username], password):
        # Create a JWT token
        access_token = create_access_token(identity=username)
        return jsonify({"access_token": access_token})

    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/run', methods=['POST'])
@jwt_required()
def run_crew():
    """Secure API endpoint to run CrewAI workflow"""
    current_user = get_jwt_identity()  # Get user from JWT token
    data = request.json
    inputs = data.get("inputs")

    if not inputs:
        return jsonify({"error": "inputs is required"}), 400

    # Run CrewAI workflow
    try:
        result = FinProject().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")

    return jsonify({
        "response": result.json,
    })

if __name__ == '__main__':
    app.run(debug=True)