import { createContext, useContext, useRef, useState, useEffect, ReactNode, FC } from "react";
import { Alert, AlertsWrapper } from "../UI/components/alert/alert";
import { motion, AnimatePresence } from "framer-motion";

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
const MAX_VISIBLE_ALERTS = 3;
const STORAGE_KEY = 'persistedAlerts';

const loadPersistedAlerts = (): AlertType[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as AlertType[] : [];
  } catch {
    return [];
  }
};

const savePersistedAlerts = (alerts: AlertType[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
};

const addPersistedAlert = (alert: AlertType): void => {
  const stored = loadPersistedAlerts();
  savePersistedAlerts([...stored, alert]);
};

const removePersistedAlert = (id: string): void => {
  const stored = loadPersistedAlerts();
  const updated = stored.filter(a => a.id !== id);
  savePersistedAlerts(updated);
};

const updatePersistedAlert = (groupId: string, updatedData: AlertType): void => {
  const stored = loadPersistedAlerts();
  const idx = stored.findIndex(a => a.groupId === groupId);
  if (idx !== -1) {
    stored[idx] = { ...stored[idx], ...updatedData };
  } else {
    stored.push(updatedData);
  }
  savePersistedAlerts(stored);
};

const AlertsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [queue, setQueue] = useState<AlertType[]>([]);

  // load persisted alerts on mount
  useEffect(() => {
    const persisted = loadPersistedAlerts();
    if (persisted.length > 0) {
      const visible = persisted.slice(0, MAX_VISIBLE_ALERTS);
      const queued = persisted.slice(MAX_VISIBLE_ALERTS);
      setAlerts(visible);
      setQueue(queued);
    }
  }, []);

  const addAlert = (alert: Omit<AlertType, 'id'>): string => {
    const timeout = alert.timeout ?? defaultDurations[alert.severity ?? 'info'];
    const priority = alert.priority ?? 0;

    if (alert.groupId) {
      const existingAlert = alerts.find(a => a.groupId === alert.groupId) ||
        queue.find(a => a.groupId === alert.groupId);

      if (existingAlert) {
        const updated: AlertType = {
          ...existingAlert,
          ...alert,
          id: existingAlert.id,
          timeout,
          priority,
        };

        if (existingAlert.persist && !updated.persist) {
          removePersistedAlert(existingAlert.id!);
        } else if (updated.persist) {
          updatePersistedAlert(updated.groupId!, updated);
        }

        if (alerts.some(a => a.id === existingAlert.id)) {
          setAlerts(prev => prev.map(a => a.id === existingAlert.id ? updated : a));
        } else {
          setQueue(prev => {
            const q = prev.map(a => a.id === existingAlert.id ? updated : a);
            q.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
            return q;
          });
        }

        return existingAlert.id!;
      }
    }

    const id = crypto.randomUUID();
    const newAlert: AlertType = { ...alert, id, timeout, priority };

    if (newAlert.persist) {
      addPersistedAlert(newAlert);
    }

    if (alerts.length < MAX_VISIBLE_ALERTS) {
      setAlerts(prev => [newAlert, ...prev]);
    } else {
      setQueue(prev => {
        const q = [...prev, newAlert];
        q.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
        return q;
      });
    }

    return id;
  };

  const dismissAlert = (id: string): void => {
    setAlerts((prev) => {
      const toRemove = prev.find(a => a.id === id);
      if (toRemove?.persist) {
        removePersistedAlert(id);
      }
      return prev.filter((alert) => alert.id !== id);
    });
  };

  // When space is available, move alerts from the queue
  useEffect(() => {
    if (alerts.length < MAX_VISIBLE_ALERTS && queue.length > 0) {
      const [next, ...rest] = queue;
      setQueue(rest);
      setAlerts((prev) => [next, ...prev]);
    }
  }, [alerts, queue]);

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, dismissAlert }}>
      <AlertsWrapper>
        <AnimatePresence initial={false}>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <Alert {...alert} handleDismiss={() => dismissAlert(alert.id!)} />
            </motion.div>
          ))}
        </AnimatePresence>
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