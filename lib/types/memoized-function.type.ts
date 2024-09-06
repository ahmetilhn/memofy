import { type Args } from "./args.type";

export type MemoizedFunction<A extends Args, ReturnType> = (
  ...args: A
) => ReturnType;
