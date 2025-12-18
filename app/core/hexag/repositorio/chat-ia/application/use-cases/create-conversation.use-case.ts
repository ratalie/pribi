import type { ChatRepository } from '../../domain/ports/chat.repository';
import type { Conversation } from '../../domain/entities/chat.types';

/**
 * Caso de uso: Crear una nueva conversación
 */
export class CreateConversationUseCase {
  constructor(private readonly repository: ChatRepository) {}

  async execute(virtualNodeId: number): Promise<Conversation> {
    return this.repository.createConversation(virtualNodeId);
  }
}

