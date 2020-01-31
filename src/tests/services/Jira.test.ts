import { mockApi, testAuthToken, resultIssues } from '../mocks/jiraApi'
import { jiraService } from '../../services/Jira'

import { EIssueType, IIssueParameters } from '../../models/Jira.model'
import { Issue } from '../../models/Issue'
import { IUser } from '../../models/User'

describe('Jira Service', () => {
  beforeAll(() => {
    mockApi()
  })

  describe('currentUser method', () => {
    const testUser: IUser = {
      email: 'test@test.com',
      name: 'Varok Saurfang',
      key: 'saurfang',
    }

    it('returns user if token is correct', async () => {
      const result = await jiraService.currentUser(testAuthToken)

      expect(result).toEqual(testUser)
    })

    it('returns null if token is incorrect', async () => {
      const result = await jiraService.currentUser(`${testAuthToken}-incorrect`)

      expect(result).toBeNull()
    })

    it('returns null if token is empty', async () => {
      const result = await jiraService.currentUser('')

      expect(result).toBeNull()
    })
  })

  describe('getIssues method', () => {
    it('returns array of issues for given parameters', async () => {
      const testParameters: IIssueParameters = {
        startDate: new Date('2019-01-01'),
        endDate: new Date('2019-12-31'),
        issueTypes: [EIssueType.Bug],
        userKey: 'user1',
      }
      const testResult = resultIssues.issues.map(issue => new Issue(issue))

      const result = await jiraService.getIssues(testAuthToken, testParameters)

      expect(result).toEqual(testResult)
    })
  })
})
