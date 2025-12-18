import type { ChatRepository } from '../../domain/ports/chat.repository';

/**
 * Caso de uso: Eliminar una conversación
 */
export class DeleteConversationUseCase {
  constructor(private readonly repository: ChatRepository) {}

  async execute(conversationId: number): Promise<void> {
    return this.repository.deleteConversation(conversationId);
  }
}

