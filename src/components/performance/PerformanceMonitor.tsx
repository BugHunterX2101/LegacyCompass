import React, { useState, useEffect } from 'react';
import { performanceService } from '../../services/performanceService';
import { CpuChipIcon } from '@heroicons/react/24/outline';

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState({
    cacheSize: 0,
    queueLength: 0,
    currentRequests: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newMetrics = performanceService.getPerformanceMetrics();
      setMetrics(newMetrics);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-[#1E2328] border border-gray-700 rounded-lg p-4 text-xs z-50">
      <h4 className="text-white font-medium mb-2 flex items-center">
        <CpuChipIcon className="h-4 w-4 mr-1" />
        Performance
      </h4>
      <div className="space-y-1 text-gray-400">
        <div className="flex items-center justify-between">
          <span>Cache:</span>
          <span className="text-white">{metrics.cacheSize}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Queue:</span>
          <span className="text-white">{metrics.queueLength}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Requests:</span>
          <span className="text-white">{metrics.currentRequests}</span>
        </div>
        {metrics.memoryUsage > 0 && (
          <div className="flex items-center justify-between">
            <span>Memory:</span>
            <span className="text-white">{metrics.memoryUsage.toFixed(1)}MB</span>
          </div>
        )}
      </div>
    </div>
  );
};