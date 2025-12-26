/**
 * Repositorio MSW para Meeting Details
 *
 * Implementa MeetingDetailsRepository usando directamente las funciones del state mock.
 * Este repositorio permite:
 * - Tests unitarios sin HTTP
 * - Validación de que ambos repositorios (HTTP y MSW) funcionan igual
 *
 * @pattern Repository Pattern - MSW Implementation
 */
import type { MeetingDetailsRepository } from "../../domain/ports/meeting-details.repository";
import type { MeetingDetails } from "../../domain/entities/meeting-details.entity";
import {
  getMeetingDetailsMock,
  updateMeetingDetailsMock,
} from "../mocks/data/meeting-details.state";

export class MeetingDetailsMswRepository implements MeetingDetailsRepository {
  async get(societyId: number, flowId: number): Promise<MeetingDetails | null> {
    return await getMeetingDetailsMock(societyId, flowId);
  }

  async update(societyId: number, flowId: number, details: MeetingDetails): Promise<void> {
    await updateMeetingDetailsMock(societyId, flowId, details);
  }
}

