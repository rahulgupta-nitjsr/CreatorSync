import { Timestamp } from 'firebase/firestore'; // Only import types

// Import interfaces and function signatures
import {
  ContentItem,
  CommentItem,
  GetContentOptions,
  createContent as createContentType,
  getContent as getContentType,
  updateContent as updateContentType,
  deleteContent as deleteContentType,
  getContentList as getContentListType,
  incrementContentField as incrementContentFieldType,
  addComment as addCommentType,
  getContentComments as getContentCommentsType,
  deleteComment as deleteCommentType,
} from '@/services/firestore';

// Mock Firebase SDK modules at the top level
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  serverTimestamp: jest.fn(() => Timestamp.now()), // Keep simple mock
  Timestamp: {
      now: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 }))
  }
}));

// --- Assign mocks to variables AFTER jest.mock ---
// Need to require the mocked module here to get the mock functions
const firestoreMocks = require('firebase/firestore');
const mockCollection: jest.Mock = firestoreMocks.collection;
const mockDoc: jest.Mock = firestoreMocks.doc;
const mockAddDoc: jest.Mock = firestoreMocks.addDoc;
const mockGetDoc: jest.Mock = firestoreMocks.getDoc;
const mockGetDocs: jest.Mock = firestoreMocks.getDocs;
const mockUpdateDoc: jest.Mock = firestoreMocks.updateDoc;
const mockDeleteDoc: jest.Mock = firestoreMocks.deleteDoc;
const mockQuery: jest.Mock = firestoreMocks.query;
const mockWhere: jest.Mock = firestoreMocks.where;
const mockOrderBy: jest.Mock = firestoreMocks.orderBy;
const mockLimit: jest.Mock = firestoreMocks.limit;
const mockServerTimestamp: jest.Mock = firestoreMocks.serverTimestamp;

// Declare variables for mock instances and service functions
let mockDbInstance: {};
let createContent: typeof createContentType;
let getContent: typeof getContentType;
let updateContent: typeof updateContentType;
let deleteContent: typeof deleteContentType;
let getContentList: typeof getContentListType;
let incrementContentField: typeof incrementContentFieldType;
let addComment: typeof addCommentType;
let getContentComments: typeof getContentCommentsType;
let deleteComment: typeof deleteCommentType;

