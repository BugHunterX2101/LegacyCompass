import React, { useState, useEffect } from 'react';
import { notificationService, Notification } from '../../services/notificationService';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

export const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'border-green-500/40';
      case 'error':   return 'border-red-500/40';
      case 'warning': return 'border-yellow-500/40';
      case 'info':    return 'border-blue-500/40';
    }
  };

  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-[#1E2328]/95 backdrop-blur-sm';
      case 'error':   return 'bg-[#1E2328]/95 backdrop-blur-sm';
      case 'warning': return 'bg-[#1E2328]/95 backdrop-blur-sm';
      case 'info':    return 'bg-[#1E2328]/95 backdrop-blur-sm';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[60] space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} border ${getBorderColor(notification.type)} text-white p-4 rounded-lg shadow-2xl shadow-black/40 animate-slide-in-right`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-semibold text-slate-100">{notification.title}</h4>
              <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  {notification.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => notificationService.remove(notification.id)}
              className="ml-3 flex-shrink-0 text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};