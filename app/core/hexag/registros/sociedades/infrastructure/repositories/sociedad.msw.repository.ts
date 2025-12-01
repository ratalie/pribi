/**
 * Repositorio MSW para Sociedades
 * 
 * Implementa SociedadRepository usando directamente las funciones del state mock.
 * Este repositorio permite:
 * - Tests unitarios sin HTTP
 * - Validación de que ambos repositorios (HTTP y MSW) funcionan igual
 * 
 * @pattern Repository Pattern - MSW Implementation
 */
import type { SociedadRepository } from "../../domain/ports/sociedad.repository";
import type { SociedadResumenDTO } from "../../application/dtos/sociedad-resumen.dto";
import {
  createSociedadMock,
  listSociedadesMock,
  deleteSociedadMock,
} from "../mocks/data/sociedades.state";
import { SocietyRegisterStep } from "../../domain/enums/society-register-step.enum";

/**
 * Mapea SocietyListItemMock (retornado por listSociedadesMock) a SociedadResumenDTO
 */
function mapToResumenDTO(item: any): SociedadResumenDTO {
  // listSociedadesMock retorna objetos con 'id' (que es profileNumber)
  // pero también puede venir directamente con profileNumber
  const id = String(item.id ?? item.profileNumber ?? item.idSociety ?? "");
  
  return {
    idSociety: id,
    razonSocial: item.razonSocial ?? item.society?.razonSocial ?? item.society?.reasonSocial ?? "Sociedad sin nombre",
    ruc: item.ruc ?? item.society?.ruc ?? item.society?.numeroRuc ?? "",
    directorio: Boolean(item.directorio ?? item.society?.directorio ?? item.society?.hasBoard ?? false),
    fechaRegistroSociedad: item.fechaRegistroSociedad ?? item.society?.fechaRegistroSociedad ?? item.society?.registrationDate ?? null,
    nombreComercial: item.nombreComercial ?? item.society?.nombreComercial ?? item.society?.commercialName ?? "",
    tipoSocietario: item.tipoSociedad ?? item.tipoSocietario ?? item.society?.tipoSocietario ?? item.society?.typeSocietyId ?? "",
    pasoActual: item.pasoActual ?? SocietyRegisterStep.DATOS_SOCIEDAD,
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? new Date().toISOString(),
    estado: item.status === "COMPLETED" ? "completo" : "borrador",
  };
}

export class SociedadMswRepository implements SociedadRepository {
  async create(): Promise<string> {
    const sociedad = await createSociedadMock();
    return String(sociedad.profileNumber);
  }

  async list(): Promise<SociedadResumenDTO[]> {
    const data = await listSociedadesMock();
    return data.map(mapToResumenDTO);
  }

  async delete(id: string): Promise<void> {
    const deleted = await deleteSociedadMock(id);
    if (!deleted) {
      throw new Error(`Sociedad con id ${id} no encontrada`);
    }
  }
}

