/**
 * Performance utilities for optimizing bundle loading and user experience
 */

// Performance metrics tracking
interface PerformanceMetrics {
  loadStart: number;
  loadEnd: number;
  dataSize: number;
  cacheHit: boolean;
}

// Performance metrics store
const performanceMetrics: Record<string, PerformanceMetrics[]> = {};

/**
 * Track loading performance for vocabulary data
 */
export function trackLoadingPerformance(
  key: string,
  dataSize: number,
  cacheHit: boolean = false
) {
  const loadEnd = performance.now();
  
  if (!performanceMetrics[key]) {
    performanceMetrics[key] = [];
  }
  
  const metric: PerformanceMetrics = {
    loadStart: loadEnd - (cacheHit ? 0 : 100), // Estimate start time
    loadEnd,
    dataSize,
    cacheHit
  };
  
  performanceMetrics[key].push(metric);
  
  // Log performance in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${key}: ${dataSize} items ${cacheHit ? '(cached)' : '(fresh)'} - ${Math.round(loadEnd)}ms`);
  }
}

/**
 * Get performance statistics
 */
export function getPerformanceStats() {
  const stats: Record<string, {
    averageLoadTime: number;
    totalLoads: number;
    cacheHitRate: number;
    averageDataSize: number;
  }> = {};
  
  Object.entries(performanceMetrics).forEach(([key, metrics]) => {
    const totalLoads = metrics.length;
    const cacheHits = metrics.filter(m => m.cacheHit).length;
    const freshLoads = metrics.filter(m => !m.cacheHit);
    
    stats[key] = {
      averageLoadTime: freshLoads.length > 0 
        ? freshLoads.reduce((sum, m) => sum + (m.loadEnd - m.loadStart), 0) / freshLoads.length 
        : 0,
      totalLoads,
      cacheHitRate: totalLoads > 0 ? (cacheHits / totalLoads) * 100 : 0,
      averageDataSize: metrics.length > 0 
        ? metrics.reduce((sum, m) => sum + m.dataSize, 0) / metrics.length 
        : 0
    };
  });
  
  return stats;
}

/**
 * Preload vocabulary data for anticipated user needs
 */
export async function preloadVocabularyData(
  loaderFn: (level: number) => Promise<any[]>,
  levels: number[],
  priority: 'high' | 'low' = 'low'
) {
  const loadPromises = levels.map(async (level) => {
    try {
      // Use requestIdleCallback for low priority preloading
      if (priority === 'low' && 'requestIdleCallback' in window) {
        return new Promise(resolve => {
          (window as any).requestIdleCallback(async () => {
            await loaderFn(level);
            resolve(level);
          });
        });
      } else {
        await loaderFn(level);
        return level;
      }
    } catch (error) {
      console.warn(`Failed to preload level ${level}:`, error);
      return null;
    }
  });
  
  return Promise.allSettled(loadPromises);
}

/**
 * Memory-aware caching utility
 */
export class MemoryAwareCache<T> {
  private cache = new Map<string, T>();
  private maxMemoryMB: number;
  private accessOrder = new Map<string, number>();
  
  constructor(maxMemoryMB: number = 50) {
    this.maxMemoryMB = maxMemoryMB;
  }
  
  set(key: string, value: T): void {
    const serializedSize = new Blob([JSON.stringify(value)]).size;
    const sizeMB = serializedSize / (1024 * 1024);
    
    // Check if adding this item would exceed memory limit
    if (sizeMB > this.maxMemoryMB) {
      console.warn(`Item ${key} too large for cache (${sizeMB.toFixed(2)}MB)`);
      return;
    }
    
    // Clear space if needed (LRU eviction)
    while (this.getCurrentMemoryUsage() + sizeMB > this.maxMemoryMB && this.cache.size > 0) {
      this.evictLeastRecentlyUsed();
    }
    
    this.cache.set(key, value);
    this.accessOrder.set(key, Date.now());
  }
  
  get(key: string): T | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.accessOrder.set(key, Date.now());
    }
    return value;
  }
  
  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
  }
  
  private getCurrentMemoryUsage(): number {
    let totalSize = 0;
    this.cache.forEach(value => {
      totalSize += new Blob([JSON.stringify(value)]).size;
    });
    return totalSize / (1024 * 1024); // Convert to MB
  }
  
  private evictLeastRecentlyUsed(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    this.accessOrder.forEach((time, key) => {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
      console.log(`[Cache] Evicted ${oldestKey} (LRU)`);
    }
  }
  
  getStats() {
    return {
      size: this.cache.size,
      memoryUsageMB: this.getCurrentMemoryUsage(),
      maxMemoryMB: this.maxMemoryMB
    };
  }
}

/**
 * Intersection Observer utility for lazy loading components
 */
export function createLazyObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px', // Load when element is 50px away from viewport
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, defaultOptions);
}

/**
 * Bundle size monitor (development only)
 */
export function monitorBundleSize() {
  if (process.env.NODE_ENV === 'development') {
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach(async (script) => {
      const src = (script as HTMLScriptElement).src;
      if (src && src.includes(window.location.origin)) {
        try {
          const response = await fetch(src, { method: 'HEAD' });
          const size = parseInt(response.headers.get('content-length') || '0', 10);
          totalSize += size;
          
          console.log(`[Bundle] ${src.split('/').pop()}: ${(size / 1024).toFixed(2)}KB`);
        } catch (error) {
          console.warn(`Failed to get size for ${src}:`, error);
        }
      }
    });
    
    setTimeout(() => {
      console.log(`[Bundle] Total estimated size: ${(totalSize / 1024).toFixed(2)}KB`);
    }, 1000);
  }
}