import { render, screen, fireEvent } from '@testing-library/react';
import { useEffect } from 'react';
import AlertsProvider, { useAlerts, AlertType } from '../contexts/alerts.context';
import { describe, test, expect } from 'vitest';

const TestHarness = ({ alerts }: { alerts: Omit<AlertType, 'id'>[] }) => {
  const { addAlert } = useAlerts();
  useEffect(() => {
    alerts.forEach(addAlert);
  }, [alerts, addAlert]);
  return null;
};

describe('AlertsProvider queue', () => {
  test('extra alerts wait in queue until space is available', async () => {
    render(
      <AlertsProvider>
        <TestHarness
          alerts={[
            { message: 'A1', priority: 0 },
            { message: 'A2', priority: 0 },
            { message: 'A3', priority: 0 },
            { message: 'A4', priority: 0 },
          ]}
        />
      </AlertsProvider>
    );

    expect(screen.getAllByRole('alert')).toHaveLength(3);
    expect(screen.queryByText('A4')).toBeNull();

    const dismissBtn = screen.getAllByRole('button')[0];
    fireEvent.click(dismissBtn);

    expect(await screen.findByText('A4')).toBeInTheDocument();
  });

  test('queued alerts are shown in order of priority', async () => {
    render(
      <AlertsProvider>
        <TestHarness
          alerts={[
            { message: 'B1', priority: 0 },
            { message: 'B2', priority: 0 },
            { message: 'B3', priority: 0 },
            { message: 'B4', priority: 1 },
            { message: 'B5', priority: 10 },
          ]}
        />
      </AlertsProvider>
    );

    expect(screen.queryByText('B4')).toBeNull();
    expect(screen.queryByText('B5')).toBeNull();

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(await screen.findByText('B5')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(await screen.findByText('B4')).toBeInTheDocument();
  });
});
