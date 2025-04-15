import { Probot } from 'probot'
import { parser } from './parser.js'

export default (app: Probot) => {
  app.log.info('*** Patrick ***')
  app.on('issue_comment.created', async (context) => {
    const inputs = parser(context)
    if (!inputs) return
    const repo = 'hublo/monorepo'
    const owner = context.payload.sender.login
    const pullRequest = await context.octokit.pulls.get({
      owner,
      repo,
      pull_number: context.payload.issue.number,
    })
    app.log.info({ pullRequest })
    const workflow = await context.octokit.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: 'e2e-playwright-tests.yml',
      ref: pullRequest.data.head.ref,
      inputs,
    })
    app.log.info({ workflow })
  })
}
