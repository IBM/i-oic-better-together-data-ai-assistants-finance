# Finance UC - CrewAI components

## Disclaimer
* This is PoC quality code not meant to be deployed as-is in Production
* Clearly it can be improved

## PreRequisites

* Note that the CrewAI version used requires Python >=v3.10 and <v3.13
* Make sure you have installed the [uv package manager](https://github.com/astral-sh/uv#installation). DO NOT USE PIP
* The CrewAI agents rely on LLMs APIs. You need to have the API access information for **watsonx.ai** or **OpenShift AI**. These two LLM models below must be running on one of these platforms:
    * granite-3-2-8b-instruct
    * granite-embedding-107m-multilingual  
* Under the **crewai/fin_project** folder, create the **.env** file from **.env.example** and set all environment variables for **watsonx** (WATSONX) or **Red Hat OpenShift AI** (RHOAI) depending on which platform will serve your LLMs

    ```bash
    cp .env.example .env
    ```
* Open the **.env** file and complete one group of the environment variables shown below

    * WATSONX_URL=https://us-south.ml.cloud.ibm.com
    * WATSONX_API_KEY=<API-KEY>
    * WATSONX_PROJECT_ID=<PROJECT-ID>

    * RHOAI_URL=<RHOAI-URL>
    * RHOAI_API_KEY=<RHOAI-API-KEY>
    * RHOAI_EMBED_URL=<RHOAI-EMBED-URL>


# Run the Agentic workflow API

* Open a Terminal window and from the **crewai/fin_project** run the workflow API server. This command below will
create a virtual environment **.venv**, install the required packages and run the API

```bash
uv run ./src/crew-api.py
```

# Test the Agentic workflow API

* Now we will test the APIs with a curl command.
* On a separate Terminal window, run the curl command below to get the API access token

```
curl -X POST http://127.0.0.1:5000/login \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "admin123"}'
```

* Now lets invoke the agentic workflow with some customer sample data that we loaded on the backend. Replace ACCESS-TOKEN with the value of access_token from the previous curl command (only the value between the surrounding double quotes)

```
curl -X POST http://127.0.0.1:5000/run \
-H "Content-Type: application/json" \
-d '{"inputs": {"name": "Joe Phillips", "ssn": "654-32-1098", "loan_type": "auto", "loan_amount": 35000}}' \
-H "Authorization: Bearer ACCESS-TOKEN"
```
* You can see the agentic workflow running and logging information in the previous Terminal window where we run the workflow API server. In the logs, you may see an LLM Error list.remove(x): x not in list. Disregard this message.

* After the **Crew Execution Completed** final message in the logging, you should get a JSON response representing the output of the Agentic workflow.
