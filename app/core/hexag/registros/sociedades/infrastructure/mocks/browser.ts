import { setupWorker } from "msw/browser";

import { registrosHandlers } from ".";

export const registrosWorker = setupWorker(...registrosHandlers);

