import { authHandlers } from "../auth/infrastructure/mocks";
import { registrosHandlers } from "../registros/sociedades/infrastructure/mocks/register-handlers";
import { juntasHandlers, agendaItemsHandlers } from "../juntas/infrastructure/mocks";

export const allMockHandlers = [
  ...authHandlers,
  ...registrosHandlers,
  ...juntasHandlers,
  ...agendaItemsHandlers,
];

