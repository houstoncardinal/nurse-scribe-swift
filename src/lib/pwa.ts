/**
 * PWA Service Integration
 * Handles service worker registration, offline functionality, and PWA features
 */

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAStatus {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  serviceWorkerReady: boolean;
}

export interface OfflineData {
  type: 'note' | 'analytics' | 'education' | 'settings';
  data: any;
  timestamp: string;
  id: string;
}

class PWAService {
  private serviceWorker: ServiceWorker | null = null;
  private installPrompt: PWAInstallPrompt | null = null;
  private updateAvailable = false;
  private isOnline = navigator.onLine;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize PWA service
   */
  async initialize(): Promise<void> {
    // Register service worker
    await this.registerServiceWorker();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Check for updates
    this.checkForUpdates();
    
    // Setup offline data sync
    this.setupOfflineSync();
  }

  /**
   * Register service worker
   */
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        this.serviceWorker = registration.active || registration.installing || registration.waiting;

        console.log('Service Worker registered successfully:', registration);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.updateAvailable = true;
                this.notifyUpdateAvailable();
              }
            });
          }
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOffline();
    });

    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installPrompt = event as any;
      this.notifyInstallAvailable();
    });

    // App installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      this.notifyInstalled();
    });

    // Service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event);
      });
    }
  }

  /**
   * Check for updates
   */
  private async checkForUpdates(): Promise<void> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    }
  }

  /**
   * Setup offline data sync
   */
  private setupOfflineSync(): void {
    // Register background sync for offline data
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      this.registerBackgroundSync();
    }
  }

  /**
   * Register background sync
   */
  private async registerBackgroundSync(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      // Background sync is optional - check if supported and we have a window
      if ('sync' in registration && typeof window !== 'undefined' && window.document) {
        // Only register background sync once per session
        const syncRegistered = sessionStorage.getItem('bg-sync');
        if (!syncRegistered) {
          // Use short tag names to avoid "tag too long" error
          await (registration as any).sync.register('notes');
          sessionStorage.setItem('bg-sync', '1');
        }
      }
    } catch (error) {
      // Background sync is non-critical, silently fail
      console.log('Background sync not available:', error instanceof Error ? error.message : 'Unknown');
    }
  }

  /**
   * Get PWA status
   */
  getStatus(): PWAStatus {
    return {
      isInstalled: this.isPWAInstalled(),
      isInstallable: this.installPrompt !== null,
      isOnline: this.isOnline,
      hasUpdate: this.updateAvailable,
      serviceWorkerReady: this.serviceWorker !== null,
    };
  }

  /**
   * Check if PWA is installed
   */
  private isPWAInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  /**
   * Show install prompt
   */
  async showInstallPrompt(): Promise<boolean> {
    if (!this.installPrompt) {
      return false;
    }

    try {
      await this.installPrompt.prompt();
      const choiceResult = await this.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA install');
        this.installPrompt = null;
        return true;
      } else {
        console.log('User dismissed PWA install');
        return false;
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  }

  /**
   * Update service worker
   */
  async updateServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      } catch (error) {
        console.error('Service worker update failed:', error);
      }
    }
  }

  /**
   * Store data for offline sync
   */
  async storeOfflineData(type: OfflineData['type'], data: any): Promise<void> {
    const offlineData: OfflineData = {
      type,
      data,
      timestamp: new Date().toISOString(),
      id: `${type}_${Date.now()}`,
    };

    try {
      // Store in IndexedDB for offline access
      await this.storeInIndexedDB('offline_data', offlineData);
      
      // If online, try to sync immediately
      if (this.isOnline) {
        await this.syncOfflineData(offlineData);
      }
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }

  /**
   * Sync offline data when online
   */
  private async syncOfflineData(offlineData: OfflineData): Promise<void> {
    try {
      const endpoint = this.getSyncEndpoint(offlineData.type);
      
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offlineData.data),
      });

      // Remove from offline storage after successful sync
      await this.removeFromIndexedDB('offline_data', offlineData.id);
      
    } catch (error) {
      console.error('Failed to sync offline data:', error);
      // Data remains in offline storage for future sync
    }
  }

  /**
   * Get sync endpoint for data type
   */
  private getSyncEndpoint(type: OfflineData['type']): string {
    switch (type) {
      case 'note': return '/api/notes';
      case 'analytics': return '/api/analytics';
      case 'education': return '/api/education/progress';
      case 'settings': return '/api/settings';
      default: return '/api/sync';
    }
  }

  /**
   * Handle online event
   */
  private async handleOnline(): Promise<void> {
    console.log('App is online - syncing offline data');
    
    // Sync all offline data
    const offlineData = await this.getOfflineData();
    for (const data of offlineData) {
      await this.syncOfflineData(data);
    }
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    console.log('App is offline - storing data locally');
    // Show offline indicator
    this.notifyOffline();
  }

  /**
   * Handle service worker messages
   */
  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { data } = event;
    
    switch (data.type) {
      case 'UPDATE_AVAILABLE':
        this.updateAvailable = true;
        this.notifyUpdateAvailable();
        break;
      case 'OFFLINE_DATA_SYNCED':
        console.log('Offline data synced:', data.payload);
        break;
      default:
        console.log('Unknown service worker message:', data);
    }
  }

  /**
   * Store data in IndexedDB
   */
  private async storeInIndexedDB(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('NurseScribePWA', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const addRequest = store.add(data);
        
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(addRequest.error);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Get offline data from IndexedDB
   */
  private async getOfflineData(): Promise<OfflineData[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('NurseScribePWA', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline_data'], 'readonly');
        const store = transaction.objectStore('offline_data');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = () => reject(getAllRequest.error);
      };
    });
  }

  /**
   * Remove data from IndexedDB
   */
  private async removeFromIndexedDB(storeName: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('NurseScribePWA', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const deleteRequest = store.delete(id);
        
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      };
    });
  }

  /**
   * Notification handlers
   */
  private notifyInstallAvailable(): void {
    // Dispatch custom event for UI to handle
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  }

  private notifyInstalled(): void {
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  }

  private notifyUpdateAvailable(): void {
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }

  private notifyOffline(): void {
    window.dispatchEvent(new CustomEvent('pwa-offline'));
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  /**
   * Show notification
   */
  async showNotification(title: string, options: NotificationOptions): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, options);
      } else {
        new Notification(title, options);
      }
    }
  }

  /**
   * Get app info
   */
  getAppInfo(): {
    name: string;
    version: string;
    platform: string;
    userAgent: string;
  } {
    return {
      name: 'Raha',
      version: '2.0.0',
      platform: navigator.platform,
      userAgent: navigator.userAgent,
    };
  }

  /**
   * Clear all offline data
   */
  async clearOfflineData(): Promise<void> {
    try {
      const request = indexedDB.open('NurseScribePWA', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline_data'], 'readwrite');
        const store = transaction.objectStore('offline_data');
        store.clear();
      };
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }
}

// Export singleton instance
export const pwaService = new PWAService();
