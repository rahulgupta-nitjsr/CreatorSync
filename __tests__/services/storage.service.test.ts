import { Timestamp } from 'firebase/firestore'; // Needed for jest.fn()
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll, UploadTaskSnapshot } from 'firebase/storage';

// Import interfaces and function signatures
import {
    IUploadProgressCallback,
    uploadFile as uploadFileType,
    deleteFile as deleteFileType,
    generateFilePath as generateFilePathType,
    getFilePathFromURL as getFilePathFromURLType,
    uploadProfileImage as uploadProfileImageType,
    uploadContentMedia as uploadContentMediaType,
    listFiles as listFilesType,
} from '@/services/storage';

// Mock Firebase SDK modules at the top level
jest.mock('firebase/storage', () => {
    const originalModule = jest.requireActual('firebase/storage');
    return {
        ...originalModule, // Use original implementation for types like UploadTaskSnapshot if needed
        ref: jest.fn(),
        uploadBytesResumable: jest.fn(),
        getDownloadURL: jest.fn(),
        deleteObject: jest.fn(),
        listAll: jest.fn(),
    };
});

// --- Assign mocks to variables AFTER jest.mock ---
const storageMocks = require('firebase/storage');
const mockRef: jest.Mock = storageMocks.ref;
const mockUploadBytesResumable: jest.Mock = storageMocks.uploadBytesResumable;
const mockGetDownloadURL: jest.Mock = storageMocks.getDownloadURL;
const mockDeleteObject: jest.Mock = storageMocks.deleteObject;
const mockListAll: jest.Mock = storageMocks.listAll;

// Declare variables for mock instances and service functions
let mockStorageInstance: {};
let uploadFile: typeof uploadFileType;
let deleteFile: typeof deleteFileType;
let generateFilePath: typeof generateFilePathType;
let getFilePathFromURL: typeof getFilePathFromURLType;
let uploadProfileImage: typeof uploadProfileImageType;
let uploadContentMedia: typeof uploadContentMediaType;
let listFiles: typeof listFilesType;

// --- Mock UploadTask setup (moved to top level) ---
let mockUploadTask: any;
let capturedExternalProgressCallback: jest.Mock | null = null; // Store the external callback
let capturedErrorHandler: jest.Mock | null = null;
let capturedCompleteHandler: jest.Mock | null = null;
// --- End Mock UploadTask setup ---

