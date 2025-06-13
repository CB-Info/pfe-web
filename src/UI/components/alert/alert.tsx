import React, { useEffect, ReactNode } from "react";
import { classNames, svgFillColors, svgPaths } from "./severity-styles";

// Définition des types pour les props de Alert
interface AlertProps {
  message?: ReactNode;
  severity?: 'info' | 'warning' | 'error' | 'success'; // Supposons que ce sont vos seules valeurs possibles pour severity
  timeout?: number;
  handleDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message = null, severity = 'info', timeout = 0, handleDismiss = null }) => {
  useEffect(() => {
    if (timeout > 0 && handleDismiss) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, timeout * 1000);
      return () => clearTimeout(timer);
    }
  }, [timeout, handleDismiss]);

  const dismissAlert = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (handleDismiss) {
      handleDismiss();
    }
  };

  const isMessageEmpty =
    message === null ||
    message === undefined ||
    (typeof message === 'string' && message.trim().length === 0);

  return !isMessageEmpty ? (
    <div className={classNames[severity] + " rounded-b px-4 py-3 mb-4 shadow-md pointer-events-auto"} role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className={"fill-current h-6 w-6 mr-4 " + svgFillColors[severity]} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d={svgPaths[severity]!} />
          </svg>
        </div>
        <div>
          <p className="font-bold">{severity.toUpperCase()}</p>
          <p className="text-sm">{message}</p>
        </div>
        {handleDismiss && (
          <div className="ml-auto">
            <button className="text-sm font-bold" type="button" onClick={dismissAlert}>
              <svg className="fill-current h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M6.83 5L10 8.17 13.17 5 15 6.83 11.83 10 15 13.17 13.17 15 10 11.83 6.83 15 5 13.17 8.17 10 5 6.83 6.83 5z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

// Définition des types pour les props de AlertsWrapper
interface AlertsWrapperProps {
  children: ReactNode;
}

const AlertsWrapper: React.FC<AlertsWrapperProps> = ({ children }) => {
  return (
    <div
      className="fixed top-0 right-0 p-4 z-[100] pointer-events-none max-w-sm min-w-fit w-full"
      role="alert"
      aria-live="assertive"
    >
      {children}
    </div>
  );
};

export { Alert, AlertsWrapper };