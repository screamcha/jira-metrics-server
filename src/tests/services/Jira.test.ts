import nock from 'nock'

import { jiraService } from '../../services/Jira'
import { JIRA_METRICS_API_URL } from '../../constants'
import { IUser } from '../..//interfaces'

describe('Jira Service', () => {
  const testUser: IUser = {
    email: 'test@test.com',
    name: 'Varok Saurfang',
    key: 'saurfang',
  }
  const testAuthToken = 'test-auth-key'

  beforeAll(() => {
    nock(JIRA_METRICS_API_URL)
      .get('/myself')
      .reply(function () {
        if (this.req.headers.authorization !== `Bearer ${testAuthToken}`) {
          return [401, null]
        }

        return [200, {
          emailAddress: 'test@test.com',
          displayName: 'Varok Saurfang',
          key: 'saurfang',
        }]
      })
  })

  describe('currentUser method', () => {
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
})
