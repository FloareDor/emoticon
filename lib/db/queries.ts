import 'server-only';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  type SQL,
} from 'drizzle-orm';

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  message,
  vote,
  type DBMessage,
  type Chat,
} from './schema';
import type { ArtifactKind } from '@/components/artifact';

// MOCK DATA FOR DEVELOPMENT
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    password: hashSync('password123', genSaltSync(10)),
    createdAt: new Date(),
  }
];

const mockChats: Chat[] = [];
const mockMessages: DBMessage[] = [];
const mockDocuments: any[] = [];
const mockSuggestions: Suggestion[] = [];
const mockVotes: any[] = [];

// Mock database functions
export async function getUser(email: string): Promise<Array<User>> {
  try {
    return mockUsers.filter(u => u.email === email);
  } catch (error) {
    console.error('Failed to get user from mock database');
    return [];
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email,
      password: hash,
      createdAt: new Date(),
    };
    mockUsers.push(newUser);
    return newUser;
  } catch (error) {
    console.error('Failed to create user in mock database');
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    const newChat: Chat = {
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility: 'private',
    };
    mockChats.push(newChat);
    return newChat;
  } catch (error) {
    console.error('Failed to save chat in mock database');
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    const index = mockChats.findIndex(c => c.id === id);
    if (index !== -1) {
      mockChats.splice(index, 1);
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to delete chat by id from mock database');
    throw error;
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;

    const query = (whereCondition?: (chat: Chat) => boolean) =>
      mockChats
        .filter(c => c.userId === id && (!whereCondition || whereCondition(c)))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, extendedLimit);

    let filteredChats: Array<Chat> = [];

    if (startingAfter) {
      const [selectedChat] = mockChats.filter(c => c.id === startingAfter);

      if (!selectedChat) {
        throw new Error(`Chat with id ${startingAfter} not found`);
      }

      filteredChats = query(c => c.createdAt > selectedChat.createdAt);
    } else if (endingBefore) {
      const [selectedChat] = mockChats.filter(c => c.id === endingBefore);

      if (!selectedChat) {
        throw new Error(`Chat with id ${endingBefore} not found`);
      }

      filteredChats = query(c => c.createdAt < selectedChat.createdAt);
    } else {
      filteredChats = query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    console.error('Failed to get chats by user from mock database');
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const selectedChat = mockChats.find(c => c.id === id);
    if (!selectedChat) {
      throw new Error(`Chat with id ${id} not found`);
    }
    return selectedChat;
  } catch (error) {
    console.error('Failed to get chat by id from mock database');
    throw error;
  }
}

export async function saveMessages({
  messages,
}: {
  messages: Array<DBMessage>;
}) {
  try {
    mockMessages.push(...messages);
    return messages;
  } catch (error) {
    console.error('Failed to save messages in mock database', error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return mockMessages.filter(m => m.chatId === id).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } catch (error) {
    console.error('Failed to get messages by chat id from mock database', error);
    throw error;
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    const existingVote = mockVotes.find(v => v.messageId === messageId && v.chatId === chatId);

    if (existingVote) {
      existingVote.isUpvoted = type === 'up';
    } else {
      mockVotes.push({
        chatId,
        messageId,
        isUpvoted: type === 'up',
      });
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to upvote message in mock database', error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return mockVotes.filter(v => v.chatId === id);
  } catch (error) {
    console.error('Failed to get votes by chat id from mock database', error);
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    const newDocument: any = {
      id,
      title,
      kind,
      content,
      userId,
      createdAt: new Date(),
    };
    mockDocuments.push(newDocument);
    return newDocument;
  } catch (error) {
    console.error('Failed to save document in mock database');
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    return mockDocuments.filter(d => d.id === id).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } catch (error) {
    console.error('Failed to get document by id from mock database');
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const selectedDocument = mockDocuments.find(d => d.id === id);
    if (!selectedDocument) {
      throw new Error(`Document with id ${id} not found`);
    }
    return selectedDocument;
  } catch (error) {
    console.error('Failed to get document by id from mock database');
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    mockDocuments.filter(d => d.id === id && d.createdAt > timestamp).forEach(d => {
      mockDocuments.splice(mockDocuments.indexOf(d), 1);
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete documents by id after timestamp from mock database');
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    mockSuggestions.push(...suggestions);
    return suggestions;
  } catch (error) {
    console.error('Failed to save suggestions in mock database');
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return mockSuggestions.filter(s => s.documentId === documentId);
  } catch (error) {
    console.error('Failed to get suggestions by document version from mock database');
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    const selectedMessage = mockMessages.find(m => m.id === id);
    if (!selectedMessage) {
      throw new Error(`Message with id ${id} not found`);
    }
    return selectedMessage;
  } catch (error) {
    console.error('Failed to get message by id from mock database');
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    mockMessages.filter(m => m.chatId === chatId && m.createdAt > timestamp).forEach(m => {
      mockMessages.splice(mockMessages.indexOf(m), 1);
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete messages by id after timestamp from mock database');
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    const selectedChat = mockChats.find(c => c.id === chatId);
    if (!selectedChat) {
      throw new Error(`Chat with id ${chatId} not found`);
    }
    selectedChat.visibility = visibility;
    return selectedChat;
  } catch (error) {
    console.error('Failed to update chat visibility in mock database');
    throw error;
  }
}
