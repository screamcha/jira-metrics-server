import { IJiraService } from '../interfaces'

export class JiraService implements IJiraService {
    apiUrl = process.env.JIRA_API_URL
}
