import { Timestamp } from 'firebase/firestore'; // Needed for mocks

// Import interfaces and function signatures
import {
    Notification,
    createNotification as createNotificationType,
    getUserNotifications as getUserNotificationsType,
    markNotificationAsRead as markNotificationAsReadType,
    markAllNotificationsAsRead as markAllNotificationsAsReadType,
    deleteNotification as deleteNotificationType,
    countUnreadNotifications as countUnreadNotificationsType,
    subscribeToNotifications as subscribeToNotificationsType,
} from '@/services/notifications';

// Mock Firebase SDK modules at the top level
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
  Timestamp: {
      now: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 }))
  }
}));

// --- Assign mocks to variables AFTER jest.mock ---
const firestoreMocks = require('firebase/firestore');
const mockCollection: jest.Mock = firestoreMocks.collection;
const mockAddDoc: jest.Mock = firestoreMocks.addDoc;
const mockQuery: jest.Mock = firestoreMocks.query;
const mockWhere: jest.Mock = firestoreMocks.where;
const mockOrderBy: jest.Mock = firestoreMocks.orderBy;
const mockGetDocs: jest.Mock = firestoreMocks.getDocs;
const mockDoc: jest.Mock = firestoreMocks.doc;
const mockUpdateDoc: jest.Mock = firestoreMocks.updateDoc;
const mockDeleteDoc: jest.Mock = firestoreMocks.deleteDoc;
const mockLimit: jest.Mock = firestoreMocks.limit;
const mockOnSnapshot: jest.Mock = firestoreMocks.onSnapshot;
const mockTimestampNow: jest.Mock = firestoreMocks.Timestamp.now;

// Declare variables for mock instances and service functions
let mockDbInstance: {};
let createNotification: typeof createNotificationType;
let getUserNotifications: typeof getUserNotificationsType;
let markNotificationAsRead: typeof markNotificationAsReadType;
let markAllNotificationsAsRead: typeof markAllNotificationsAsReadType;
let deleteNotification: typeof deleteNotificationType;
let countUnreadNotifications: typeof countUnreadNotificationsType;
let subscribeToNotifications: typeof subscribeToNotificationsType;

