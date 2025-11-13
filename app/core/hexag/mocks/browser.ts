import { setupWorker } from "msw/browser";

import { allMockHandlers } from "./register-handlers";

export const mswWorker = setupWorker(...allMockHandlers);