describe('Service: FirestoreService', () => {

  beforeAll(async () => {
    // Initialize mock DB instance
    mockDbInstance = {}; // Basic Firestore DB mock

    // Mock config using doMock (needs to be inside beforeAll/beforeEach)
    jest.doMock('@/firebase/config', () => ({
      db: mockDbInstance,
    }));

    // --- Dynamically import the service functions *after* mocks are set up ---
    // Service import needs to happen after jest.doMock completes
    const service = await import('@/services/firestore');
    createContent = service.createContent;
    getContent = service.getContent;
    updateContent = service.updateContent;
    deleteContent = service.deleteContent;
    getContentList = service.getContentList;
    incrementContentField = service.incrementContentField;
    addComment = service.addComment;
    getContentComments = service.getContentComments;
    deleteComment = service.deleteComment;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset timestamp mock if needed
    mockServerTimestamp.mockImplementation(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 }));
  });

  // --- Content Tests ---
  describe('createContent', () => {
    it('should call addDoc with correct data and return doc id', async () => {
      // Arrange
      const contentData: ContentItem = {
        title: 'Test Content',
        description: 'Test Description',
        contentType: 'article',
        tags: ['test', 'jest'],
        isPremium: false,
        status: 'draft',
        authorId: 'user123',
        // views, likes, comments, createdAt, updatedAt are set by the service
        views: 0, // Added default values as per interface, though service overwrites
        likes: 0,
        comments: 0
      };
      const mockCollectionRef = { id: 'contentCollection' }; // Mock collection ref object
      const mockDocRef = { id: 'newDocId123' }; // Mock document ref object
      const mockTimestamp = { seconds: 1678886400, nanoseconds: 0 }; // Fixed timestamp for testing

      mockCollection.mockReturnValue(mockCollectionRef);
      mockAddDoc.mockResolvedValue(mockDocRef);
      mockServerTimestamp.mockReturnValue(mockTimestamp);

      // Act
      const result = await createContent(contentData);

      // Assert
      expect(mockCollection).toHaveBeenCalledWith(mockDbInstance, 'content');
      expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, {
        ...contentData, // Original data passed
        views: 0,       // Default values set by service
        likes: 0,
        comments: 0,
        createdAt: mockTimestamp, // Mocked server timestamp
        updatedAt: mockTimestamp, // Mocked server timestamp
      });
      expect(result).toBe(mockDocRef.id);
    });

    it('should throw error if addDoc fails', async () => {
      // Arrange
      const contentData: ContentItem = { /* ... provide necessary data ... */ } as ContentItem; // Simplified for error test
      const error = new Error('Firestore addDoc error');
      const mockCollectionRef = { id: 'contentCollection' };

      mockCollection.mockReturnValue(mockCollectionRef);
      mockAddDoc.mockRejectedValue(error);

      // Act & Assert
      await expect(createContent(contentData)).rejects.toThrow(error);
      expect(mockCollection).toHaveBeenCalledWith(mockDbInstance, 'content');
      expect(mockAddDoc).toHaveBeenCalled(); // Ensure it was called
    });
  });

  describe('getContent', () => {
    it('should call getDoc and return content if exists', async () => {
      // Arrange
      const contentId = 'existingDoc123';
      const mockDocRef = { id: contentId }; // Mock doc ref
      const mockDocData = {
        title: 'Fetched Content', 
        description: 'Description...',
        // ... other fields
      };
      const mockDocSnap = {
        exists: () => true,
        id: contentId,
        data: () => mockDocData,
      };

      mockDoc.mockReturnValue(mockDocRef);
      mockGetDoc.mockResolvedValue(mockDocSnap);

      // Act
      const result = await getContent(contentId);

      // Assert
      expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'content', contentId);
      expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toEqual({ id: contentId, ...mockDocData });
    });

    it('should return null if content does not exist', async () => {
      // Arrange
      const contentId = 'nonExistingDoc456';
      const mockDocRef = { id: contentId };
      const mockDocSnap = {
        exists: () => false,
      };

      mockDoc.mockReturnValue(mockDocRef);
      mockGetDoc.mockResolvedValue(mockDocSnap);

      // Act
      const result = await getContent(contentId);

      // Assert
      expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'content', contentId);
      expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toBeNull();
    });

    it('should throw error if getDoc fails', async () => {
      // Arrange
      const contentId = 'errorDoc789';
      const mockDocRef = { id: contentId };
      const error = new Error('Firestore getDoc error');

      mockDoc.mockReturnValue(mockDocRef);
      mockGetDoc.mockRejectedValue(error);

      // Act & Assert
      await expect(getContent(contentId)).rejects.toThrow(error);
      expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'content', contentId);
      expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
    });
  });

  describe('updateContent', () => {
    it('should call updateDoc with correct data', async () => {
      // Arrange
      const contentId = 'updateDoc123';
      const updateData: Partial<ContentItem> = {
        title: 'Updated Title',
        status: 'published',
      };
      const mockDocRef = { id: contentId }; // Mock doc ref
      const mockTimestamp = { seconds: 1678886401, nanoseconds: 0 }; // Fixed timestamp

      mockDoc.mockReturnValue(mockDocRef);
      mockUpdateDoc.mockResolvedValue(undefined);
      mockServerTimestamp.mockReturnValue(mockTimestamp);

      // Act
      await updateContent(contentId, updateData);

      // Assert
      expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'content', contentId);
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
        ...updateData,
        updatedAt: mockTimestamp, // Ensure updatedAt is added
      });
    });

    it('should throw error if updateDoc fails', async () => {
      // Arrange
      const contentId = 'updateFailDoc456';
      const updateData: Partial<ContentItem> = { title: 'Fail Update' };
      const mockDocRef = { id: contentId };
      const error = new Error('Firestore updateDoc error');

      mockDoc.mockReturnValue(mockDocRef);
      mockUpdateDoc.mockRejectedValue(error);
      // No need to mock timestamp here as it won't be reached

      // Act & Assert
      await expect(updateContent(contentId, updateData)).rejects.toThrow(error);
      expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'content', contentId);
      expect(mockUpdateDoc).toHaveBeenCalled(); // Ensure it was called
    });
  });

  describe('deleteContent', () => {
    it('should call deleteDoc with correct ref', async () => {
      // Arrange
      const contentId = 'deleteDoc123';
      const mockDocRef = { id: contentId }; // Mock doc ref

      mockDoc.mockReturnValue(mockDocRef);
      mockDeleteDoc.mockResolvedValue(undefined);

      // Act
      await deleteContent(contentId);

      // Assert
      expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'content', contentId);
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('should throw error if deleteDoc fails', async () => {
      // Arrange
      const contentId = 'deleteFailDoc456';
      const mockDocRef = { id: contentId };
      const error = new Error('Firestore deleteDoc error');

      mockDoc.mockReturnValue(mockDocRef);
      mockDeleteDoc.mockRejectedValue(error);

      // Act & Assert
      await expect(deleteContent(contentId)).rejects.toThrow(error);
      expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'content', contentId);
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockDocRef); // Ensure it was called with correct ref
    });
  });

  describe('getContentList', () => {
    // Helper to mock getDocs response
    const mockGetDocsResponse = (docs: any[]) => ({
      forEach: (callback: (doc: any) => void) => docs.forEach(callback),
      docs: docs, // Include docs array if needed elsewhere
      empty: docs.length === 0,
      size: docs.length,
    });
    
    const mockContentCollectionRef = { id: 'contentCollection' };
    const mockQueryRef = { id: 'queryRef' }; // Represent the query object

    beforeEach(() => {
        // Reset mocks specific to this describe block if needed
        mockCollection.mockReturnValue(mockContentCollectionRef);
        mockQuery.mockReturnValue(mockQueryRef); // query() returns a representation
        mockWhere.mockImplementation((field, op, value) => ({ field, op, value, type: 'where' })); // Return constraint representation
        mockOrderBy.mockImplementation((field, dir) => ({ field, dir, type: 'orderBy' }));
        mockLimit.mockImplementation((num) => ({ num, type: 'limit' }));
    });

    it('should call getDocs with default query options', async () => {
      // Arrange
      const mockDocs = [
        { id: 'doc1', data: () => ({ title: 'Doc 1' }) },
        { id: 'doc2', data: () => ({ title: 'Doc 2' }) },
      ];
      mockGetDocs.mockResolvedValue(mockGetDocsResponse(mockDocs));

      // Act
      const result = await getContentList();

      // Assert
      expect(mockCollection).toHaveBeenCalledWith(mockDbInstance, 'content');
      expect(mockQuery).toHaveBeenCalledWith(
        mockContentCollectionRef,
        expect.objectContaining({ field: 'createdAt', dir: 'desc', type: 'orderBy' }), // Default sort
        expect.objectContaining({ num: 20, type: 'limit' }) // Default limit
      );
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 'doc1', title: 'Doc 1' });
      expect(result[1]).toEqual({ id: 'doc2', title: 'Doc 2' });
    });

    it('should build query with provided filters (authorId, contentType, status, isPremium)', async () => {
      // Arrange
      const options: GetContentOptions = {
        authorId: 'author1',
        contentType: 'video',
        status: 'published',
        isPremium: true,
      };
      mockGetDocs.mockResolvedValue(mockGetDocsResponse([])); // Empty response for simplicity

      // Act
      await getContentList(options);

      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        mockContentCollectionRef,
        expect.objectContaining({ field: 'authorId', op: '==', value: 'author1', type: 'where' }),
        expect.objectContaining({ field: 'contentType', op: '==', value: 'video', type: 'where' }),
        expect.objectContaining({ field: 'status', op: '==', value: 'published', type: 'where' }),
        expect.objectContaining({ field: 'isPremium', op: '==', value: true, type: 'where' }),
        expect.objectContaining({ field: 'createdAt', dir: 'desc', type: 'orderBy' }), // Default sort
        expect.objectContaining({ num: 20, type: 'limit' }) // Default limit
      );
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);
    });

    it('should build query with sorting and limit', async () => {
      // Arrange
      const options: GetContentOptions = {
        sortBy: 'views',
        sortDirection: 'asc',
        limitCount: 5,
      };
      mockGetDocs.mockResolvedValue(mockGetDocsResponse([]));

      // Act
      await getContentList(options);

      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        mockContentCollectionRef,
        expect.objectContaining({ field: 'views', dir: 'asc', type: 'orderBy' }),
        expect.objectContaining({ num: 5, type: 'limit' })
      );
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);
    });

    it('should handle single tag filter', async () => {
      // Arrange
      const options: GetContentOptions = { tags: ['tech'] };
      mockGetDocs.mockResolvedValue(mockGetDocsResponse([]));

      // Act
      await getContentList(options);

      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        mockContentCollectionRef,
        expect.objectContaining({ field: 'tags', op: 'array-contains', value: 'tech', type: 'where' }),
        expect.objectContaining({ field: 'createdAt', dir: 'desc', type: 'orderBy' }),
        expect.objectContaining({ num: 20, type: 'limit' })
      );
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);
    });

    it('should handle multi-tag filter client-side', async () => {
      // Arrange
      const options: GetContentOptions = { tags: ['tech', 'ai'] };
      const mockDocs = [
        { id: 'doc1', data: () => ({ title: 'Doc 1', tags: ['tech', 'ai'] }) }, // Matches both
        { id: 'doc2', data: () => ({ title: 'Doc 2', tags: ['tech'] }) },      // Matches first tag only
        { id: 'doc3', data: () => ({ title: 'Doc 3', tags: ['tech', 'ai', 'ml'] }) }, // Matches both
      ];
      // getDocs is called with only the *first* tag filter
      mockGetDocs.mockResolvedValue(mockGetDocsResponse(mockDocs)); 

      // Act
      const result = await getContentList(options);

      // Assert
      // Check Firestore query was called with the first tag
      expect(mockQuery).toHaveBeenCalledWith(
        mockContentCollectionRef,
        expect.objectContaining({ field: 'tags', op: 'array-contains', value: 'tech', type: 'where' }),
        expect.objectContaining({ field: 'createdAt', dir: 'desc', type: 'orderBy' }),
        expect.objectContaining({ num: 20, type: 'limit' })
      );
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);
      // Check client-side filtering result
      expect(result).toHaveLength(2);
      expect(result.map(d => d.id)).toEqual(['doc1', 'doc3']);
    });

     it('should throw error if getDocs fails', async () => {
      // Arrange
      const error = new Error('Firestore getDocs error');
      mockGetDocs.mockRejectedValue(error);

      // Act & Assert
      await expect(getContentList()).rejects.toThrow(error);
      expect(mockQuery).toHaveBeenCalled(); // Query should have been built
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);
    });
  });
  
  describe('incrementContentField', () => {
    // Note: Firestore SDK v9 doesn't have `increment` directly. 
    // The service uses a local helper. We need to check if updateDoc is called correctly.
    it('should call updateDoc with the increment structure for views', async () => {
        // Arrange
        const contentId = 'incDoc123';
        const fieldToIncrement = 'views';
        const mockDocRef = { id: contentId };
        const mockTimestamp = { seconds: 1678886402, nanoseconds: 0 };

        mockDoc.mockReturnValue(mockDocRef);
        mockUpdateDoc.mockResolvedValue(undefined);
        mockServerTimestamp.mockReturnValue(mockTimestamp);

        // Act
        await incrementContentField(contentId, fieldToIncrement);

        // Assert
        expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'content', contentId);
        // Need to check the structure passed to updateDoc
        expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
          [fieldToIncrement]: { __op: 'increment', __amount: 1 }, // Check the custom increment structure
          updatedAt: mockTimestamp,
        });
    });

    it('should throw error if updateDoc fails during increment', async () => {
        // Arrange
        const contentId = 'incFailDoc456';
        const fieldToIncrement = 'likes';
        const mockDocRef = { id: contentId };
        const error = new Error('Firestore updateDoc increment error');

        mockDoc.mockReturnValue(mockDocRef);
        mockUpdateDoc.mockRejectedValue(error);

        // Act & Assert
        await expect(incrementContentField(contentId, fieldToIncrement)).rejects.toThrow(error);
        expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'content', contentId);
        expect(mockUpdateDoc).toHaveBeenCalled(); // Ensure it was called
    });
  });

  // --- Comment Tests ---
  describe('addComment', () => {
    it('should call addDoc, increment field, and return comment id', async () => {
      // Arrange
      const commentData: CommentItem = {
        contentId: 'content123',
        authorId: 'user456',
        authorName: 'Commenter',
        text: 'Nice content!',
      };
      const mockCommentCollectionRef = { id: 'commentsCollection' };
      const mockContentDocRef = { id: commentData.contentId };
      const mockCommentDocRef = { id: 'newCommentId789' };
      const mockTimestamp = { seconds: 1678886403, nanoseconds: 0 };

      mockCollection.mockReturnValue(mockCommentCollectionRef);
      mockAddDoc.mockResolvedValue(mockCommentDocRef);
      mockServerTimestamp.mockReturnValue(mockTimestamp);
      mockDoc.mockImplementation((db, collection, id) => {
          if (collection === 'content') return mockContentDocRef;
          if (collection === 'comments') return { id: 'dummyCommentRef' }; // Ref for the potential comment doc (not used in add)
          return { id: 'unknownRef' };
      });
      mockUpdateDoc.mockResolvedValue(undefined); // For increment call

      // Act
      const result = await addComment(commentData);

      // Assert
      // 1. Check comment creation
      expect(mockCollection).toHaveBeenCalledWith(mockDbInstance, 'comments');
      expect(mockAddDoc).toHaveBeenCalledWith(mockCommentCollectionRef, {
        ...commentData,
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      });
      // 2. Check content increment call
      expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'content', commentData.contentId);
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockContentDocRef, {
        comments: { __op: 'increment', __amount: 1 },
        updatedAt: mockTimestamp,
      });
      // 3. Check result
      expect(result).toBe(mockCommentDocRef.id);
    });

    it('should throw error if addDoc fails (and not increment)', async () => {
      // Arrange
      const commentData: CommentItem = { /* ... */ } as CommentItem;
      const error = new Error('Firestore addComment error');
      const mockCommentCollectionRef = { id: 'commentsCollection' };

      mockCollection.mockReturnValue(mockCommentCollectionRef);
      mockAddDoc.mockRejectedValue(error);

      // Act & Assert
      await expect(addComment(commentData)).rejects.toThrow(error);
      expect(mockAddDoc).toHaveBeenCalled();
      expect(mockUpdateDoc).not.toHaveBeenCalled(); // Ensure increment wasn't called
    });
    
    it('should throw error if increment fails (after addDoc succeeds)', async () => {
        // Arrange
        const commentData: CommentItem = { contentId: 'c1', authorId: 'u1', authorName: 'N', text: 'T' };
        const mockCommentCollectionRef = { id: 'commentsCollection' };
        const mockContentDocRef = { id: commentData.contentId };
        const mockCommentDocRef = { id: 'newCommentId789' };
        const incrementError = new Error('Firestore increment error');
        
        mockCollection.mockReturnValue(mockCommentCollectionRef);
        mockAddDoc.mockResolvedValue(mockCommentDocRef);
        mockDoc.mockReturnValue(mockContentDocRef);
        mockUpdateDoc.mockRejectedValue(incrementError);
        mockServerTimestamp.mockReturnValue({ seconds: 1, nanoseconds: 0 });
        
        // Act & Assert
        // The service catches the increment error and re-throws it
        await expect(addComment(commentData)).rejects.toThrow(incrementError);
        expect(mockAddDoc).toHaveBeenCalled(); // Add should have been called
        expect(mockUpdateDoc).toHaveBeenCalled(); // Update (increment) should have been called
    });
  });

  describe('getContentComments', () => {
    // Use the helper defined in getContentList tests
    const mockGetDocsResponse = (docs: any[]) => ({
      forEach: (callback: (doc: any) => void) => docs.forEach(callback),
      docs: docs, empty: docs.length === 0, size: docs.length,
    });
    const mockCommentsCollectionRef = { id: 'commentsCollection' };
    const mockQueryRef = { id: 'commentsQueryRef' };

    beforeEach(() => {
        mockCollection.mockReturnValue(mockCommentsCollectionRef);
        mockQuery.mockReturnValue(mockQueryRef); 
        mockWhere.mockImplementation((field, op, value) => ({ field, op, value, type: 'where' })); 
        mockOrderBy.mockImplementation((field, dir) => ({ field, dir, type: 'orderBy' }));
        mockLimit.mockImplementation((num) => ({ num, type: 'limit' }));
    });

    it('should call getDocs with correct query constraints', async () => {
      // Arrange
      const contentId = 'content123';
      const limitCount = 10;
      const mockComments = [
        { id: 'comment1', data: () => ({ text: 'Comment 1' }) },
        { id: 'comment2', data: () => ({ text: 'Comment 2' }) },
      ];
      mockGetDocs.mockResolvedValue(mockGetDocsResponse(mockComments));

      // Act
      const result = await getContentComments(contentId, limitCount);

      // Assert
      expect(mockCollection).toHaveBeenCalledWith(mockDbInstance, 'comments');
      expect(mockQuery).toHaveBeenCalledWith(
        mockCommentsCollectionRef,
        expect.objectContaining({ field: 'contentId', op: '==', value: contentId, type: 'where' }),
        expect.objectContaining({ field: 'createdAt', dir: 'desc', type: 'orderBy' }),
        expect.objectContaining({ num: limitCount, type: 'limit' })
      );
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 'comment1', text: 'Comment 1' });
    });

    it('should use default limit if not provided', async () => {
      // Arrange
      const contentId = 'content456';
      mockGetDocs.mockResolvedValue(mockGetDocsResponse([]));

      // Act
      await getContentComments(contentId); // No limit specified

      // Assert
      expect(mockQuery).toHaveBeenCalledWith(
        mockCommentsCollectionRef,
        expect.objectContaining({ field: 'contentId', op: '==', value: contentId, type: 'where' }),
        expect.objectContaining({ field: 'createdAt', dir: 'desc', type: 'orderBy' }),
        expect.objectContaining({ num: 20, type: 'limit' }) // Check default limit = 20
      );
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);
    });

    it('should throw error if getDocs fails', async () => {
      // Arrange
      const contentId = 'contentFail789';
      const error = new Error('Firestore getComments error');
      mockGetDocs.mockRejectedValue(error);

      // Act & Assert
      await expect(getContentComments(contentId)).rejects.toThrow(error);
      expect(mockQuery).toHaveBeenCalled();
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);
    });
  });

  describe('deleteComment', () => {
    it('should call deleteDoc and decrement comment count', async () => {
      // Arrange
      const commentId = 'commentToDelete123';
      const contentId = 'contentWithComment123';
      const mockCommentDocRef = { id: commentId };
      const mockContentDocRef = { id: contentId };
      const mockTimestamp = { seconds: 1678886404, nanoseconds: 0 };

      // Need to mock doc() to return different refs based on collection
      mockDoc.mockImplementation((db, collection, id) => {
        if (collection === 'comments') return mockCommentDocRef;
        if (collection === 'content') return mockContentDocRef;
        return { id: 'unknownRef' };
      });
      mockDeleteDoc.mockResolvedValue(undefined);
      mockUpdateDoc.mockResolvedValue(undefined); // For decrement
      mockServerTimestamp.mockReturnValue(mockTimestamp);

      // Act
      await deleteComment(commentId, contentId);

      // Assert
      // 1. Check comment deletion
      expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'comments', commentId);
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockCommentDocRef);
      // 2. Check content decrement
      expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'content', contentId);
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockContentDocRef, {
        comments: { __op: 'increment', __amount: -1 }, // Check decrement structure
        updatedAt: mockTimestamp,
      });
    });

    it('should throw error if deleteDoc fails (and not decrement)', async () => {
      // Arrange
      const commentId = 'deleteFail456';
      const contentId = 'contentStillHasComment456';
      const mockCommentDocRef = { id: commentId };
      const error = new Error('Firestore deleteComment error');

      mockDoc.mockImplementation((db, collection, id) => {
          if (collection === 'comments') return mockCommentDocRef;
          return { id: 'otherRef' };
      });
      mockDeleteDoc.mockRejectedValue(error);

      // Act & Assert
      await expect(deleteComment(commentId, contentId)).rejects.toThrow(error);
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockCommentDocRef);
      expect(mockUpdateDoc).not.toHaveBeenCalled(); // Ensure decrement wasn't called
    });
    
    it('should throw error if decrement fails (after deleteDoc succeeds)', async () => {
        // Arrange
        const commentId = 'deleteSuccess789';
        const contentId = 'decrementFail789';
        const mockCommentDocRef = { id: commentId };
        const mockContentDocRef = { id: contentId };
        const decrementError = new Error('Firestore decrement error');
        
        mockDoc.mockImplementation((db, collection, id) => {
            if (collection === 'comments') return mockCommentDocRef;
            if (collection === 'content') return mockContentDocRef;
            return { id: 'unknownRef' };
        });
        mockDeleteDoc.mockResolvedValue(undefined); // Delete succeeds
        mockUpdateDoc.mockRejectedValue(decrementError); // Decrement fails
        mockServerTimestamp.mockReturnValue({ seconds: 1, nanoseconds: 0 });
        
        // Act & Assert
        await expect(deleteComment(commentId, contentId)).rejects.toThrow(decrementError);
        expect(mockDeleteDoc).toHaveBeenCalledWith(mockCommentDocRef);
        expect(mockUpdateDoc).toHaveBeenCalled(); // Decrement should have been called
    });
  });

}); 