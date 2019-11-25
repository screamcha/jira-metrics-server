import { jiraService } from './Jira'
import { JIRA_METRICS_API_URL } from '../constants'
import { IJiraTestInstance } from '../interfaces.test'

describe('JiraService tests', () => {
  it('contains correct fields of Jira service', () => {
    expect(jiraService.apiURL).toBe(JIRA_METRICS_API_URL)
    expect(jiraService.apiInstance).toBeDefined()
  })

  it('retrieves user info', async () => {
    const testToken = 'test-token-1'

    expect(jiraService.currentUser).toBeDefined()
    const result = await jiraService.currentUser(testToken)
  })
})
