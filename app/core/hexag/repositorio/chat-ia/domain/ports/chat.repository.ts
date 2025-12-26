import type {
  Conversation,
  ConversationPaginationFilterDto,
  PaginationInfo,
  SSECallbacks,
} from '../domain/entities/chat.types';

/**
 * Puerto (contrato) para el repositorio de Chat IA
 */
export interface ChatRepository {
  /**
   * Obtiene las conversaciones de una sociedad con paginación
   */
  getConversations(
    structureId: string,
    filters?: ConversationPaginationFilterDto
  ): Promise<{ conversations: Conversation[]; pagination: PaginationInfo }>;

  /**
   * Obtiene una conversación por ID con sus mensajes
   */
  getConversation(conversationId: number): Promise<Conversation>;

  /**
   * Crea una nueva conversación para una carpeta personalizada
   */
  createConversation(virtualNodeId: number): Promise<Conversation>;

  /**
   * Elimina una conversación
   */
  deleteConversation(conversationId: number): Promise<void>;

  /**
   * Envía un mensaje a una conversación usando SSE
   */
  sendMessage(
    conversationId: number,
    message: string,
    callbacks: SSECallbacks
  ): Promise<void>;

  /**
   * Cancela el envío de mensaje actual
   */
  cancelMessage(): void;

  /**
   * Verifica si hay una conexión SSE activa
   */
  isMessageInProgress(): boolean;
}

