// stores/index.js
import { useAuthStore } from "./useAuthStore";
import { useTeamStore } from "./useTeamStore";
import { useNotificationStore } from "./useNotificationStore";
import { useDocumentStore } from "./useDocumentStore";
import { useTaskStore } from "./useTaskStore";
import { useEventStore } from "./useEventStore";
import { useProjectStore } from "./useProjectStore";

export const useStore = () => ({
  auth: useAuthStore(),
  team: useTeamStore(),
  notification: useNotificationStore(),
  document: useDocumentStore(),
  task: useTaskStore(),
  event: useEventStore(),
  project: useProjectStore(),
});
