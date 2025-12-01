import { nanoid } from "nanoid";
import { getAllRecords, getRecord, putRecord, deleteRecord } from "@hexag/registros/shared/mock-database";
import type { Accion } from "../../../domain/entities/accion.entity";
import type { AccionPayload } from "../../../domain/entities/accion-payload.entity";
import { AccionesMapper } from "../../mappers/acciones.mapper";

const STORE_NAME = "acciones";

const now = () => new Date().toISOString();

function ensureId(value?: string): string {
  if (value && value.length > 0) return value;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return nanoid();
}

type StoredAccion = Accion & { societyProfileId?: string };

/**
 * Lista todas las acciones de una sociedad
 */
export async function listAccionesMock(profileId: string): Promise<Accion[]> {
  const records = (await getAllRecords<StoredAccion>(STORE_NAME)) ?? [];
  return records.filter((item) => item.societyProfileId === profileId);
}

/**
 * Obtiene una acción específica
 */
export async function getAccionMock(profileId: string, accionId: string): Promise<Accion | null> {
  const record = await getRecord<StoredAccion>(STORE_NAME, accionId);
  if (!record) return null;
  return record.societyProfileId === profileId ? record : null;
}

/**
 * Crea una nueva acción
 */
export async function createAccionMock(profileId: string, payload: AccionPayload): Promise<Accion> {
  const id = ensureId(payload.id);
  
  // Convertir payload a entidad
  const entity: Accion = {
    id,
    tipo: payload.tipo,
    nombreAccion: payload.nombreAccion || `Acción ${payload.tipo}`,
    accionesSuscritas: payload.accionesSuscritas,
    derechoVoto: payload.derechoVoto,
    redimibles: payload.redimible,
    otrosDerechosEspeciales: payload.otrosDerechosEspeciales,
    metadataDerechosEspeciales: payload.archivosOtrosDerechos?.map((fileId) => ({
      fileId,
      mimeType: "application/pdf",
      originalName: "archivo.pdf",
      size: 0,
    })) || [],
    obligacionesAdicionales: payload.obligacionesAdicionales,
    metadataObligaciones: payload.archivosObligaciones?.map((fileId) => ({
      fileId,
      mimeType: "application/pdf",
      originalName: "archivo.pdf",
      size: 0,
    })) || [],
    comentariosAdicionales: payload.comentariosAdicionales,
    comentariosAdicionalesTexto: payload.comentariosAdicionalesTexto || "",
  };

  await putRecord(STORE_NAME, {
    ...entity,
    societyProfileId: profileId,
  } as StoredAccion);

  return entity;
}

/**
 * Actualiza una acción existente
 */
export async function updateAccionMock(profileId: string, payload: AccionPayload): Promise<Accion> {
  if (!payload.id) {
    throw new Error("El payload de actualización de acción requiere un id.");
  }

  const current = await getAccionMock(profileId, payload.id);
  if (!current) {
    // Si no existe, crear nueva
    return createAccionMock(profileId, payload);
  }

  // Actualizar campos
  const updated: Accion = {
    ...current,
    tipo: payload.tipo,
    nombreAccion: payload.nombreAccion || current.nombreAccion,
    accionesSuscritas: payload.accionesSuscritas,
    derechoVoto: payload.derechoVoto,
    redimibles: payload.redimible,
    otrosDerechosEspeciales: payload.otrosDerechosEspeciales,
    metadataDerechosEspeciales: payload.archivosOtrosDerechos?.map((fileId) => ({
      fileId,
      mimeType: "application/pdf",
      originalName: "archivo.pdf",
      size: 0,
    })) || [],
    obligacionesAdicionales: payload.obligacionesAdicionales,
    metadataObligaciones: payload.archivosObligaciones?.map((fileId) => ({
      fileId,
      mimeType: "application/pdf",
      originalName: "archivo.pdf",
      size: 0,
    })) || [],
    comentariosAdicionales: payload.comentariosAdicionales,
    comentariosAdicionalesTexto: payload.comentariosAdicionalesTexto || "",
  };

  await putRecord(STORE_NAME, {
    ...updated,
    societyProfileId: profileId,
  } as StoredAccion);

  return updated;
}

/**
 * Elimina una o más acciones
 */
export async function deleteAccionesMock(profileId: string, accionIds: string[]): Promise<boolean> {
  let deletedCount = 0;
  
  for (const accionId of accionIds) {
    const existing = await getAccionMock(profileId, accionId);
    if (existing) {
      await deleteRecord(STORE_NAME, accionId);
      deletedCount++;
    }
  }

  return deletedCount > 0;
}

