import { setupWorker } from "msw/browser";

import { sociedadesHandlers } from ".";

export const registrosWorker = setupWorker(...sociedadesHandlers);

