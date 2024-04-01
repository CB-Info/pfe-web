import { createContext, useContext, useRef, useState, ReactNode, FC } from "react";
import { Alert, AlertsWrapper } from "../UI/components/alert/alert";

// Définition du type de l'alerte
interface AlertType {
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

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

// Composant AlertsProvider
const AlertsProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  const addAlert = (alert: Omit<AlertType, 'id'>): string => {
    const id = Math.random().toString(36).slice(2, 9) + new Date().getTime().toString(36);
    setAlerts((prev) => [{ ...alert, id: id }, ...prev]);
    return id;
  }

  const dismissAlert = (id: string): void => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }

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

// Hook useAlerts
export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }

  const { addAlert, dismissAlert } = context;

  const [alertIds, setAlertIds] = useState<string[]>([]);
  const alertIdsRef = useRef<string[]>(alertIds);

  const addAlertWithId = (alert: Omit<AlertType, 'id'>): void => {
    const id = addAlert(alert);
    alertIdsRef.current.push(id);
    setAlertIds([...alertIdsRef.current]);
  }

  const clearAlerts = (): void => {
    alertIdsRef.current.forEach(dismissAlert);
    alertIdsRef.current = [];
    setAlertIds([]);
  }

  return { addAlert: addAlertWithId, clearAlerts };
}

export default AlertsProvider;