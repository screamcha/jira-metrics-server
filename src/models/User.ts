import { IJiraApiUser } from './JiraApi.model'

export class User {
  email: string
  name: string
  key: string

  constructor (user: IJiraApiUser) {
    this.name = user.displayName
    this.email = user.emailAddress
    this.key = user.key
  }
}
