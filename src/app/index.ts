import { Probot } from 'probot'
import { parser } from './parser.js'

export default (app: Probot) => {
  app.on('issue_comment.created', async (context) => {
    const inputs = parser(context)
    if (!inputs) return
    await context.octokit.actions.createWorkflowDispatch({
      owner: context.payload.sender.login,
      repo: 'hublo/monorepo',
      workflow_id: 'e2e-playwright-tests.yml',
      ref: 'main',
      inputs,
    })
  })
}
