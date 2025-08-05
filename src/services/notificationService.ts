export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationService {
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private notifications: Notification[] = [];

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  show(notification: Omit<Notification, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification
    };

    this.notifications.push(newNotification);
    this.notify();

    // Auto-remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newNotification.duration);
    }

    return id;
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.notify();
  }

  success(title: string, message: string, action?: Notification['action']) {
    return this.show({ type: 'success', title, message, action });
  }

  error(title: string, message: string, action?: Notification['action']) {
    return this.show({ type: 'error', title, message, action, duration: 0 }); // Don't auto-dismiss errors
  }

  warning(title: string, message: string, action?: Notification['action']) {
    return this.show({ type: 'warning', title, message, action });
  }

  info(title: string, message: string, action?: Notification['action']) {
    return this.show({ type: 'info', title, message, action });
  }
}

export const notificationService = new NotificationService();