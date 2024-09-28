import { type Args } from "./args.type";

export type MemoizedFunction<R, P> = (...args: Args<P>) => R;
