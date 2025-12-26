import type { ChatRepository } from '../../domain/ports/chat.repository';
import type {
  Conversation,
  ConversationPaginationFilterDto,
  PaginationInfo,
  PaginationResult,
  PopulateConversationResponse,
  BaseConversationInformation,
  SSECallbacks,
} from '../../domain/entities/chat.types';
import { withAuthHeaders } from '~/lib/api-client';
import { sseClient } from '../services/sse-client.service';

/**
 * Repositorio HTTP para Chat IA
 * Adaptado de v2.5 para Nuxt 4
 */
export class ChatHttpRepository implements ChatRepository {
  async getConversations(
    structureId: string,
    filters: ConversationPaginationFilterDto = {}
  ): Promise<{ conversations: Conversation[]; pagination: PaginationInfo }> {
    try {
      // Construir parámetros de query
      const queryParams: string[] = [];
      const page = Number(filters.page) || 1;
      const limit = Number(filters.limit) || 10;

      queryParams.push(`page=${page}`);
      queryParams.push(`limit=${limit}`);

      if (filters.userId) {
        queryParams.push(`userId=${filters.userId}`);
      }

      const url = `/api/v2/repository/society-profile/${structureId}/conversations?${queryParams.join('&')}`;

      const response = await $fetch<PaginationResult<Conversation>>(url, {
        ...withAuthHeaders(),
        method: 'GET' as const,
      });

      return {
        conversations: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error('Error al obtener conversaciones:', error);
      throw new Error('Error al obtener las conversaciones');
    }
  }

  async getConversation(conversationId: number): Promise<Conversation> {
    try {
      const response = await $fetch<{
        success: boolean;
        code: number;
        message: string;
        data: Conversation;
      }>(
        `/api/v2/repository/society-profile/conversations/${conversationId}`,
        {
          ...withAuthHeaders(),
          method: 'GET' as const,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al obtener la conversación:', error);
      throw new Error('Error al obtener la conversación');
    }
  }

  async createConversation(virtualNodeId: number): Promise<Conversation> {
    try {
      const response = await $fetch<{
        success: boolean;
        code: number;
        message: string;
        data: Conversation;
      }>(
        `/api/v2/repository/society-profile/conversations/virtual-nodes/${virtualNodeId}`,
        {
          ...withAuthHeaders(),
          method: 'POST' as const,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al crear la conversación:', error);
      throw new Error('Error al crear la conversación');
    }
  }

  async deleteConversation(conversationId: number): Promise<void> {
    try {
      await $fetch(`/api/v2/repository/society-profile/conversations/${conversationId}`, {
        ...withAuthHeaders(),
        method: 'DELETE' as const,
      });
    } catch (error) {
      console.error('Error al eliminar la conversación:', error);
      throw new Error('Error al eliminar la conversación');
    }
  }

  async sendMessage(
    conversationId: number,
    message: string,
    callbacks: SSECallbacks
  ): Promise<void> {
    await sseClient.sendMessage(conversationId, message, callbacks);
  }

  cancelMessage(): void {
    sseClient.abort();
  }

  isMessageInProgress(): boolean {
    return sseClient.isConnected();
  }
}

