interface Inputs {
  branch: string
  url: string
  pr: string
}

export function parser(
  context: {
    payload: { comment: { body: string }; issue: { number: number } }
  },
  branch: string,
): Inputs | undefined {
  return {
    branch,
    url: branch.toLocaleLowerCase(),
    pr: context.payload.issue.number.toString(),
  }
}
