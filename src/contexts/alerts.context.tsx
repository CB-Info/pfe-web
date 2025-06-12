import { createContext, useState, ReactNode, FC, useCallback } from "react";
import { Alert, AlertsWrapper } from "../UI/components/alert/alert";

// Définition du type de l'alerte
export interface AlertType {
  id?: string;
  message: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
  timeout?: number;
}

// Définition du type pour le contexte
interface AlertsContextType {
  alerts: AlertType[];
  addAlert: (alert: Omit<AlertType, 'id'>) => string;
  dismissAlert: (id: string) => void;
}

export const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

// Composant AlertsProvider
const AlertsProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  const addAlert = useCallback((alert: Omit<AlertType, 'id'>): string => {
    const id = Math.random().toString(36).slice(2, 9) + new Date().getTime().toString(36);
    setAlerts((prev) => [{ ...alert, id: id }, ...prev]);
    return id;
  }, []);

  const dismissAlert = useCallback((id: string): void => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, dismissAlert }}>
      <AlertsWrapper>
        {alerts.map((alert) => (
          <Alert key={alert.id} {...alert} handleDismiss={() => dismissAlert(alert.id!)} />
        ))}
      </AlertsWrapper>
      {children}
    </AlertsContext.Provider>
  );
}

export default AlertsProvider;