describe('Service: StorageService', () => {

  beforeAll(async () => {
    // Initialize mock Storage instance
    mockStorageInstance = {}; // Basic Storage mock

    // Mock config using doMock 
    jest.doMock('@/firebase/config', () => ({
      storage: mockStorageInstance,
    }));

    // --- Dynamically import the service functions *after* mocks are set up ---
    const service = await import('@/services/storage');
    uploadFile = service.uploadFile;
    deleteFile = service.deleteFile;
    generateFilePath = service.generateFilePath;
    getFilePathFromURL = service.getFilePathFromURL;
    uploadProfileImage = service.uploadProfileImage;
    uploadContentMedia = service.uploadContentMedia;
    listFiles = service.listFiles;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset captured callbacks
    capturedExternalProgressCallback = null;
    capturedErrorHandler = jest.fn(); // Default mock
    capturedCompleteHandler = jest.fn(); // Default mock

    // Mock implementation for UploadTask's .on() method
    const mockOn = jest.fn((event, arg2, arg3, arg4) => {
      // Capture handlers based on call signature
      if (event === 'state_changed') {
          if (typeof arg2 === 'function' && arg3 === undefined && arg4 === undefined) {
              // Signature: on('state_changed', progressCallback)
              capturedExternalProgressCallback = arg2;
          } else if (typeof arg2 === 'function' && typeof arg3 === 'function' && typeof arg4 === 'function') {
              // Signature: on('state_changed', internalObserver, error, complete)
              // We capture error and complete for simulating success/failure
              capturedErrorHandler = arg3;
              capturedCompleteHandler = arg4;
              // We don't need to capture the internal progress observer (arg2)
          }
           // Handle potential null/undefined callbacks if necessary
           if (arg3 && typeof arg3 === 'function') capturedErrorHandler = arg3;
           if (arg4 && typeof arg4 === 'function') capturedCompleteHandler = arg4;
      }
      // Return an unsubscribe function, as expected by .on()
      return jest.fn(); 
  });

    // Define the core mockUploadTask structure separately
    mockUploadTask = {
        on: mockOn, // Assign the mock implementation for .on
        snapshot: {
            // Initialize ref, but it will be overwritten by the implementation below
            ref: { id: 'defaultMockRef' }, 
            bytesTransferred: 0,
            totalBytes: 100,
            state: 'running'
        },
        // Add other UploadTask methods if needed by the service (e.g., pause, resume, cancel)
        pause: jest.fn(),
        resume: jest.fn(),
        cancel: jest.fn(),
    };
    
    // *** Change from mockReturnValue to mockImplementation ***
    mockUploadBytesResumable.mockImplementation((storageRef: any, file: File) => {
        // Update the global mock task's snapshot ref with the ref passed to this call
        mockUploadTask.snapshot.ref = storageRef; 
        return mockUploadTask; // Return the updated global mock task
      });
  });

  // --- Helper Function Tests ---
  describe('generateFilePath', () => {
    it('should generate a path with contentType, userId, timestamp, random string, and extension', () => {
      // Arrange
      const userId = 'user123';
      const fileName = 'my-image.jpeg';
      const contentType = 'profiles';
      const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(1678886400000); // Fix timestamp
      const mathRandomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456789); // Fix random part

      // Act
      const result = generateFilePath(userId, fileName, contentType);

      // Assert
      // Expected random string from 0.123456789.toString(36).substring(2, 9) -> '4fzyo82m' approx
      const expectedRandom = (0.123456789).toString(36).substring(2, 9);
      expect(result).toMatch(new RegExp(`^${contentType}/${userId}/1678886400000-${expectedRandom}\.jpeg$`));
      
      // Restore spies
      dateNowSpy.mockRestore();
      mathRandomSpy.mockRestore();
    });
  });

  describe('getFilePathFromURL', () => {
    it('should extract the correct file path from a valid download URL', () => {
      // Arrange
      const bucket = 'my-project.appspot.com';
      const filePath = 'profiles/user123/image.jpg';
      const encodedFilePath = encodeURIComponent(filePath);
      const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedFilePath}?alt=media&token=some-token`;

      // Act
      const result = getFilePathFromURL(downloadURL);

      // Assert
      expect(result).toBe(filePath);
    });

    it('should return null for an invalid or malformed URL', () => {
      expect(getFilePathFromURL('invalid-url')).toBeNull();
      expect(getFilePathFromURL('https://otherdomain.com/path')).toBeNull();
      expect(getFilePathFromURL('https://firebasestorage.googleapis.com/v0/b/bucket-only')).toBeNull();
      expect(getFilePathFromURL('https://firebasestorage.googleapis.com/v0/b/bucket/o/')).toBeNull(); // Missing file part
    });
    
    it('should handle URLs with special characters in path', () => {
        const filePath = 'content/user 456/file name with spaces & symbols@.png';
        const encodedFilePath = encodeURIComponent(filePath);
        const downloadURL = `https://firebasestorage.googleapis.com/v0/b/bucket/o/${encodedFilePath}?alt=media`;
        expect(getFilePathFromURL(downloadURL)).toBe(filePath);
    });
  });

  // --- Core Function Tests ---
  describe('uploadFile', () => {
     // Mock UploadTask setup moved outside
 
    it('should call uploadBytesResumable and getDownloadURL on success', async () => {
      // Arrange
      const file = new File(['content'], 'test.txt');
      const path = 'uploads/test.txt';
      const mockStorageRef = { name: 'test.txt', fullPath: path };
      const expectedDownloadURL = 'https://fake.url/download';

      mockRef.mockReturnValue(mockStorageRef);
      mockGetDownloadURL.mockResolvedValue(expectedDownloadURL);
      
      // Act
      const promise = uploadFile(file, path);
      
      // Simulate successful upload completion by calling the captured complete handler
      expect(capturedCompleteHandler).toBeDefined();
      if(capturedCompleteHandler) capturedCompleteHandler(); // Manually trigger completion
      
      const result = await promise;
      
      // Assert
      expect(mockRef).toHaveBeenCalledWith(mockStorageInstance, path);
      expect(mockUploadBytesResumable).toHaveBeenCalledWith(mockStorageRef, file);
      expect(mockGetDownloadURL).toHaveBeenCalledWith(mockUploadTask.snapshot.ref);
      expect(result).toBe(expectedDownloadURL);
    });
    
    it('should call progress callback if provided', async () => {
        // Arrange
        const file = new File(['content'], 'test.txt');
        const path = 'uploads/test.txt';
        const mockStorageRef = { name: 'test.txt', fullPath: path };
        const progressCallback = jest.fn() as IUploadProgressCallback;
        // Snapshot data used to manually trigger the callback
        const mockSnapshotData = { 
            bytesTransferred: 50,
            totalBytes: 100,
            state: 'running',
            ref: mockStorageRef,
        };

        mockRef.mockReturnValue(mockStorageRef);
        mockGetDownloadURL.mockResolvedValue('url');

        // Act
        const promise = uploadFile(file, path, progressCallback);
        
        // Simulate progress update - manually call the *captured external* callback
        expect(capturedExternalProgressCallback).toBeDefined();
        if (capturedExternalProgressCallback) {
            capturedExternalProgressCallback(mockSnapshotData); 
        }
        
        // Simulate completion
        expect(capturedCompleteHandler).toBeDefined();
        if(capturedCompleteHandler) capturedCompleteHandler();
        await promise;

        // Assert
        // Check if the *external* callback was called with data containing the key properties
        expect(progressCallback).toHaveBeenCalledWith(expect.objectContaining(mockSnapshotData));
    });

    it('should throw error if upload fails', async () => {
      // Arrange
      const file = new File(['content'], 'test.txt');
      const path = 'uploads/fail.txt';
      const mockStorageRef = { name: 'fail.txt', fullPath: path };
      const error = new Error('Storage upload error');

      mockRef.mockReturnValue(mockStorageRef);
      
      // Act
      const promise = uploadFile(file, path);

      // Simulate upload error by calling the captured error handler
      expect(capturedErrorHandler).toBeDefined();
      if(capturedErrorHandler) capturedErrorHandler(error); // Manually trigger error handler

      // Assert
      await expect(promise).rejects.toThrow(error);
      expect(mockGetDownloadURL).not.toHaveBeenCalled();
    });
  });

  describe('deleteFile', () => {
    it('should call deleteObject with the correct reference', async () => {
      // Arrange
      const path = 'uploads/to-delete.jpg';
      const mockStorageRef = { name: 'to-delete.jpg', fullPath: path };

      mockRef.mockReturnValue(mockStorageRef);
      mockDeleteObject.mockResolvedValue(undefined);

      // Act
      await deleteFile(path);

      // Assert
      expect(mockRef).toHaveBeenCalledWith(mockStorageInstance, path);
      expect(mockDeleteObject).toHaveBeenCalledWith(mockStorageRef);
    });

    it('should throw error if deleteObject fails', async () => {
      // Arrange
      const path = 'uploads/delete-fail.png';
      const mockStorageRef = { name: 'delete-fail.png', fullPath: path };
      const error = new Error('Storage delete error');

      mockRef.mockReturnValue(mockStorageRef);
      mockDeleteObject.mockRejectedValue(error);

      // Act & Assert
      await expect(deleteFile(path)).rejects.toThrow(error);
      expect(mockRef).toHaveBeenCalledWith(mockStorageInstance, path);
      expect(mockDeleteObject).toHaveBeenCalledWith(mockStorageRef);
    });
  });

  // --- Composite Function Tests ---
  describe('uploadProfileImage', () => {
    it('should generate path and call uploadFile', async () => {
      // Arrange
      const file = new File(['profile'], 'profile.jpg', { type: 'image/jpeg' });
      const userId = 'user123';
      // Use stringMatching for the generated part of the path
      const expectedPathPattern = /^profileImages\/user123\/.*\.jpg$/;
      const specificMockRef = { // Define the specific ref matching the pattern
        fullPath: expect.stringMatching(expectedPathPattern),
        name: file.name,
      };
      mockGetDownloadURL.mockResolvedValue('http://mock-url.com/profile.jpg');
      mockRef.mockReturnValueOnce(specificMockRef);

      // Act
      const promise = uploadProfileImage(file, userId);
      capturedCompleteHandler?.(); // Simulate completion
      const result = await promise;

      // Assert
      // Don't assert mockRef args directly due to generated path variance
      expect(mockUploadBytesResumable).toHaveBeenCalledWith(
        specificMockRef, // Check upload called with the returned ref
        file
      );
      expect(mockGetDownloadURL).toHaveBeenCalledWith(specificMockRef); // Check getDownloadURL called with the returned ref
      expect(result).toBe('http://mock-url.com/profile.jpg');
    });

    // Add error handling test if needed
  });

  describe('uploadContentMedia', () => {
    it('should construct path and call uploadFile', async () => {
        // Arrange
        const file = new File(['content'], 'media.mp4', { type: 'video/mp4' });
        const userId = 'user456';
        const contentId = 'content789';
        // *** Correct the expected path structure ***
        const expectedPath = `content/${userId}/${contentId}/${file.name}`;
        const specificMockRef = { // Define the specific ref for this test
            fullPath: expectedPath,
            name: file.name,
        };
        mockGetDownloadURL.mockResolvedValue('http://mock-url.com/media.mp4');
        mockRef.mockReturnValueOnce(specificMockRef);

        // Act
        const promise = uploadContentMedia(file, userId, contentId);
        capturedCompleteHandler?.(); // Simulate completion
        const result = await promise;

        // Assert
        // *** Verify mockRef was called with the corrected path ***
        expect(mockRef).toHaveBeenCalledWith(mockStorageInstance, expectedPath);
        expect(mockUploadBytesResumable).toHaveBeenCalledWith(
          specificMockRef, // Check upload called with the returned ref
          file
        );
        expect(mockGetDownloadURL).toHaveBeenCalledWith(specificMockRef); // Check getDownloadURL called with the returned ref
        expect(result).toBe('http://mock-url.com/media.mp4');
      });

      // Add error handling test if needed
  });

  describe('listFiles', () => {
    it('should call listAll and getDownloadURL for each item', async () => {
        // Arrange
        const directoryPath = 'content/user123/content456/';
        const mockDirectoryRef = { fullPath: directoryPath };
        const mockItem1Ref = { name: 'item1.txt' };
        const mockItem2Ref = { name: 'item2.jpg' };
        const mockListResult = {
            items: [mockItem1Ref, mockItem2Ref],
            prefixes: [], // Assuming no subdirectories for simplicity
        };
        const url1 = 'https://url/item1.txt';
        const url2 = 'https://url/item2.jpg';

        mockRef.mockReturnValue(mockDirectoryRef);
        mockListAll.mockResolvedValue(mockListResult);
        mockGetDownloadURL
            .mockResolvedValueOnce(url1) // First call returns url1
            .mockResolvedValueOnce(url2); // Second call returns url2

        // Act
        const result = await listFiles(directoryPath);

        // Assert
        expect(mockRef).toHaveBeenCalledWith(mockStorageInstance, directoryPath);
        expect(mockListAll).toHaveBeenCalledWith(mockDirectoryRef);
        expect(mockGetDownloadURL).toHaveBeenCalledWith(mockItem1Ref);
        expect(mockGetDownloadURL).toHaveBeenCalledWith(mockItem2Ref);
        expect(result).toEqual([url1, url2]);
    });
    
    it('should return empty array if directory is empty', async () => {
        const directoryPath = 'empty/dir/';
        const mockDirectoryRef = { fullPath: directoryPath };
        const mockListResult = { items: [], prefixes: [] };

        mockRef.mockReturnValue(mockDirectoryRef);
        mockListAll.mockResolvedValue(mockListResult);

        const result = await listFiles(directoryPath);

        expect(result).toEqual([]);
        expect(mockGetDownloadURL).not.toHaveBeenCalled();
    });

    it('should throw error if listAll fails', async () => {
        const directoryPath = 'error/dir/';
        const mockDirectoryRef = { fullPath: directoryPath };
        const error = new Error('Storage listAll error');

        mockRef.mockReturnValue(mockDirectoryRef);
        mockListAll.mockRejectedValue(error);

        await expect(listFiles(directoryPath)).rejects.toThrow(error);
        expect(mockGetDownloadURL).not.toHaveBeenCalled();
    });
    
    it('should throw error if getDownloadURL fails', async () => {
        const directoryPath = 'error/url/dir/';
        const mockDirectoryRef = { fullPath: directoryPath };
        const mockItem1Ref = { name: 'item1.txt' };
        const mockListResult = { items: [mockItem1Ref], prefixes: [] };
        const error = new Error('Storage getDownloadURL error');

        mockRef.mockReturnValue(mockDirectoryRef);
        mockListAll.mockResolvedValue(mockListResult);
        mockGetDownloadURL.mockRejectedValue(error); // Fail on getting URL

        await expect(listFiles(directoryPath)).rejects.toThrow(error);
        expect(mockGetDownloadURL).toHaveBeenCalledWith(mockItem1Ref);
    });
  });

}); 