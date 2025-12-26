import type { ChatRepository } from '../../domain/ports/chat.repository';
import type { SSECallbacks } from '../../domain/entities/chat.types';

/**
 * Caso de uso: Enviar un mensaje a una conversación
 */
export class SendMessageUseCase {
  constructor(private readonly repository: ChatRepository) {}

  async execute(
    conversationId: number,
    message: string,
    callbacks: SSECallbacks
  ): Promise<void> {
    return this.repository.sendMessage(conversationId, message, callbacks);
  }
}

