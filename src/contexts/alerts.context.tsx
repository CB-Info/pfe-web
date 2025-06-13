import { createContext, useContext, useRef, useState, ReactNode, FC } from "react";
import { Alert, AlertsWrapper } from "../UI/components/alert/alert";

// Définition du type de l'alerte
interface AlertType {
  id?: string;
  message: ReactNode;
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

const defaultDurations: Record<'info' | 'warning' | 'error' | 'success', number> = {
  info: 5,
  warning: 5,
  error: 7,
  success: 5,
};

// Composant AlertsProvider
const AlertsProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  const addAlert = (alert: Omit<AlertType, 'id'>): string => {
    const id = crypto.randomUUID();
    const timeout = alert.timeout ?? defaultDurations[alert.severity ?? 'info'];
    setAlerts((prev) => [{ ...alert, id: id, timeout }, ...prev]);
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