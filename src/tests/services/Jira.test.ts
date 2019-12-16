import nock from 'nock'
import HttpCodes from 'http-status-codes'
import { format } from 'date-fns'

import { jiraService } from '../../services/Jira'
import { JIRA_METRICS_API_URL, DATE_FORMAT } from '../../constants'

import { EIssueType, IIssueParameters } from '../../models/Jira.model'
import { IJiraApiSearchResult } from '../../models/JiraApi.model'
import { Issue } from '../../models/Issue'
import { IUser } from '../../models/User'

describe('Jira Service', () => {
  const testAuthToken = 'test-auth-key'
  const testIssueParameters = {
    jql: `
      issuetype in ('${EIssueType.Bug}')
        AND status in (Dev-complete, Discarded)
        AND
          (
            (updated >= ${format(new Date('2019-01-01'), DATE_FORMAT)}
            AND updated <= ${format(new Date('2019-12-31'), DATE_FORMAT)})
          OR
            (created >= ${format(new Date('2019-01-01'), DATE_FORMAT)}
            AND created <= ${format(new Date('2019-12-31'), DATE_FORMAT)})
          )
        AND
          assignee = user1
    `,
    expand: ['changelog'],
    fields: ['issuelinks', 'issuetype'],
  }
  const resultIssues: IJiraApiSearchResult = {
    issues: [
      {
        key: 'issue-1',
        fields: {
          issuetype: {
            id: EIssueType.Dev,
          },
        },
        changelog: {
          histories: [
            {
              id: '111',
              author: {
                displayName: 'Thrall',
                key: 'thrall-horde',
                emailAddress: 'thrall@azeroth.com',
              },
              created: '2019-01-03',
              items: [
                {
                  field: 'timespent',
                  from: null,
                  to: '10000',
                }
              ],
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
      const testParameters: IIssueParameters = {
        startDate: new Date(2019, 0, 1),
        endDate: new Date(2019, 11, 31),
        issueTypes: [EIssueType.Bug],
        userKey: 'user1',
      }
      const testResult = resultIssues.issues.map(issue => new Issue(issue))

      const result = await jiraService.getIssues(testAuthToken, testParameters)

      expect(result).toEqual(testResult)
    })
  })
})
