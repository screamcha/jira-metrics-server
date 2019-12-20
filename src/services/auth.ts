import axios from 'axios'
import jwt from 'jsonwebtoken'

import { JIRA_AUTH_URL } from '../constants'

const authSecret = process.env.AUTH_SECRET
const clientId = process.env.JIRA_CLIENT_ID
const clientSecret = process.env.JIRA_SECRET_KEY

interface IAuthService {
  refreshAuthToken: (token: string) => Promise<string> | any
}

interface IRefreshTokenResponse {
  access_token: string
  expires_in: number
}

class AuthService implements IAuthService {
  public async refreshAuthToken (token: string) {
    const { refreshToken } = jwt.decode(token) as { refreshToken: string }

    if (!refreshToken) {
      return null
    }

    const { data }: { data: IRefreshTokenResponse } = await axios.post(`${JIRA_AUTH_URL}/oauth/token`, {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    })

    const authToken = jwt.sign({ accessToken: data.access_token, refreshToken }, authSecret)

    return authToken
  }
}

export const authService = new AuthService()
