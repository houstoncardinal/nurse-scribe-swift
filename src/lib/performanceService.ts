/**
 * Performance Optimization Service
 * Handles large-scale usage optimization and caching strategies
 */

export interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  errorRate: number;
  throughput: number;
}

export interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  strategy: 'lru' | 'fifo' | 'ttl';
}

export interface OptimizationConfig {
  enableCompression: boolean;
  enableCaching: boolean;
  enableLazyLoading: boolean;
  enablePrefetching: boolean;
  cacheConfig: CacheConfig;
}

class PerformanceService {
  private metrics: PerformanceMetrics = {
    responseTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    errorRate: 0,
    throughput: 0
  };

  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private maxConcurrentRequests = 5;
  private activeRequests = 0;

  private config: OptimizationConfig = {
    enableCompression: true,
    enableCaching: true,
    enableLazyLoading: true,
    enablePrefetching: true,
    cacheConfig: {
      maxSize: 1000,
      ttl: 300000, // 5 minutes
      strategy: 'lru'
    }
  };

  constructor() {
    this.initializePerformanceMonitoring();
    this.initializeCacheCleanup();
  }

  /**
   * Cache management
   */
  public setCache(key: string, data: any, ttl?: number): void {
    if (!this.config.enableCaching) return;

    const cacheTTL = ttl || this.config.cacheConfig.ttl;
    
    // Check cache size limit
    if (this.cache.size >= this.config.cacheConfig.maxSize) {
      this.evictOldestEntry();
    }

    this.cache.set(key, {
      data: this.compressData(data),
      timestamp: Date.now(),
      ttl: cacheTTL
    });
  }

