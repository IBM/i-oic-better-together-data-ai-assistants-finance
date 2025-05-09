
from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash

# TODO move this to a .env file and load using load_env()
#MongoDB Credentials
mongo_root_username = "admin"
mongo_root_password = "admin123"



# Flask app and HTTP Basic Auth setup
app = Flask(__name__)
auth = HTTPBasicAuth()

# Hardcoded user credentials (replace with a proper user management system in production)
users = {
    "admin": generate_password_hash("admin123"),
    "user": generate_password_hash("user123")
}

@auth.verify_password
def verify_password(username, password):
    if username in users and check_password_hash(users.get(username), password):
        return username
    return None

# MongoDB connection
mongo_client = MongoClient(f"mongodb://{mongo_root_username}:{mongo_root_password}@localhost:27017/")  
db = mongo_client["credit_db"]
customers_collection = db["customers"]


# Initialize the database and collection if they don't exist
def initialize_database():
    """
    Ensures the database and customers collection are initialized.
    """
    # Create the collection if it doesn't exist
    if "customers" not in db.list_collection_names():
        db.create_collection("customers")
        print("Created 'customers' collection in 'credit_db' database.")
    else:
        print("'customers' collection already exists.")

    # Add an index on SSN to ensure uniqueness (optional)
    customers_collection.create_index("ssn", unique=True)
    print("Ensured unique index on 'ssn' field.")


# Helper function to serialize MongoDB documents
def serialize_customer(customer):
    customer["_id"] = str(customer["_id"])
    return customer


# TODO this is just PoC quality code. In a Production deployment, no data such as SSN should be part of the URL
@app.route("/credit/<string:ssn>", methods=["GET"])
@auth.login_required
def get_credit_info(ssn):
    """
    API endpoint to fetch customer information by SSN.
    """
    customer = customers_collection.find_one({"ssn": ssn})
    if customer:
        return jsonify({"success": True, "data": serialize_customer(customer)}), 200
    else:
        return jsonify({"success": False, "message": "Customer not found"}), 404


@app.route("/credit", methods=["POST"])
@auth.login_required
def add_customer():
    """
    API endpoint to add a customer record.
    """
    data = request.get_json()
    if not data or not all(key in data for key in ("name", "ssn", "credit_score", "risk_assessment")):
        return jsonify({"success": False, "message": "Invalid input"}), 400

    # Ensure SSN is unique
    if customers_collection.find_one({"ssn": data["ssn"]}):
        return jsonify({"success": False, "message": "Customer with this SSN already exists"}), 400

    new_customer = {
        "name": data["name"],
        "ssn": data["ssn"],
        "credit_score": data["credit_score"],
        "risk_assessment": data["risk_assessment"]
    }
    result = customers_collection.insert_one(new_customer)
    return jsonify({"success": True, "message": "Customer added", "id": str(result.inserted_id)}), 201


@app.route("/credit/<string:ssn>", methods=["DELETE"])
@auth.login_required
def delete_customer(ssn):
    """
    API endpoint to delete a customer record by SSN.
    """
    result = customers_collection.delete_one({"ssn": ssn})
    if result.deleted_count > 0:
        return jsonify({"success": True, "message": "Customer deleted"}), 200
    else:
        return jsonify({"success": False, "message": "Customer not found"}), 404


@app.route("/credit/all", methods=["GET"])
@auth.login_required
def get_all_customers():
    """
    API endpoint to fetch all customers from the database.
    """
    customers = customers_collection.find()
    customer_list = [serialize_customer(customer) for customer in customers]
    return jsonify({"success": True, "data": customer_list}), 200


@app.route("/credit/all", methods=["DELETE"])
@auth.login_required
def delete_all_customers():
    """
    API endpoint to delete all customers in the database.
    """
    result = customers_collection.delete_many({})
    return jsonify({"success": True, "message": f"Deleted {result.deleted_count} customers."}), 200


if __name__ == "__main__":
    # Initialize the database before starting the app
    initialize_database()
    # lsof -i :8080       #command to check on a mac what listens on a port
    app.run(port=8080, debug=True)