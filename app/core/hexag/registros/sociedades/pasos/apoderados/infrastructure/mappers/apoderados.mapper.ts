import type { Apoderado, ClaseApoderado } from "../../domain";
import type { ApoderadoDTO, ClaseApoderadoDTO } from "../../application";

const normalizeApoderado = (payload: Record<string, any>): Apoderado => ({
  id: payload.id ?? "",
  claseApoderadoId: payload.claseApoderadoId ?? payload.classId ?? "",
  persona: payload.persona,
  createdAt: payload.createdAt,
  updatedAt: payload.updatedAt,
});

const normalizeClase = (payload: Record<string, any>): ClaseApoderado => ({
  id: payload.id ?? payload.claseId ?? "",
  nombre: payload.nombre ?? "",
  apoderados: Array.isArray(payload.apoderados)
    ? payload.apoderados.map((item: Record<string, any>) => normalizeApoderado(item))
    : undefined,
  createdAt: payload.createdAt,
  updatedAt: payload.updatedAt,
});

export const ApoderadosMapper = {
  toClase(payload: Record<string, any>): ClaseApoderado {
    return normalizeClase(payload);
  },
  toClaseList(payload: Record<string, any>[] = []): ClaseApoderado[] {
    return payload.map((item) => normalizeClase(item));
  },
  toApoderado(payload: Record<string, any>): Apoderado {
    return normalizeApoderado(payload);
  },
  toApoderadoList(payload: Record<string, any>[] = []): Apoderado[] {
    return payload.map((item) => normalizeApoderado(item));
  },
  toClasePayload(dto: ClaseApoderadoDTO) {
    return dto;
  },
  toApoderadoPayload(dto: ApoderadoDTO) {
    return dto;
  },
};


