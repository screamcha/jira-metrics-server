export const getJqlInString = (values: string[]): string => {
  return values.reduce(
    (result: string, nextValue: string) => `${result}, '${nextValue}'`, ''
  ).slice(2)
}
