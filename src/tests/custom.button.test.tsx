import { render, screen, fireEvent } from '@testing-library/react';
import CustomButton from '../UI/components/buttons/custom.button';
import { TypeButton, WidthButton } from '../UI/components/buttons/button.types';
import { describe, test, expect, vi, beforeEach } from 'vitest';

describe('CustomButton Component', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('renders primary button with correct text', () => {
    render(
      <CustomButton
        type={TypeButton.PRIMARY}
        onClick={mockOnClick}
        width={WidthButton.MEDIUM}
        isLoading={false}
      >
        Click me
      </CustomButton>
    );

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('renders secondary button with correct text', () => {
    render(
      <CustomButton
        type={TypeButton.SECONDARY}
        onClick={mockOnClick}
        width={WidthButton.MEDIUM}
        isLoading={false}
      >
        Secondary Button
      </CustomButton>
    );

    expect(screen.getByText('Secondary Button')).toBeInTheDocument();
  });

  test('renders text button with correct text', () => {
    render(
      <CustomButton
        type={TypeButton.TEXT}
        onClick={mockOnClick}
        width={WidthButton.MEDIUM}
        isLoading={false}
      >
        Text Button
      </CustomButton>
    );

    expect(screen.getByText('Text Button')).toBeInTheDocument();
  });

  test('calls onClick when button is clicked', () => {
    render(
      <CustomButton
        type={TypeButton.PRIMARY}
        onClick={mockOnClick}
        width={WidthButton.MEDIUM}
        isLoading={false}
      >
        Click me
      </CustomButton>
    );

    fireEvent.click(screen.getByText('Click me'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when button is disabled', () => {
    render(
      <CustomButton
        type={TypeButton.PRIMARY}
        onClick={mockOnClick}
        width={WidthButton.MEDIUM}
        isLoading={false}
        isDisabled={true}
      >
        Click me
      </CustomButton>
    );

    fireEvent.click(screen.getByText('Click me'));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('does not call onClick when button is loading', () => {
    render(
      <CustomButton
        type={TypeButton.PRIMARY}
        onClick={mockOnClick}
        width={WidthButton.MEDIUM}
        isLoading={true}
      >
        Click me
      </CustomButton>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('shows loading spinner when isLoading is true', () => {
    render(
      <CustomButton
        type={TypeButton.PRIMARY}
        onClick={mockOnClick}
        width={WidthButton.MEDIUM}
        isLoading={true}
      >
        Click me
      </CustomButton>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders with different width sizes', () => {
    const widths = [WidthButton.SMALL, WidthButton.MEDIUM, WidthButton.LARGE];

    widths.forEach(width => {
      const { unmount } = render(
        <CustomButton
          type={TypeButton.PRIMARY}
          onClick={mockOnClick}
          width={width}
          isLoading={false}
        >
          Button
        </CustomButton>
      );

      const button = screen.getByText('Button');
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  test('renders with different input types', () => {
    const inputTypes = ['button', 'submit', 'reset'] as const;

    inputTypes.forEach(inputType => {
      const { unmount } = render(
        <CustomButton
          type={TypeButton.PRIMARY}
          onClick={mockOnClick}
          width={WidthButton.MEDIUM}
          isLoading={false}
          inputType={inputType}
        >
          Button
        </CustomButton>
      );

      const button = screen.getByText('Button');
      expect(button).toHaveAttribute('type', inputType);
      unmount();
    });
  });
});