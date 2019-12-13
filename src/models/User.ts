import { IJiraApiUser } from './JiraApi.model';

export interface IUser {
  email: string
  name: string
  key: string
}

export class User implements IUser {
  email: string
  name: string
  key: string

  constructor (user: IJiraApiUser) {
    this.name = user.displayName
    this.email = user.emailAddress
    this.key = user.key
  }
}
