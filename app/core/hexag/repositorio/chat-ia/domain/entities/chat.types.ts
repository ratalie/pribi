/**
 * Tipos para el sistema de Chat IA
 * Basado en la implementación v2.5
 */

export enum ConversationMessageTypeEnum {
  ProcessStarted = "processStarted",
  ProcessEnded = "processEnded",
  MessageStart = "messageStart",
  Message = "message",
  MessageEnd = "messageEnd",
  Visual = "visual",
  Error = "error",
  Incomplete = "incomplete",
  Aborted = "aborted",
}

export enum ConversationMessageRoleEnum {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

export enum VisualContentType {
  Pie = "pie",
  Bars = "bars",
  Line = "line",
}

export interface VisualContent {
  type: VisualContentType;
  title: string;
  description: string;
  data: Array<{
    label: string;
    value: number;
  }>;
}

export interface UsedDocument {
  versionCode: string;
  documentCode: string;
  title: string;
}

export interface DocumentVersionWithRelevantFragments {
  versionCode: string;
  documentCode: string;
  title: string;
  mimeType: string;
  sizeInBytes: number;
  createdAt: string;
  updatedAt: string;
  relevantFragments?: Array<{
    id: number;
    index: number;
    text: string;
  }>;
}

export interface Message {
  id: number;
  type: ConversationMessageTypeEnum;
  conversationId: number;
  role: ConversationMessageRoleEnum;
  content: string;
  visual?: VisualContent | null;
  documents?: UsedDocument[] | DocumentVersionWithRelevantFragments[];
  createdAt: string;
  updatedAt: string;
  isCompleted?: boolean;
}

export interface Conversation {
  id: number;
  code: string;
  title: string;
  virtualFolderId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface SSEEvent {
  type: ConversationMessageTypeEnum;
  content: string;
  visual?: VisualContent;
  usedContext?: DocumentVersionWithRelevantFragments[];
}

export interface SSECallbacks {
  processStarted?: () => void;
  messageStart?: () => void;
  message?: (content: string) => void;
  visual?: (visual: VisualContent) => void;
  messageEnd?: (usedContext?: DocumentVersionWithRelevantFragments[]) => void;
  processEnded?: () => void;
  error?: (error: string) => void;
  aborted?: (message: string) => void;
}

export interface ConversationPaginationFilterDto {
  page?: number;
  limit?: number;
  userId?: number;
}

export interface PaginationInfo {
  currentPage: number;
  size: number;
  totalPage: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationResult<T> {
  success: boolean;
  code: number;
  pagination: PaginationInfo;
  data: T[];
}

export interface PopulateConversationResponse {
  success: boolean;
  code: number;
  message: string;
  data: Conversation;
}

export interface BaseConversationInformation {
  success: boolean;
  code: number;
  message: string;
  data: {
    id: number;
    code: string;
    title: string;
    virtualFolderId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ChatState {
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

