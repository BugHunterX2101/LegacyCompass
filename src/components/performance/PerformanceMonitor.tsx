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
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMetrics = performanceService.getPerformanceMetrics();
      setMetrics({ ...newMetrics, memoryUsage: newMetrics.memoryUsage ?? 0 });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-4 right-4 bg-[#1E2328] border border-gray-700 rounded-lg p-2 text-xs z-50 text-gray-400 hover:text-white transition-colors"
        title="Show performance monitor"
      >
        <CpuChipIcon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-[#1E2328] border border-gray-700 rounded-lg text-xs z-50 shadow-lg">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/60">
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-white font-medium flex items-center gap-1 hover:text-blue-300 transition-colors"
          title={expanded ? "Collapse" : "Expand"}
        >
          <CpuChipIcon className="h-3.5 w-3.5" />
          Perf
        </button>
        <button
          onClick={() => setVisible(false)}
          className="ml-3 text-gray-500 hover:text-gray-300 transition-colors leading-none"
          title="Hide monitor"
        >
          ✕
        </button>
      </div>
      {expanded && (
        <div className="px-3 py-2 space-y-1 text-gray-400">
          <div className="flex items-center justify-between gap-4">
            <span>Cache:</span>
            <span className="text-white">{metrics.cacheSize}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Queue:</span>
            <span className="text-white">{metrics.queueLength}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Requests:</span>
            <span className="text-white">{metrics.currentRequests}</span>
          </div>
          {metrics.memoryUsage > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span>Memory:</span>
              <span className="text-white">{metrics.memoryUsage.toFixed(1)}MB</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};