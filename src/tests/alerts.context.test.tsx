import { render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import AlertsProvider, { useAlerts } from '../contexts/alerts.context';
import { describe, test, expect, vi } from 'vitest';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div data-testid="motion-div" {...rest}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>,
}));

const AddAlertComponent: React.FC = () => {
  const { addAlert } = useAlerts();
  useEffect(() => {
    addAlert({ message: 'Test alert' });
  }, [addAlert]);
  return null;
};

describe('AlertsProvider motion components', () => {
  test('renders motion.div and AnimatePresence', async () => {
    render(
      <AlertsProvider>
        <AddAlertComponent />
      </AlertsProvider>
    );

    expect(await screen.findByTestId('animate-presence')).toBeInTheDocument();
    expect(await screen.findByTestId('motion-div')).toBeInTheDocument();
  });
});
