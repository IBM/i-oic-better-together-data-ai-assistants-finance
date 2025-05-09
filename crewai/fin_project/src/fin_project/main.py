#!/usr/bin/env python
import sys
import warnings

from datetime import datetime

from fin_project.crew import FinProject

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def run():
    """
    Run the crew.
    """
    # inputs = {
    #     "name": "Bill Casta",
    #     "ssn": "567-89-0123",
    #     "loan_type": "auto",
    #     "loan_amount": 35000,
    # }

    inputs = {
        "name": "Bob Falcioni",
        "ssn": "789-01-2345",
        "loan_type": "auto",
        "loan_amount": 35000,
    }
    
    try:
        FinProject().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


