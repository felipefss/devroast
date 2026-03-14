import { createCallerFactory } from "./init";
import { appRouter } from "./routers/_app";

export const createCaller = createCallerFactory(appRouter);

export const trpc = createCaller({});
