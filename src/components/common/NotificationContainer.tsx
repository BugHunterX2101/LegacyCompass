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
        return <CheckCircleIcon className="h-5 w-5 text-emerald-400" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', progressColor: 'bg-emerald-400' };
      case 'error':
        return { bg: 'bg-red-500/10', border: 'border-red-500/25', progressColor: 'bg-red-400' };
      case 'warning':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/25', progressColor: 'bg-amber-400' };
      case 'info':
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/25', progressColor: 'bg-blue-400' };
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => {
        const styles = getStyles(notification.type);
        return (
          <div
            key={notification.id}
            className={`relative overflow-hidden rounded-xl border ${styles.border} shadow-2xl shadow-black/30 notification-enter`}
            style={{
              background: 'rgba(19, 23, 29, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
                  <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">{notification.message}</p>
                  {notification.action && (
                    <button
                      onClick={notification.action.onClick}
                      className="mt-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => notificationService.remove(notification.id)}
                  className="ml-3 flex-shrink-0 text-slate-500 hover:text-white transition-colors rounded-lg p-0.5"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Auto-dismiss progress bar */}
            <div 
              className={`notification-progress ${styles.progressColor} opacity-40`}
              style={{ animationDuration: '5s' }}
            />
          </div>
        );
      })}
    </div>
  );
};