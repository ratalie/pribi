import { authHandlers } from "../auth/infrastructure/mocks";
import { registrosHandlers } from "../registros/sociedades/infrastructure/mocks/register-handlers";

export const allMockHandlers = [...authHandlers, ...registrosHandlers];

