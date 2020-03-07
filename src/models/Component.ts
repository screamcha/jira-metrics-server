import { User } from './User'

import { IJiraApiComponent } from './JiraApi.model'

export class Component {
  id: string
  name: string
  leader: User

  constructor (component: IJiraApiComponent) {
    this.id = component.id
    this.name = component.name
    if (component.lead) {
      this.leader = new User(component.lead)
    }
  }
}
