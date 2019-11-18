import dotenv from 'dotenv'
import { JiraService } from './Jira'

dotenv.config()

const jira = new JiraService()

it('sets fields of Jira service', () => {
  expect(jira.apiUrl).toBe(process.env.JIRA_API_URL)
})

it('retrieves user info', async () => {
  expect(jira.currentUser).toBeDefined()
  const result = await jira.currentUser()

  expect(result).toBe({})
})
