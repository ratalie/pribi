import { http, HttpResponse } from 'msw';
import { getAsistenciasMock, updateAsistenciaMock } from '../data/asistencia.state';

export const asistenciaHandlers = [
  // GET - Obtener asistencias
  http.get(
    '/api/v2/society-profile/:societyId/register-assembly/:flowId/attendance',
    async ({ params }) => {
      const societyId = parseInt(params.societyId as string);
      const flowId = parseInt(params.flowId as string);
      
      console.debug('[MSW][AsistenciaHandlers] GET attendance', {
        societyId,
        flowId,
      });
      
      try {
        const asistencias = await getAsistenciasMock(societyId, flowId);
        
        return HttpResponse.json({
          success: true,
          message: 'Asistencia obtenida correctamente',
          code: 200,
          data: asistencias,
        });
      } catch (error: any) {
        return HttpResponse.json(
          {
            success: false,
            message: error.message,
            code: 404,
          },
          { status: 404 }
        );
      }
    }
  ),
  
  // PUT - Actualizar asistencia
  http.put(
    '/api/v2/society-profile/:societyId/register-assembly/:flowId/attendance',
    async ({ params, request }) => {
      const societyId = parseInt(params.societyId as string);
      const flowId = parseInt(params.flowId as string);
      const body = (await request.json()) as {
        id: string;
        attended: boolean;
        representedById?: string;
        isRepresentative: boolean;
      };
      
      console.debug('[MSW][AsistenciaHandlers] PUT attendance', {
        societyId,
        flowId,
        body,
      });
      
      try {
        await updateAsistenciaMock(
          societyId,
          flowId,
          body.id,
          body.attended,
          body.representedById
        );
        
        return HttpResponse.json({
          success: true,
          message: 'Asistencia actualizada correctamente',
          code: 200,
        });
      } catch (error: any) {
        return HttpResponse.json(
          {
            success: false,
            message: error.message,
            code: 400,
          },
          { status: 400 }
        );
      }
    }
  ),
];















