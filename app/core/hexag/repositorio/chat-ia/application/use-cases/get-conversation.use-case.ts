import type { ChatRepository } from '../../domain/ports/chat.repository';
import type { Conversation } from '../../domain/entities/chat.types';

/**
 * Caso de uso: Obtener una conversación por ID
 */
export class GetConversationUseCase {
  constructor(private readonly repository: ChatRepository) {}

  async execute(conversationId: number): Promise<Conversation> {
    return this.repository.getConversation(conversationId);
  }
}

