import { render, screen, fireEvent, act } from '@testing-library/react';
import { Alert, AlertsWrapper } from '../UI/components/alert/alert';
import { describe, test, expect, vi } from 'vitest';

describe('Alert Component', () => {
  test('renders alert with JSX message and severity', () => {
    render(
      <Alert
        message={<span data-testid="jsx-msg"><strong>Test</strong> message</span>}
        severity="info"
      />
    );

    const msgEl = screen.getByTestId('jsx-msg');
    expect(msgEl).toBeInTheDocument();
    expect(msgEl.textContent).toBe('Test message');
    expect(screen.getByText('INFO')).toBeInTheDocument();
  });

  test('does not render when message is empty', () => {
    const { container } = render(<Alert message="" />);
    expect(container.firstChild).toBeNull();
  });

  test('renders different severity types', () => {
    const severities = ['info', 'warning', 'error', 'success'] as const;

    severities.forEach(severity => {
      const { unmount } = render(
        <Alert
          message={`${severity} message`}
          severity={severity}
        />
      );

      expect(screen.getByText(`${severity.toUpperCase()}`)).toBeInTheDocument();
      expect(screen.getByText(`${severity} message`)).toBeInTheDocument();
      unmount();
    });
  });

  test('calls handleDismiss when dismiss button is clicked', () => {
    const handleDismiss = vi.fn();
    render(
      <Alert
        message="Test message"
        severity="info"
        handleDismiss={handleDismiss}
      />
    );

    const dismissButton = screen.getByRole('button');
    fireEvent.click(dismissButton);

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  test('auto-dismisses after timeout', () => {
    vi.useFakeTimers();
    const handleDismiss = vi.fn();

    render(
      <Alert
        message="Test message"
        severity="info"
        timeout={2}
        handleDismiss={handleDismiss}
      />
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(handleDismiss).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

describe('AlertsWrapper Component', () => {
  test('renders children correctly', () => {
    render(
      <AlertsWrapper>
        <div data-testid="test-child">Test Child</div>
      </AlertsWrapper>
    );

    const wrapper = screen.getByRole('alert');
    expect(wrapper).toHaveAttribute('aria-live', 'assertive');
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});