
import os
from dotenv import load_dotenv
from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from fin_project.tools.custom_tool import GetRiskAssessmentTool, GetCreditScoreTool
from pydantic import BaseModel, Field
from typing import Literal
from crewai.knowledge.source.text_file_knowledge_source import TextFileKnowledgeSource
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource



# If you want to run a snippet of code before or after the crew starts, 
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators


# Load .env file and set variables
load_dotenv()
watsonx_url=os.getenv('WATSONX_URL', 'NOT-FOUND-IN-DOT-ENV')
watsonx_api_key=os.getenv('WATSONX_API_KEY', 'NOT-FOUND-IN-DOT-ENV')
watsonx_project_id=os.getenv('WATSONX_PROJECT_ID', 'NOT-FOUND-IN-DOT-ENV')

rhoai_url=os.getenv('RHOAI_URL', 'NOT-FOUND-IN-DOT-ENV')
rhoai_api_key=os.getenv('RHOAI_API_KEY', 'NOT-FOUND-IN-DOT-ENV')
rhoai_embed_url=os.getenv('RHOAI_EMBED_URL', 'NOT-FOUND-IN-DOT-ENV')



watson_llm = LLM(
	model="watsonx/ibm/granite-3-2-8b-instruct",         #QA: tested with current flow, works good enough for an 8b params
	base_url=watsonx_url,
	api_key=watsonx_api_key,
	project_id=watsonx_project_id,
    max_tokens=1000,
    temperature=0.1,   # keeping this low to minimize model creativity!
)

watson_embedding={
	"provider": "watson",
	"config": {
		"model": "ibm/granite-embedding-107m-multilingual",
		"api_url": watsonx_url,
		"api_key": watsonx_api_key,
		"project_id": watsonx_project_id,				
	}
}

rhoai_llm = LLM(
    model="openai/granite",
    base_url=rhoai_url,
    api_key=rhoai_api_key,
    max_tokens=1000,
    temperature=0.1,
)

rhoai_embedding = {
	"provider": "openai",
	"config": {
		"model": "granite-embedding",
		"api_base": rhoai_embed_url,
		"api_key": rhoai_api_key,
	}
}

# Knowledge sources for loan approval
loan_approval_knowledge = TextFileKnowledgeSource(
    file_paths=["loan_approval_knowledge.txt"],
	chunk_size=4000,      # Maximum size of each chunk (default: 4000)
    chunk_overlap=200,     # Overlap between chunks (default: 200)
)

# Knowledge sources for alternative loan approval
alternative_loan_knowledge = PDFKnowledgeSource(
	file_paths=["loan-products.pdf"],	
	chunk_size=4000,      # Maximum size of each chunk (default: 4000)
	chunk_overlap=200,     # Overlap between chunks (default: 200)
)


# Tasks expected output defined using Pydantic model data structures
class Risk(BaseModel):
	risk_level: Literal['low', 'medium', 'high'] = Field(..., description="Risk level must be 'low', 'medium', or 'high'.")

class CreditScore(BaseModel):
	credit_score: int = Field(..., ge=300, le=850, description="The credit score of the customer requesting a loan (300-850).")

class LoanDecision(BaseModel):
    response: str = Field(..., description="The loan application decision.")

class LoanResponse(BaseModel):
    response: str = Field(..., description="The customer friendly response to the loan application.")



@CrewBase
class FinProject():
	"""FinProject crew"""

	# Learn more about YAML configuration files here:
	# Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
	# Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended
	agents_config = 'config/agents.yaml'
	tasks_config = 'config/tasks.yaml'

	# If you would like to add tools to your agents, you can learn more about it here:
	# https://docs.crewai.com/concepts/agents#agent-tools
	@agent
	def risk_analyst(self) -> Agent:
		return Agent(
			config=self.agents_config['risk_analyst'],
			llm=watson_llm,			
		)
	
	@agent
	def credit_analyst(self) -> Agent:
		return Agent(
			config=self.agents_config['credit_analyst'],
			llm=watson_llm,					
		)
	
	@agent
	def loan_specialist(self) -> Agent:
		return Agent(
			config=self.agents_config['loan_specialist'],
			llm=watson_llm,
			knowledge_sources=[loan_approval_knowledge],
			embedder=watson_embedding,			
		)

	@agent
	def customer_communications_specialist(self) -> Agent:
		return Agent(
			config=self.agents_config['customer_communications_specialist'],
			llm=watson_llm,
			knowledge_sources=[alternative_loan_knowledge],
			embedder=watson_embedding,			
		)


	# To learn more about structured task outputs, 
	# task dependencies, and task callbacks, check out the documentation:
	# https://docs.crewai.com/concepts/tasks#overview-of-a-task

	
	@task
	def risk_analysis_task(self) -> Task:
		return Task(
			config=self.tasks_config['risk_analysis_task'],
			agent=self.risk_analyst(),
			tools=[GetRiskAssessmentTool()],		
			output_pydantic=Risk,
			async_execution=True,
		)

	@task
	def credit_analysis_task(self) -> Task:
		return Task(
			config=self.tasks_config['credit_analysis_task'],
			agent=self.credit_analyst(),
			tools=[GetCreditScoreTool()],
			output_pydantic=CreditScore,
			async_execution=True,
		)
	
	@task
	def loan_approval_task(self) -> Task:
		return Task(
			config=self.tasks_config['loan_approval_task'],
			agent=self.loan_specialist(),
			context=[self.risk_analysis_task(), self.credit_analysis_task()],	
			output_json=LoanDecision,
		)

	@task
	def customer_communications_task(self) -> Task:
		return Task(
			config=self.tasks_config['customer_communications_task'],
			agent=self.customer_communications_specialist(),
			context=[self.loan_approval_task()],
			output_json=LoanResponse,
		)


	@crew
	def crew(self) -> Crew:
		"""Creates the FinProject crew"""
		# To learn how to add knowledge sources to your crew, check out the documentation:
		# https://docs.crewai.com/concepts/knowledge#what-is-knowledge

		return Crew(
			agents=self.agents,
			tasks=self.tasks,
			process=Process.sequential, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
			cache=False,
			share_crew=False,
			verbose=True,
		)
