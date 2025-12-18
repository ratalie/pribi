import type { ConversationMessageTypeEnum, SSECallbacks, SSEEvent } from '../../domain/entities/chat.types';

/**
 * Cliente SSE para manejar Server-Sent Events del chat con IA
 * Adaptado de v2.5 para Nuxt 4
 */
export class SSEClient {
  private abortController: AbortController | null = null;

  /**
   * Envía un mensaje y maneja la respuesta SSE
   */
  async sendMessage(
    conversationId: number,
    message: string,
    callbacks: SSECallbacks = {}
  ): Promise<void> {
    // Obtener la URL base de la API desde la configuración de Nuxt
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase || '/api/v2';
    const url = `${baseUrl}/repository/conversations/${conversationId}/message`;

    // Limpiar cualquier conexión anterior
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    // Crear nuevo AbortController para esta petición
    this.abortController = new AbortController();

    try {
      // Obtener token de autenticación
      const token = useCookie('token').value || localStorage.getItem('token');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await this.handleSSEStream(response, callbacks);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        callbacks.aborted?.('El proceso ha sido cancelado');
      } else {
        callbacks.error?.(error instanceof Error ? error.message : 'Error desconocido');
      }
    } finally {
      // Limpiar el AbortController al finalizar
      this.abortController = null;
    }
  }

  /**
   * Maneja el stream de Server-Sent Events
   */
  private async handleSSEStream(response: Response, callbacks: SSECallbacks): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No se pudo obtener el reader del stream');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ') && line.length > 6) {
            const data = line.substring(6);
            try {
              const eventData = JSON.parse(data);
              this.handleSSEEvent(eventData, callbacks);
            } catch (parseError) {
              console.error('Error al parsear el evento SSE:', parseError, 'Data:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Maneja un evento individual del SSE
   */
  private handleSSEEvent(event: SSEEvent, callbacks: SSECallbacks): void {
    switch (event.type) {
      case ConversationMessageTypeEnum.ProcessStarted:
        callbacks.processStarted?.();
        break;

      case ConversationMessageTypeEnum.MessageStart:
        callbacks.messageStart?.();
        break;

      case ConversationMessageTypeEnum.Message:
        callbacks.message?.(event.content);
        break;

      case ConversationMessageTypeEnum.Visual:
        if (event.visual) {
          callbacks.visual?.(event.visual);
        }
        break;

      case ConversationMessageTypeEnum.MessageEnd:
        if (callbacks.messageEnd) {
          try {
            callbacks.messageEnd(event.usedContext);
          } catch (error) {
            console.error('SSE - Error in messageEnd callback:', error);
          }
        }
        break;

      case ConversationMessageTypeEnum.ProcessEnded:
        callbacks.processEnded?.();
        break;

      case ConversationMessageTypeEnum.Error:
        callbacks.error?.(event.content);
        break;

      case ConversationMessageTypeEnum.Aborted:
        callbacks.aborted?.(event.content);
        break;

      default:
    }
  }

  /**
   * Cancela la conexión SSE actual
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Verifica si hay una conexión activa
   */
  isConnected(): boolean {
    return this.abortController !== null;
  }
}

// Instancia singleton del cliente SSE
export const sseClient = new SSEClient();

