import { render, screen, fireEvent } from '@testing-library/react';
import AlertsProvider, { useAlerts } from '../contexts/alerts.context';
import { describe, test, expect, beforeEach } from 'vitest';

const TestComponent = () => {
  const { addAlert } = useAlerts();
  return <button onClick={() => addAlert({ message: 'persisted', persist: true })}>add</button>;
};

describe('AlertsProvider persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('stores alert in localStorage when persist is true', () => {
    render(
      <AlertsProvider>
        <TestComponent />
      </AlertsProvider>
    );

    fireEvent.click(screen.getByText('add'));
    const stored = JSON.parse(localStorage.getItem('persistedAlerts') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].message).toBe('persisted');
  });

  test('loads persisted alerts on init', () => {
    const alert = { id: '1', message: 'hello', severity: 'info', timeout: 5, priority: 0, persist: true };
    localStorage.setItem('persistedAlerts', JSON.stringify([alert]));

    render(
      <AlertsProvider>
        <div />
      </AlertsProvider>
    );

    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  test('removes persisted alert from storage when dismissed', () => {
    const alert = { id: '1', message: 'bye', severity: 'info', timeout: 5, priority: 0, persist: true };
    localStorage.setItem('persistedAlerts', JSON.stringify([alert]));

    render(
      <AlertsProvider>
        <div />
      </AlertsProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const stored = JSON.parse(localStorage.getItem('persistedAlerts') || '[]');
    expect(stored.length).toBe(0);
  });
});