describe('Service: NotificationService', () => {

  beforeAll(async () => {
    mockDbInstance = {}; // Basic Firestore DB mock

    jest.doMock('@/firebase/config', () => ({
      db: mockDbInstance,
    }));

    const service = await import('@/services/notifications');
    createNotification = service.createNotification;
    getUserNotifications = service.getUserNotifications;
    markNotificationAsRead = service.markNotificationAsRead;
    markAllNotificationsAsRead = service.markAllNotificationsAsRead;
    deleteNotification = service.deleteNotification;
    countUnreadNotifications = service.countUnreadNotifications;
    subscribeToNotifications = service.subscribeToNotifications;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockTimestampNow.mockImplementation(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 }));
  });

  describe('createNotification', () => {
    it('should call addDoc with correct data and return doc id', async () => {
      const notificationInput: Omit<Notification, 'id' | 'createdAt' | 'read'> = {
        userId: 'user1',
        type: 'like',
        message: 'Someone liked your post',
        contentId: 'post1',
        sourceUserId: 'user2',
      };
      const mockCollectionRef = { id: 'notificationsCollection' };
      const mockDocRef = { id: 'newNotificationId' };
      const mockTimestamp = { seconds: 1678886405, nanoseconds: 0 };

      mockCollection.mockReturnValue(mockCollectionRef);
      mockAddDoc.mockResolvedValue(mockDocRef);
      mockTimestampNow.mockReturnValue(mockTimestamp);

      const result = await createNotification(notificationInput);

      expect(mockCollection).toHaveBeenCalledWith(mockDbInstance, 'notifications');
      expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, {
        ...notificationInput,
        read: false,
        createdAt: mockTimestamp,
      });
      expect(result).toBe(mockDocRef.id);
    });

    it('should throw error if addDoc fails', async () => {
      const notificationInput: Omit<Notification, 'id' | 'createdAt' | 'read'> = { /* ... */ } as any;
      const error = new Error('Firestore addNotification error');
      mockCollection.mockReturnValue({ id: 'notificationsCollection' });
      mockAddDoc.mockRejectedValue(error);

      await expect(createNotification(notificationInput)).rejects.toThrow(error);
    });
  });

  describe('getUserNotifications', () => {
    const mockGetDocsResponse = (docs: any[]) => ({
      docs: docs.map(d => ({ id: d.id, data: () => d.data, ref: { id: d.id } }))
    });
    const mockNotificationCollectionRef = { id: 'notificationsCollection' };
    const mockQueryRef = { id: 'notificationsQuery' };
    const mockQueryRefUnread = { id: 'notificationsQueryUnread' };

    beforeEach(() => {
        mockCollection.mockReturnValue(mockNotificationCollectionRef);
        mockQuery.mockImplementation((ref, ...constraints) => {
            // Return different query refs based on constraints to simulate filtering
            const hasUnreadFilter = constraints.some((c:any) => c.field === 'read' && c.value === false);
            return hasUnreadFilter ? mockQueryRefUnread : mockQueryRef;
        });
        mockWhere.mockImplementation((field, op, value) => ({ field, op, value, type: 'where' })); 
        mockOrderBy.mockImplementation((field, dir) => ({ field, dir, type: 'orderBy' }));
        mockLimit.mockImplementation((num) => ({ num, type: 'limit' }));
    });

    it('should get all notifications for a user with default limit and order', async () => {
      const userId = 'user1';
      const mockDocs = [
        { id: 'n1', data: { message: 'Notification 1' } },
        { id: 'n2', data: { message: 'Notification 2' } },
      ];
      mockGetDocs.mockResolvedValue(mockGetDocsResponse(mockDocs));

      const result = await getUserNotifications(userId);

      expect(mockCollection).toHaveBeenCalledWith(mockDbInstance, 'notifications');
      expect(mockQuery).toHaveBeenCalledWith(
        mockNotificationCollectionRef,
        expect.objectContaining({ field: 'userId', op: '==', value: userId }),
        expect.objectContaining({ field: 'createdAt', dir: 'desc' }),
        expect.objectContaining({ num: 20 }) // Default limit
      );
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef); // Query without unread filter
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 'n1', message: 'Notification 1' });
    });
    
    it('should filter by unread notifications if onlyUnread is true', async () => {
        const userId = 'user2';
        mockGetDocs.mockResolvedValue(mockGetDocsResponse([])); // Return empty for simplicity
        
        await getUserNotifications(userId, true); // onlyUnread = true
        
        expect(mockQuery).toHaveBeenCalledTimes(2); // Initial query, then query with unread filter
        // Check the second query call for the unread filter
        expect(mockQuery).toHaveBeenNthCalledWith(2,
            mockQueryRef, // Previous query result
            expect.objectContaining({ field: 'read', op: '==', value: false })
        );
        expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRefUnread); // Called with the filtered query
    });

    it('should use provided maxResults', async () => {
      const userId = 'user3';
      const maxResults = 5;
      mockGetDocs.mockResolvedValue(mockGetDocsResponse([]));

      await getUserNotifications(userId, false, maxResults);

      expect(mockQuery).toHaveBeenCalledWith(
        mockNotificationCollectionRef,
        expect.objectContaining({ field: 'userId', op: '==', value: userId }),
        expect.objectContaining({ field: 'createdAt', dir: 'desc' }),
        expect.objectContaining({ num: maxResults }) // Check provided limit
      );
    });

    it('should throw error if getDocs fails', async () => {
      const userId = 'userError';
      const error = new Error('Firestore getNotifications error');
      mockGetDocs.mockRejectedValue(error);

      await expect(getUserNotifications(userId)).rejects.toThrow(error);
    });
  });

  describe('markNotificationAsRead', () => {
    it('should call updateDoc to set read to true', async () => {
      const notificationId = 'notif123';
      const mockNotifDocRef = { id: notificationId };

      mockDoc.mockReturnValue(mockNotifDocRef);
      mockUpdateDoc.mockResolvedValue(undefined);

      await markNotificationAsRead(notificationId);

      expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'notifications', notificationId);
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockNotifDocRef, { read: true });
    });

    it('should throw error if updateDoc fails', async () => {
      const notificationId = 'notifFail';
      const error = new Error('Firestore markAsRead error');
      mockDoc.mockReturnValue({ id: notificationId });
      mockUpdateDoc.mockRejectedValue(error);

      await expect(markNotificationAsRead(notificationId)).rejects.toThrow(error);
    });
  });

  describe('markAllNotificationsAsRead', () => {
     const mockGetDocsResponse = (docs: any[]) => ({
      docs: docs.map(d => ({ id: d.id, data: () => d.data, ref: { id: d.id } }))
    });
    const mockNotificationCollectionRef = { id: 'notificationsCollection' };
    const mockQueryRef = { id: 'unreadQuery' };

    beforeEach(() => {
        mockCollection.mockReturnValue(mockNotificationCollectionRef);
        mockQuery.mockReturnValue(mockQueryRef);
        mockWhere.mockImplementation((field, op, value) => ({ field, op, value, type: 'where' })); 
        mockUpdateDoc.mockResolvedValue(undefined); // Assume updates succeed
    });
    
    it('should query unread notifications and update them', async () => {
      const userId = 'userMarkAll';
      const mockDocs = [
        { id: 'n1', data: { read: false }, ref: { id: 'n1'} },
        { id: 'n2', data: { read: false }, ref: { id: 'n2'} },
      ];
      mockGetDocs.mockResolvedValue(mockGetDocsResponse(mockDocs));

      await markAllNotificationsAsRead(userId);

      expect(mockQuery).toHaveBeenCalledWith(
        mockNotificationCollectionRef,
        expect.objectContaining({ field: 'userId', op: '==', value: userId }),
        expect.objectContaining({ field: 'read', op: '==', value: false })
      );
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);
      expect(mockUpdateDoc).toHaveBeenCalledTimes(2);
      expect(mockUpdateDoc).toHaveBeenCalledWith({ id: 'n1' }, { read: true });
      expect(mockUpdateDoc).toHaveBeenCalledWith({ id: 'n2' }, { read: true });
    });
    
     it('should not call updateDoc if no unread notifications found', async () => {
      const userId = 'userNoUnread';
      mockGetDocs.mockResolvedValue(mockGetDocsResponse([])); // No docs found

      await markAllNotificationsAsRead(userId);

      expect(mockGetDocs).toHaveBeenCalled();
      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });

    it('should throw error if getDocs fails', async () => {
      const userId = 'userMarkFail1';
      const error = new Error('Firestore markAll getDocs error');
      mockGetDocs.mockRejectedValue(error);

      await expect(markAllNotificationsAsRead(userId)).rejects.toThrow(error);
      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });
    
    it('should throw error if one of the updates fails', async () => {
        const userId = 'userMarkFail2';
        const mockDocs = [
            { id: 'n1', data: { read: false }, ref: { id: 'n1'} },
            { id: 'n2', data: { read: false }, ref: { id: 'n2'} }, // This one will fail
        ];
        const updateError = new Error('Firestore markAll update error');
        mockGetDocs.mockResolvedValue(mockGetDocsResponse(mockDocs));
        mockUpdateDoc
            .mockResolvedValueOnce(undefined) // First update succeeds
            .mockRejectedValueOnce(updateError); // Second update fails
            
        // Promise.all rejects immediately if any promise rejects
        await expect(markAllNotificationsAsRead(userId)).rejects.toThrow(updateError);
        expect(mockUpdateDoc).toHaveBeenCalledTimes(2); // Both updates were attempted
    });
  });

  describe('deleteNotification', () => {
    it('should call deleteDoc with the correct ref', async () => {
      const notificationId = 'notifDelete123';
      const mockNotifDocRef = { id: notificationId };

      mockDoc.mockReturnValue(mockNotifDocRef);
      mockDeleteDoc.mockResolvedValue(undefined);

      await deleteNotification(notificationId);

      expect(mockDoc).toHaveBeenCalledWith(mockDbInstance, 'notifications', notificationId);
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockNotifDocRef);
    });

    it('should throw error if deleteDoc fails', async () => {
      const notificationId = 'notifDeleteFail';
      const error = new Error('Firestore deleteNotification error');
      mockDoc.mockReturnValue({ id: notificationId });
      mockDeleteDoc.mockRejectedValue(error);

      await expect(deleteNotification(notificationId)).rejects.toThrow(error);
    });
  });

  describe('countUnreadNotifications', () => {
    const mockGetDocsResponse = (size: number) => ({ size });
    const mockNotificationCollectionRef = { id: 'notificationsCollection' };
    const mockQueryRef = { id: 'unreadCountQuery' };
    
    beforeEach(() => {
        mockCollection.mockReturnValue(mockNotificationCollectionRef);
        mockQuery.mockReturnValue(mockQueryRef);
        mockWhere.mockImplementation((field, op, value) => ({ field, op, value, type: 'where' })); 
    });
    
    it('should query unread notifications and return the size', async () => {
      const userId = 'userCount1';
      const unreadCount = 5;
      mockGetDocs.mockResolvedValue(mockGetDocsResponse(unreadCount));

      const result = await countUnreadNotifications(userId);

      expect(mockQuery).toHaveBeenCalledWith(
        mockNotificationCollectionRef,
        expect.objectContaining({ field: 'userId', op: '==', value: userId }),
        expect.objectContaining({ field: 'read', op: '==', value: false })
      );
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);
      expect(result).toBe(unreadCount);
    });

    it('should return 0 if no unread notifications found', async () => {
      const userId = 'userCount0';
      mockGetDocs.mockResolvedValue(mockGetDocsResponse(0));

      const result = await countUnreadNotifications(userId);
      expect(result).toBe(0);
    });

    it('should throw error if getDocs fails', async () => {
      const userId = 'userCountFail';
      const error = new Error('Firestore countUnread error');
      mockGetDocs.mockRejectedValue(error);

      await expect(countUnreadNotifications(userId)).rejects.toThrow(error);
    });
  });

  describe('subscribeToNotifications', () => {
    const mockNotificationCollectionRef = { id: 'notificationsCollection' };
    const mockQueryRef = { id: 'subscribeQuery' };
    let snapshotCallback: ((snapshot: any) => void) | null = null;
    const mockUnsubscribe = jest.fn();

    beforeEach(() => {
        mockCollection.mockReturnValue(mockNotificationCollectionRef);
        mockQuery.mockReturnValue(mockQueryRef);
        mockWhere.mockImplementation((field, op, value) => ({ field, op, value, type: 'where' })); 
        mockOrderBy.mockImplementation((field, dir) => ({ field, dir, type: 'orderBy' }));
        mockLimit.mockImplementation((num) => ({ num, type: 'limit' }));
        // Capture the callback passed to onSnapshot
        mockOnSnapshot.mockImplementation((query, callback) => {
            snapshotCallback = callback;
            return mockUnsubscribe; // Return the mock unsubscribe function
        });
    });

    it('should set up a listener with correct query and return unsubscribe function', () => {
      const userId = 'userSub1';
      const callback = jest.fn();

      const unsubscribe = subscribeToNotifications(userId, callback);

      expect(mockQuery).toHaveBeenCalledWith(
        mockNotificationCollectionRef,
        expect.objectContaining({ field: 'userId', op: '==', value: userId }),
        expect.objectContaining({ field: 'createdAt', dir: 'desc' }),
        expect.objectContaining({ num: 20 })
      );
      expect(mockOnSnapshot).toHaveBeenCalledWith(mockQueryRef, expect.any(Function));
      expect(unsubscribe).toBe(mockUnsubscribe);
      expect(callback).not.toHaveBeenCalled(); // Callback not called until snapshot
    });

    it('should call the callback with mapped notifications when snapshot updates', () => {
      const userId = 'userSub2';
      const callback = jest.fn();
      subscribeToNotifications(userId, callback);

      // Simulate a snapshot update
      const mockSnapshotDocs = [
        { id: 'snap1', data: () => ({ message: 'Snap 1' }) },
        { id: 'snap2', data: () => ({ message: 'Snap 2' }) },
      ];
      const mockSnapshot = { docs: mockSnapshotDocs };

      expect(snapshotCallback).toBeDefined();
      if (snapshotCallback) {
        snapshotCallback(mockSnapshot);
      }

      expect(callback).toHaveBeenCalledWith([
        { id: 'snap1', message: 'Snap 1' },
        { id: 'snap2', message: 'Snap 2' },
      ]);
    });
    
    it('should call unsubscribe when the returned function is invoked', () => {
        const userId = 'userSub3';
        const callback = jest.fn();
        const unsubscribe = subscribeToNotifications(userId, callback);
        
        unsubscribe(); // Call the returned unsubscribe function
        
        expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
    
    // Note: Testing the error callback of onSnapshot is complex 
    // as it usually involves simulating Firestore errors.
  });
}); 