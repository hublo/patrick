const ALLOWED_ENVS = [
  'ng',
  'dev',
  'env1',
  'env2',
  'env3',
  'env4',
  'env5',
  'env6',
]
const ALLOWED_FRONTS = ['', 'front-hr-management']

export function parser(context: { payload: { comment: { body: string } } }) {
  const { body } = context.payload.comment
  if (!body.startsWith('/e2e')) return
  const [, frontMatrix = '', env = 'ng'] = body.split(' ')
  if (!ALLOWED_ENVS.includes(env)) return
  if (!ALLOWED_FRONTS.includes(frontMatrix)) return
  return { 'front-matrix': frontMatrix, env }
}
