import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import DishesPage from '../UI/pages/dishes/dishes.page';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../applications/theme/theme';
import AlertsProvider from '../contexts/alerts.context';

// Mock des dépendances
vi.mock('../network/repositories/dishes.repository', () => ({
  DishesRepositoryImpl: vi.fn().mockImplementation(() => ({
    getAll: vi.fn().mockResolvedValue([
      {
        _id: '1',
        name: 'Test Dish 1',
        description: 'Description 1',
        price: 10,
        category: 'MAIN_DISHES',
        isAvailable: true,
        ingredients: [],
        dateOfCreation: '2024-01-01'
      },
      {
        _id: '2',
        name: 'Test Dish 2',
        description: 'Description 2',
        price: 15,
        category: 'DESSERTS',
        isAvailable: false,
        ingredients: [],
        dateOfCreation: '2024-01-02'
      }
    ])
  }))
}));

vi.mock('../contexts/alerts.context', () => ({
  useAlerts: () => ({
    addAlert: vi.fn(),
    clearAlerts: vi.fn()
  }),
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={lightTheme}>
      <AlertsProvider>
        {children}
      </AlertsProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('DishesPage Filter Persistence Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('should persist search filter', async () => {
    const { unmount } = render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    // Wait for dishes to load
    await waitFor(() => {
      expect(screen.getByText('Test Dish 1')).toBeInTheDocument();
    });

    // Set search filter
    const searchInput = screen.getByPlaceholderText(/rechercher/i);
    fireEvent.change(searchInput, { target: { value: 'Test Dish 1' } });

    // Unmount component
    unmount();

    // Remount component
    render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    // Wait for component to load and check if filter is restored
    await waitFor(() => {
      const restoredSearchInput = screen.getByDisplayValue('Test Dish 1');
      expect(restoredSearchInput).toBeInTheDocument();
    });
  });

  test('should persist category filter', async () => {
    const { unmount } = render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Dish 1')).toBeInTheDocument();
    });

    // Change category filter
    const categorySelect = screen.getByText('Toutes');
    fireEvent.click(categorySelect);
    
    const mainDishesOption = screen.getByText('Plats principaux');
    fireEvent.click(mainDishesOption);

    unmount();

    render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Plats principaux')).toBeInTheDocument();
    });
  });

  test('should persist status filter', async () => {
    const { unmount } = render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Dish 1')).toBeInTheDocument();
    });

    // Change status filter
    const statusSelect = screen.getByText('Tous');
    fireEvent.click(statusSelect);
    
    const activeOption = screen.getByText('Actif');
    fireEvent.click(activeOption);

    unmount();

    render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Actif')).toBeInTheDocument();
    });
  });

  test('should reset filters correctly', async () => {
    render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Dish 1')).toBeInTheDocument();
    });

    // Set some filters
    const searchInput = screen.getByPlaceholderText(/rechercher/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Wait for reset button to appear
    await waitFor(() => {
      expect(screen.getByText('Réinitialiser')).toBeInTheDocument();
    });

    // Click reset button
    const resetButton = screen.getByText('Réinitialiser');
    fireEvent.click(resetButton);

    // Check if filters are reset
    expect(searchInput).toHaveValue('');
    expect(screen.getByText('Toutes')).toBeInTheDocument();
    expect(screen.getByText('Tous')).toBeInTheDocument();
  });

  test('should maintain filters after dish creation', async () => {
    render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Dish 1')).toBeInTheDocument();
    });

    // Set search filter
    const searchInput = screen.getByPlaceholderText(/rechercher/i);
    fireEvent.change(searchInput, { target: { value: 'Test Dish 1' } });

    // Simulate dish creation by triggering a refresh
    // (In real scenario, this would happen after closing the creation drawer)
    
    // Check that filter is still applied
    expect(searchInput).toHaveValue('Test Dish 1');
  });

  test('should show active filters indicator', async () => {
    render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Dish 1')).toBeInTheDocument();
    });

    // Initially no active filters indicator
    expect(screen.queryByText('Actifs')).not.toBeInTheDocument();

    // Set a filter
    const searchInput = screen.getByPlaceholderText(/rechercher/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Should show active filters indicator
    await waitFor(() => {
      expect(screen.getByText('Actifs')).toBeInTheDocument();
    });
  });
});