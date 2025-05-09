
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type

import re
import requests
from requests.auth import HTTPBasicAuth

# TODO move this to a .env file and load using load_env()
PORT="8080"
USER="admin"
PASSW="admin123"


def is_valid_ssn(ssn):
    """
    Validates the format of a US Social Security Number (SSN).
    Args:
        ssn (str): The SSN to validate.
    Returns:
        bool: True if the SSN is valid, False otherwise.
    """
    ssn_pattern = re.compile(r"^\d{3}-\d{2}-\d{4}$")
    return bool(ssn_pattern.match(ssn))




class GetCreditScoreToolInput(BaseModel):
    """Input schema for GetCreditScoreTool."""
    ssn: str = Field(..., description="social security number in the format NNN-NN-NNNN where N is a number")

class GetCreditScoreTool(BaseTool):
    name: str = "get credit score tool"
    description: str = "This tool is used for fetching the credit score for a given social security number. The parameter ssn represents the social security number for which to retrieve the credit score"
    args_schema: Type[BaseModel] = GetCreditScoreToolInput
    def _run(self, ssn: str) -> str:
        if is_valid_ssn(ssn):
            url = f"http://localhost:{PORT}/credit/{ssn}"
            auth_credentials = HTTPBasicAuth(USER, PASSW)  # Basic authentication
            try:
                response = requests.get(url, auth=auth_credentials)
                if response.status_code == 200:
                    return(response.json()["data"]["credit_score"])
                elif response.status_code == 404:
                    return("the social security number provided has not been found")
                else:
                    print("GetCreditScoreTool Failed:", response.status_code, response.text)
                    return("GetCreditScoreTool Failed, please try again")
            except requests.RequestException as e:
                print("Error:", e)
                return("GetCreditScoreTool Failed with Exception, please try again")
        else:
            return "the input parameter is an invalid social security number, please try again using the format NNN-NN-NNNN where N is a number"




class GetRiskAssessmentToolInput(BaseModel):
    """Input schema for GetRiskAssessmentTool."""
    ssn: str = Field(..., description="social security number in the format nnn-nn-nnnn")
    name: str = Field(..., description="full name of the customer")
#    address: str = Field(..., description="complete US address of the customer in the format `street number` `street name` `city` `state` `zip code`")       

class GetRiskAssessmentTool(BaseTool):
    name: str = "get risk assessment tool"
    description: str = "This tool confirms that a name and Social Security Number are valid and connected to the customer. It returns the risk assessment value as low, medium or high"
    args_schema: Type[BaseModel] = GetRiskAssessmentToolInput
    def _run(self, ssn: str, name: str) -> str:   # customer name is required for UC consistency by not used for query in the PoC
        if is_valid_ssn(ssn):
            url = f"http://localhost:{PORT}/credit/{ssn}"
            auth_credentials = HTTPBasicAuth(USER, PASSW)  # Basic authentication
            try:
                response = requests.get(url, auth=auth_credentials)
                if response.status_code == 200:
                    return(response.json()["data"]["risk_assessment"])
                elif response.status_code == 404:
                    return("the social security number provided has not been found")
                else:
                    print("GetRiskAssessmentTool Failed:", response.status_code, response.text)
                    return("GetRiskAssessmentTool Failed, please try again")
            except requests.RequestException as e:
                print("Error:", e)
                return("GetRiskAssessmentTool Failed with Exception, please try again")
        else:
            return "the input parameter is an invalid social security number, please try again using the format NNN-NN-NNNN where N is a number"




# Tool testing code
#getScore = GetCreditScoreTool()
#print(getScore._run(ssn="333-33-3333"))

#getRiskAssessment = GetRiskAssessmentTool()
#print(getRiskAssessment._run(ssn="333-33-3333", name='Bob Falcioni'))


