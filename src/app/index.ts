import { Probot } from 'probot'
import { parser } from './parser.js'

export default (app: Probot) => {
  app.on('issue_comment.created', async (context) => {
    const { body } = context.payload.comment
    if (!body.startsWith('/e2e')) return
    const { data } = await context.octokit.pulls.get({
      owner: 'hublo',
      repo: 'monorepo',
      pull_number: context.payload.issue.number,
    })
    const { ref } = data.head
    const inputs = parser(context, ref)
    if (!inputs) return
    await context.octokit.actions.createWorkflowDispatch({
      owner: 'hublo',
      repo: 'monorepo',
      workflow_id: 'e2e-playwright-ephemeral.yml',
      ref,
      // @ts-expect-error
      inputs,
    })
  })
}
