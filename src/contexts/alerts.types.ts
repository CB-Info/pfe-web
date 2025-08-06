import { ReactNode } from "react";

// Définition du type de l'alerte
export interface AlertType {
  id?: string;
  groupId?: string;
  message: ReactNode;
  severity?: 'info' | 'warning' | 'error' | 'success';
  timeout?: number;
  priority?: number;
  persist?: boolean;
}