  public getCache(key: string): any | null {
    if (!this.config.enableCaching) return null;

    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    this.updateCacheMetrics('hit');
    return this.decompressData(entry.data);
  }

  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Request queue management for rate limiting
   */
  public async queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
      const request = this.requestQueue.shift();
      if (request) {
        this.activeRequests++;
        request().finally(() => {
          this.activeRequests--;
          this.processQueue();
        });
      }
    }
    
    this.isProcessingQueue = false;
  }

  /**
   * Data compression/decompression
   */
  private compressData(data: any): any {
    if (!this.config.enableCompression) return data;
    
    try {
      // Simple compression by removing unnecessary whitespace
      if (typeof data === 'string') {
        return data.replace(/\s+/g, ' ').trim();
      }
      
      // For objects, stringify and compress
      if (typeof data === 'object') {
        return JSON.stringify(data).replace(/\s+/g, ' ').trim();
      }
      
      return data;
    } catch (error) {
      console.warn('Compression failed:', error);
      return data;
    }
  }

  private decompressData(data: any): any {
    if (!this.config.enableCompression) return data;
    
    try {
      if (typeof data === 'string') {
        // Try to parse as JSON first
        try {
          return JSON.parse(data);
        } catch {
          // If not JSON, return as string
          return data;
        }
      }
      return data;
    } catch (error) {
      console.warn('Decompression failed:', error);
      return data;
    }
  }

  /**
   * Performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    // Monitor memory usage
    setInterval(() => {
      if ('memory' in performance) {
        this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
      }
    }, 5000);

    // Monitor cache hit rate
    setInterval(() => {
      this.calculateCacheHitRate();
    }, 10000);
  }

  private initializeCacheCleanup(): void {
    // Clean up expired cache entries every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000);
  }

  private evictOldestEntry(): void {
    if (this.config.cacheConfig.strategy === 'lru') {
      // Remove least recently used entry
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    } else if (this.config.cacheConfig.strategy === 'fifo') {
      // Remove first in, first out
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

  private updateCacheMetrics(type: 'hit' | 'miss'): void {
    const cacheStats = this.getCacheStats();
    this.metrics.cacheHitRate = cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0;
  }

  private calculateCacheHitRate(): void {
    const cacheStats = this.getCacheStats();
    this.metrics.cacheHitRate = cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0;
  }

  /**
   * Lazy loading implementation
   */
  public async lazyLoad<T>(
    key: string, 
    loadFn: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    // Check cache first
    const cached = this.getCache(key);
    if (cached) {
      return cached;
    }

    // Load data
    const startTime = Date.now();
    try {
      const data = await loadFn();
      this.setCache(key, data, ttl);
      
      this.metrics.responseTime = Date.now() - startTime;
      return data;
    } catch (error) {
      this.metrics.errorRate += 1;
      throw error;
    }
  }

  /**
   * Prefetching implementation
   */
  public async prefetch<T>(
    key: string, 
    loadFn: () => Promise<T>, 
    ttl?: number
  ): Promise<void> {
    // Only prefetch if not already cached
    if (this.getCache(key)) return;

    // Prefetch in background
    setTimeout(async () => {
      try {
        const data = await loadFn();
        this.setCache(key, data, ttl);
      } catch (error) {
        console.warn('Prefetch failed:', error);
      }
    }, 0);
  }

  /**
   * Batch processing for multiple requests
   */
  public async batchProcess<T>(
    requests: Array<{ key: string; fn: () => Promise<T> }>,
    ttl?: number
  ): Promise<T[]> {
    const results: T[] = [];
    const uncachedRequests: Array<{ key: string; fn: () => Promise<T>; index: number }> = [];

    // Check cache for all requests
    requests.forEach((request, index) => {
      const cached = this.getCache(request.key);
      if (cached) {
        results[index] = cached;
      } else {
        uncachedRequests.push({ ...request, index });
      }
    });

    // Process uncached requests in parallel
    if (uncachedRequests.length > 0) {
      const promises = uncachedRequests.map(async ({ key, fn, index }) => {
        const data = await fn();
        this.setCache(key, data, ttl);
        return { data, index };
      });

      const responses = await Promise.all(promises);
      responses.forEach(({ data, index }) => {
        results[index] = data;
      });
    }

    return results;
  }

  /**
   * Debounced function execution
   */
  public debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  /**
   * Throttled function execution
   */
  public throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Performance metrics and monitoring
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getCacheStats(): { hits: number; misses: number; size: number } {
    // This would typically be tracked more precisely in a real implementation
    return {
      hits: Math.floor(this.metrics.cacheHitRate * 100),
      misses: Math.floor((1 - this.metrics.cacheHitRate) * 100),
      size: this.cache.size
    };
  }

  public resetMetrics(): void {
    this.metrics = {
      responseTime: 0,
      memoryUsage: 0,
      cacheHitRate: 0,
      errorRate: 0,
      throughput: 0
    };
  }

  /**
   * Configuration management
   */
  public updateConfig(newConfig: Partial<OptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): OptimizationConfig {
    return { ...this.config };
  }

  /**
   * Memory management
   */
  public optimizeMemory(): void {
    // Clear expired cache entries
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }

    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  /**
   * Network optimization
   */
  public async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError!;
  }

  /**
   * Resource pooling for database connections, etc.
   */
  public createResourcePool<T>(
    createResource: () => Promise<T>,
    maxSize: number = 10
  ): {
    acquire: () => Promise<T>;
    release: (resource: T) => void;
    destroy: () => Promise<void>;
  } {
    const pool: T[] = [];
    const waiting: Array<{ resolve: (resource: T) => void; reject: (error: Error) => void }> = [];

    const acquire = (): Promise<T> => {
      return new Promise((resolve, reject) => {
        if (pool.length > 0) {
          resolve(pool.pop()!);
        } else if (pool.length + waiting.length < maxSize) {
          createResource()
            .then(resolve)
            .catch(reject);
        } else {
          waiting.push({ resolve, reject });
        }
      });
    };

    const release = (resource: T): void => {
      if (waiting.length > 0) {
        const { resolve } = waiting.shift()!;
        resolve(resource);
      } else {
        pool.push(resource);
      }
    };

    const destroy = async (): Promise<void> => {
      pool.length = 0;
      waiting.forEach(({ reject }) => reject(new Error('Pool destroyed')));
      waiting.length = 0;
    };

    return { acquire, release, destroy };
  }
}

// Export singleton instance
export const performanceService = new PerformanceService();

export default performanceService;
