export type MemoizedFunction<Args extends Readonly<Array<any>>, ReturnType> = (
  ...args: Args
) => ReturnType;
