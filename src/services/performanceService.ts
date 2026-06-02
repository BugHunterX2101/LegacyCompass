class PerformanceService {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();
  private requestQueue: Array<{
    id: string;
    request: () => Promise<unknown>;
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
  }> = [];
  private isProcessing = false;
  private maxConcurrentRequests = 20;
  private currentRequests = 0;
  private maxCacheSize = 5000;
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    this.cleanupInterval = setInterval(() => this.cleanupCache(), 5 * 60 * 1000);
    this.monitorMemoryUsage();
  }

  setCache(key: string, data: unknown, ttl: number = 5 * 60 * 1000): void {
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  getCache(key: string): unknown | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  async queueRequest<T>(id: string, request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        id,
        request: request as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.currentRequests >= this.maxConcurrentRequests) return;
    this.isProcessing = true;

    while (this.requestQueue.length > 0 && this.currentRequests < this.maxConcurrentRequests) {
      const queueItem = this.requestQueue.shift();
      if (!queueItem) break;
      this.currentRequests++;
      queueItem.request()
        .then(result => queueItem.resolve(result))
        .catch(error => queueItem.reject(error))
        .finally(() => {
          this.currentRequests--;
          if (this.requestQueue.length > 0) setTimeout(() => this.processQueue(), 10);
        });
    }
    this.isProcessing = false;
  }

  calculateVisibleItems(
    scrollTop: number,
    containerHeight: number,
    itemHeight: number,
    totalItems: number
  ): { startIndex: number; endIndex: number; visibleItems: number } {
    if (totalItems === 0) return { startIndex: 0, endIndex: -1, visibleItems: 0 };
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
    const visibleItems = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + 10);
    return { startIndex, endIndex, visibleItems };
  }

  createIntersectionObserver(
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ): IntersectionObserver {
    return new IntersectionObserver(callback, { root: null, rootMargin: '50px', threshold: 0.1, ...options });
  }

  private monitorMemoryUsage(): void {
    if (!('memory' in performance)) return;
    setInterval(() => {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
      if (!memory) return;
      if (memory.usedJSHeapSize / memory.totalJSHeapSize > 0.8) {
        this.emergencyCleanup();
      }
    }, 30000);
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) this.cache.delete(key);
    }
  }

  private emergencyCleanup(): void {
    const keys = Array.from(this.cache.keys());
    keys.slice(0, Math.floor(keys.length / 2)).forEach(k => this.cache.delete(k));
    console.warn('Emergency cache cleanup performed due to high memory usage');
  }

  async batchProcess<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize = 10,
    delay = 100
  ): Promise<R[]> {
    const results: R[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      try {
        const batchResults = await Promise.all(batch.map(item => processor(item)));
        results.push(...batchResults);
        if (i + batchSize < items.length) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error('Batch processing error:', error);
      }
    }
    return results;
  }

  getPerformanceMetrics(): {
    cacheSize: number;
    queueLength: number;
    currentRequests: number;
    memoryUsage?: number;
  } {
    const metrics: {
      cacheSize: number;
      queueLength: number;
      currentRequests: number;
      memoryUsage?: number;
    } = {
      cacheSize: this.cache.size,
      queueLength: this.requestQueue.length,
      currentRequests: this.currentRequests,
    };
    const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
    if (perf.memory) {
      metrics.memoryUsage = perf.memory.usedJSHeapSize / 1024 / 1024;
    }
    return metrics;
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
    this.requestQueue.length = 0;
  }
}

export const performanceService = new PerformanceService();
