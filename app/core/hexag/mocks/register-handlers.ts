import { authHandlers } from "../auth/infrastructure/mocks";
import { registrosHandlers } from "../registros/sociedades/infrastructure/mocks/register-handlers";
import { juntasHandlers, agendaItemsHandlers, snapshotHandlers } from "../juntas/infrastructure/mocks";

export const allMockHandlers = [
  ...authHandlers,
  ...registrosHandlers,
  ...juntasHandlers,
  ...agendaItemsHandlers,
  ...snapshotHandlers,
];

