import dotenv from 'dotenv'
import { JiraService } from './Jira'

dotenv.config()

const jira = new JiraService()

it('sets fields of Jira service', () => {
  expect(jira.apiUrl).toBe(process.env.JIRA_API_URL)
})
