import nock from 'nock'
import HttpCodes from 'http-status-codes'
import { format } from 'date-fns'

import { jiraService, IUser, EIssueType, IIssue } from '../../services/Jira'
import { JIRA_METRICS_API_URL, DATE_FORMAT } from '../../constants'

describe('Jira Service', () => {
  const testAuthToken = 'test-auth-key'
  const testIssueParameters = {
    jql: `
      issueType = ${EIssueType.Bug} 
        AND status in (Dev-complete, Discarded) 
        AND updated >= ${format(new Date('2019-01-01'), DATE_FORMAT)}
        AND updated <= ${format(new Date('2019-12-31'), DATE_FORMAT)}
    `,
    expand: ['changelog'],
  }
  const resultIssues = {
    issues: [
      {
        title: 'issue-1',
        changelog: {
          histories: [
            {
              id: '111',
              author: {
                name: 'Thrall',
                key: 'thrall-horde',
              },
            }
          ],
        },
      }
    ],
  }

  beforeAll(() => {
    nock(JIRA_METRICS_API_URL)
      .get('/myself')
      .reply(function () {
        if (this.req.headers.authorization !== `Bearer ${testAuthToken}`) {
          return [HttpCodes.UNAUTHORIZED, null]
        }

        return [HttpCodes.ACCEPTED, {
          emailAddress: 'test@test.com',
          displayName: 'Varok Saurfang',
          key: 'saurfang',
        }]
      })
      .post('/search', testIssueParameters)
      .reply(200, resultIssues)
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
      const testParameters = {
        startDate: new Date(2019, 0, 1),
        endDate: new Date(2019, 11, 31),
        issueType: EIssueType.Bug,
      }
      const testResult: IIssue[] = [
        {
          title: 'issue-1',
          changelog: {
            histories: [
              {
                id: '111',
                author: {
                  name: 'Thrall',
                  key: 'thrall-horde',
                },
              }
            ],
          },
        }
      ]

      const result = await jiraService.getIssues(testAuthToken, testParameters)

      expect(result).toEqual(testResult)
    })
  })
})
