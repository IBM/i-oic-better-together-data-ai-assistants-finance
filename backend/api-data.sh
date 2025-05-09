# CREDIT SCORE DATA
# The classic FICO ( Fair Isaac Corporation ) credit score in the United States ranges from 300 to 850
# FICO breaks down the credit score range into the following categories:
#	•	Poor: 300 to 579
#	•	Fair: 580 to 669
#	•	Good: 670 to 739
#	•	Very Good: 740 to 799
#	•	Exceptional: 800 to 850
#


# RISK ASSESSMENT DATA (this supports the KYC agent)
# verification service allows a customer to submit personal identifiable information from applicants within 
# the United States. The SSN verification service confirms that a name, address, and Social Security 
# Number are valid and connected to the end user. For the PoC back end, it only uses the SSN as key and returns risk-assessment value.
# The data simulates this service https://docs.jumio.com/production/Content/References/Risk%20Signals/SSN%20Verification.htm
# 
# Risk Assessment Values
# "low",       Provided data matches available records.
# "medium",    Partial matches of provided name to address.
# "high",      Provided data does not match available records.




export PORT=8080
export USER=admin
export PASSW=admin123

# Add customers with credit score and risk assessment values
# first 3 customers with Poor scores
curl -X POST http://localhost:$PORT/credit -H "Content-Type: application/json" -u $USER:$PASSW -d '{"name": "John Doe", "ssn": "153-95-6789", "credit_score": 310, "risk_assessment": "low"}'
curl -X POST http://localhost:$PORT/credit -H "Content-Type: application/json" -u $USER:$PASSW -d '{"name": "Sam Derby", "ssn": "987-65-4321", "credit_score": 420, "risk_assessment": "medium"}'
curl -X POST http://localhost:$PORT/credit -H "Content-Type: application/json" -u $USER:$PASSW -d '{"name": "Peter Robin", "ssn": "456-78-9012", "credit_score": 540, "risk_assessment": "high"}'
# next 3 customers with Fair scores
curl -X POST http://localhost:$PORT/credit -H "Content-Type: application/json" -u $USER:$PASSW -d '{"name": "Adela Garcia", "ssn": "321-54-9876", "credit_score": 590, "risk_assessment": "low"}'
curl -X POST http://localhost:$PORT/credit -H "Content-Type: application/json" -u $USER:$PASSW -d '{"name": "Joe Phillips", "ssn": "654-32-1098", "credit_score": 605, "risk_assessment": "medium"}'
curl -X POST http://localhost:$PORT/credit -H "Content-Type: application/json" -u $USER:$PASSW -d '{"name": "Bob Falcioni", "ssn": "789-01-2345", "credit_score": 661, "risk_assessment": "high"}'
# next 4 customers with Good, Very Good or Exceptional scores
curl -X POST http://localhost:$PORT/credit -H "Content-Type: application/json" -u $USER:$PASSW -d '{"name": "Boby Gates", "ssn": "234-56-7890", "credit_score": 680, "risk_assessment": "low"}'
curl -X POST http://localhost:$PORT/credit -H "Content-Type: application/json" -u $USER:$PASSW -d '{"name": "Marta Dobbs", "ssn": "876-54-3210", "credit_score": 760, "risk_assessment": "medium"}'
curl -X POST http://localhost:$PORT/credit -H "Content-Type: application/json" -u $USER:$PASSW -d '{"name": "Susan Verma", "ssn": "345-67-8901", "credit_score": 800, "risk_assessment": "high"}'
curl -X POST http://localhost:$PORT/credit -H "Content-Type: application/json" -u $USER:$PASSW -d '{"name": "Bill Casta", "ssn": "567-89-0123", "credit_score": 820, "risk_assessment": "low"}'


# fetch one customer
# curl -X GET http://localhost:$PORT/credit/153-95-6789 -u $USER:$PASSW

# fetch all customers
# curl -X GET http://localhost:$PORT/credit/all -u $USER:$PASSW

# delete one customer
# curl -X DELETE http://localhost:$PORT/credit/456-78-9012 -u $USER:$PASSW

# delete all customers
# curl -X DELETE http://localhost:$PORT/credit/all -u $USER:$PASSW