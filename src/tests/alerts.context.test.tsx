import { render, screen, fireEvent, within } from '@testing-library/react';
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

  test('updates alert when same groupId is added', () => {
    const GroupComp = () => {
      const { addAlert } = useAlerts();
      return (
        <>
          <button onClick={() => addAlert({ message: 'first', groupId: 'g1' })}>first</button>
          <button onClick={() => addAlert({ message: 'second', groupId: 'g1' })}>second</button>
        </>
      );
    };

    render(
      <AlertsProvider>
        <GroupComp />
      </AlertsProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'first' }));
    let alertEl = screen.getByRole('alert');
    expect(within(alertEl).getByText('first')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'second' }));
    alertEl = screen.getByRole('alert');
    expect(within(alertEl).queryByText('first')).toBeNull();
    expect(within(alertEl).getByText('second')).toBeInTheDocument();
  });

  test('persisted alert updates when using the same groupId', () => {
    const PersistComp = () => {
      const { addAlert } = useAlerts();
      return (
        <>
          <button onClick={() => addAlert({ message: 'p1', groupId: 'gp', persist: true })}>one</button>
          <button onClick={() => addAlert({ message: 'p2', groupId: 'gp', persist: true })}>two</button>
        </>
      );
    };

    render(
      <AlertsProvider>
        <PersistComp />
      </AlertsProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'one' }));
    fireEvent.click(screen.getByRole('button', { name: 'two' }));

    const stored = JSON.parse(localStorage.getItem('persistedAlerts') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].message).toBe('p2');
  });
});
