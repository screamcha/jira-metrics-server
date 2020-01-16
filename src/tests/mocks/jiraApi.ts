import { format } from 'date-fns'
import { OK } from 'http-status-codes'
import nock from 'nock'

import { DATE_FORMAT, JIRA_METRICS_API_URL } from '../../constants'

import { EIssueType } from '../../models/Jira.model'
import { IJiraApiSearchResult } from '../../models/JiraApi.model'

export const testAuthToken = 'test-auth-key'
export const testIssueParameters = {
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
export const resultIssues: IJiraApiSearchResult = {
  issues: [
    {
      key: 'issue-1',
      fields: {
        issuetype: {
          name: EIssueType.Dev,
        },
        components: [
          {
            id: 'component 1',
          }
        ],
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

export const mockApi = () => {
  nock(JIRA_METRICS_API_URL, {
    reqheaders: {
      Authorization: `Bearer ${testAuthToken}`,
    },
  })
    .get('/myself')
    .reply(OK, {
      emailAddress: 'test@test.com',
      displayName: 'Varok Saurfang',
      key: 'saurfang',
    })
    .post('/search', testIssueParameters)
    .reply(OK, resultIssues)
}
