import { setupServer } from "msw/node";

import { sociedadesHandlers } from ".";

export const registrosServer = setupServer(...sociedadesHandlers);

