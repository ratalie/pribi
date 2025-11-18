import { setupServer } from "msw/node";

import { registrosHandlers } from ".";

export const registrosServer = setupServer(...registrosHandlers);

