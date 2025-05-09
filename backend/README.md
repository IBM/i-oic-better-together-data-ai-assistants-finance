
# Finance UC - backend components

## Back End instructions:

## Disclaimer
* This is PoC quality code not meant to be deployed as-is in Production
* Clearly it can be improved

### Prerequisites

* Note that the CrewAI version used requires Python >=v3.10 and <v3.13
* Install [Podman](https://podman.io/docs/installation#macos) to be able to manage containers
* Install [uv package manager](https://github.com/astral-sh/uv#installation). DO NOT USE PIP

### Create DB & load data

* Open a Terminal window
* Make sure you are in the **backend** folder
* Start MongoDB following the instructions in the file **mongo-db.sh**

### Run the APIs

* Run the following command that will install the required packages and run APIs

```bash
uv run api-code.py
```

### Load Sample Customer Data

Open a separate Terminal window:
* load the sample data into MongoDB by running **api-data.sh**

```bash
bash api-data.sh
```