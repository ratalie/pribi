import type { ChatRepository } from '../../domain/ports/chat.repository';
import type {
  Conversation,
  ConversationPaginationFilterDto,
  PaginationInfo,
} from '../../domain/entities/chat.types';

/**
 * Caso de uso: Obtener conversaciones de una sociedad
 */
export class GetConversationsUseCase {
  constructor(private readonly repository: ChatRepository) {}

  async execute(
    structureId: string,
    filters?: ConversationPaginationFilterDto
  ): Promise<{ conversations: Conversation[]; pagination: PaginationInfo }> {
    return this.repository.getConversations(structureId, filters);
  }
}

