import { Probot } from 'probot'
import { parser } from './parser.js'

export default (app: Probot) => {
  app.log.info('*** Patrick ***')
  app.on('issue_comment.created', async (context) => {
    app.log.info('Installation:', context.payload.installation)
    const inputs = parser(context)
    if (!inputs) return
    const pullRequest = await context.octokit.pulls.get({
      owner: 'hublo',
      repo: 'monorepo',
      pull_number: context.payload.issue.number,
    })
    app.log.info({ pullRequest })
    const workflow = await context.octokit.actions.createWorkflowDispatch({
      owner: 'hublo',
      repo: 'monorepo',
      workflow_id: 'e2e-playwright-tests.yml',
      ref: pullRequest.data.head.ref,
      inputs,
    })
    app.log.info({ workflow })
  })
}
