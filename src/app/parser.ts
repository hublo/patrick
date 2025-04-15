const SUPPORTED_ENVIRONMENTS = [
  'ng',
  'dev',
  'env1',
  'env2',
  'env3',
  'env4',
  'env5',
  'env6',
] as const
const SUPPORTED_FRONTENDS = ['', 'front-hr-management'] as const

export function parser(context: { payload: { comment: { body: string } } }) {
  const { body } = context.payload.comment
  if (!body.startsWith('/e2e')) return
  const [, frontMatrix = '', env = 'ng'] = body.split(' ')

  const validatedEnvironment = ensureValidInput(SUPPORTED_ENVIRONMENTS, env)
  const validatedFrontends = ensureValidInput(SUPPORTED_FRONTENDS, frontMatrix)

  return {
    'front-matrix': validatedFrontends,
    baseUrl: `https://${validatedEnvironment}.hubpreprod.com/` as const,
  }
}

export function ensureValidInput<T extends string>(
  list: readonly T[],
  el: string,
): T {
  if (!list.includes(el as T))
    throw new Error(
      `Invalid input: ${el}. Supported values are: ${list.join(', ')}`,
    )
  return el as T
}
