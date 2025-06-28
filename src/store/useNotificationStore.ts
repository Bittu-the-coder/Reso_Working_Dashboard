// stores/notificationStore.js
import { create } from "zustand";
import type { NotificationState, Notification } from "../types";

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications: Notification[]): void =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  addNotification: (notification: Notification): void =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead
        ? state.unreadCount
        : state.unreadCount + 1,
    })),

  markAsRead: (notificationId: string): void =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    }),

  deleteNotification: (notificationId: string): void =>
    set((state) => {
      const notification = state.notifications.find(
        (n) => n._id === notificationId
      );
      const updated = state.notifications.filter(
        (n) => n._id !== notificationId
      );
      return {
        notifications: updated,
        unreadCount: notification?.isRead
          ? state.unreadCount
          : state.unreadCount - 1,
      };
    }),

  clearNotifications: (): void => set({ notifications: [], unreadCount: 0 }),
}));
