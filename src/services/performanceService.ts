// Performance optimization service for handling high traffic
class PerformanceService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private requestQueue: Array<{ id: string; request: () => Promise<any>; resolve: (value: any) => void; reject: (error: any) => void }> = [];
  private isProcessing = false;
  private maxConcurrentRequests = 10;
  private currentRequests = 0;

  // Debounced function cache
  private debouncedFunctions = new Map<string, (...args: any[]) => void>();

  // Memory management
  private maxCacheSize = 1000;
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup cache every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupCache();
    }, 5 * 60 * 1000);

    // Monitor memory usage
    this.monitorMemoryUsage();
  }

  // Intelligent caching with TTL
  setCache(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if cache has expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Request queuing for rate limiting
  async queueRequest<T>(id: string, request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ id, request, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.currentRequests >= this.maxConcurrentRequests) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0 && this.currentRequests < this.maxConcurrentRequests) {
      const queueItem = this.requestQueue.shift();
      if (!queueItem) break;

      this.currentRequests++;

      // Process request
      queueItem.request()
        .then(result => {
          queueItem.resolve(result);
        })
        .catch(error => {
          queueItem.reject(error);
        })
        .finally(() => {
          this.currentRequests--;
          // Continue processing queue
          if (this.requestQueue.length > 0) {
            setTimeout(() => this.processQueue(), 10);
          }
        });
    }

    this.isProcessing = false;
  }

  // Debounce function for search and filtering
  debounce<T extends (...args: any[]) => void>(
    key: string,
    func: T,
    delay: number = 300
  ): T {
    if (this.debouncedFunctions.has(key)) {
      return this.debouncedFunctions.get(key) as T;
    }

    let timeoutId: NodeJS.Timeout;
    const debouncedFunc = ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as T;

    this.debouncedFunctions.set(key, debouncedFunc);
    return debouncedFunc;
  }

  // Throttle function for high-frequency events
  throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number = 100
  ): T {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  }

  // Virtual scrolling for large datasets
  calculateVisibleItems(
    scrollTop: number,
    containerHeight: number,
    itemHeight: number,
    totalItems: number
  ): { startIndex: number; endIndex: number; visibleItems: number } {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleItems = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(startIndex + visibleItems + 5, totalItems - 1); // Buffer of 5 items

    return { startIndex, endIndex, visibleItems };
  }

  // Lazy loading implementation
  createIntersectionObserver(
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ): IntersectionObserver {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };

    return new IntersectionObserver(callback, defaultOptions);
  }

  // Memory usage monitoring
  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const totalMB = memory.totalJSHeapSize / 1024 / 1024;
        
        // If memory usage is high, trigger cleanup
        if (usedMB / totalMB > 0.8) {
          this.emergencyCleanup();
        }
      }, 30000); // Check every 30 seconds
    }
  }

  // Cache cleanup
  private cleanupCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Emergency cleanup for memory pressure
  private emergencyCleanup(): void {
    // Clear half of the cache
    const keys = Array.from(this.cache.keys());
    const keysToDelete = keys.slice(0, Math.floor(keys.length / 2));
    keysToDelete.forEach(key => this.cache.delete(key));

    // Clear debounced functions
    this.debouncedFunctions.clear();

    console.warn('Emergency cleanup performed due to high memory usage');
  }

  // Batch processing for bulk operations
  async batchProcess<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 10,
    delay: number = 100
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchPromises = batch.map(item => processor(item));
      
      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Add delay between batches to prevent overwhelming the system
        if (i + batchSize < items.length) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error('Batch processing error:', error);
        // Continue with next batch
      }
    }
    
    return results;
  }

  // Resource pooling for expensive operations
  private resourcePool = new Map<string, any[]>();

  getResource(type: string): any | null {
    const pool = this.resourcePool.get(type);
    return pool && pool.length > 0 ? pool.pop() : null;
  }

  returnResource(type: string, resource: any): void {
    if (!this.resourcePool.has(type)) {
      this.resourcePool.set(type, []);
    }
    
    const pool = this.resourcePool.get(type)!;
    if (pool.length < 10) { // Limit pool size
      pool.push(resource);
    }
  }

  // Performance metrics
  getPerformanceMetrics(): {
    cacheSize: number;
    queueLength: number;
    currentRequests: number;
    memoryUsage?: number;
  } {
    const metrics = {
      cacheSize: this.cache.size,
      queueLength: this.requestQueue.length,
      currentRequests: this.currentRequests
    };

    if ('memory' in performance) {
      const memory = (performance as any).memory;
      (metrics as any).memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }

    return metrics;
  }

  // Cleanup on destroy
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
    this.requestQueue.length = 0;
    this.debouncedFunctions.clear();
    this.resourcePool.clear();
  }
}

export const performanceService = new PerformanceService();