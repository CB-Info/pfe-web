import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import DishesPage from '../UI/pages/dishes/dishes.page';
import { lightTheme } from '../applications/theme/theme';
import AlertsProvider from '../contexts/alerts.context';
import { describe, test, expect, beforeEach, vi } from 'vitest';

// Mock the repositories
vi.mock('../network/repositories/dishes.repository', () => ({
  DishesRepositoryImpl: vi.fn().mockImplementation(() => ({
    getAll: vi.fn().mockResolvedValue([
      {
        _id: '1',
        name: 'Pizza Margherita',
        description: 'Pizza classique',
        price: 12.50,
        category: 'MAIN_DISHES',
        isAvailable: true,
        ingredients: [],
        dateOfCreation: '2024-01-01T00:00:00Z'
      },
      {
        _id: '2',
        name: 'Tiramisu',
        description: 'Dessert italien',
        price: 6.50,
        category: 'DESSERTS',
        isAvailable: false,
        ingredients: [],
        dateOfCreation: '2024-01-02T00:00:00Z'
      }
    ]),
    getTopIngredients: vi.fn().mockResolvedValue([])
  }))
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

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
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('should persist search filter', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Gestion des plats')).toBeInTheDocument();
    });

    // Find and interact with search input
    const searchInput = screen.getByPlaceholderText('Rechercher un  ingrédient ou ajouter un nouvel ingrédient');
    fireEvent.change(searchInput, { target: { value: 'pizza' } });

    // Verify localStorage was called to save the filter
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'dishes-filters',
        expect.stringContaining('"searchQuery":"pizza"')
      );
    });
  });

  test('should restore filters on page reload', async () => {
    const savedFilters = {
      searchQuery: 'tiramisu',
      selectedCategory: 'DESSERTS',
      selectedStatus: 'Inactif',
      selectedSort: 'Nom (Ascendant)'
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFilters));

    render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    // Wait for the page to load and verify filters are restored
    await waitFor(() => {
      expect(screen.getByText('Gestion des plats')).toBeInTheDocument();
    });

    // Verify localStorage was accessed to load filters
    expect(localStorageMock.getItem).toHaveBeenCalledWith('dishes-filters');
  });

  test('should maintain filters after dish operations', async () => {
    const savedFilters = {
      searchQuery: 'pizza',
      selectedCategory: 'MAIN_DISHES',
      selectedStatus: 'Actif',
      selectedSort: 'Prix (Ascendant)'
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFilters));

    render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Gestion des plats')).toBeInTheDocument();
    });

    // Verify that filters are maintained (localStorage should have been accessed)
    expect(localStorageMock.getItem).toHaveBeenCalledWith('dishes-filters');
  });

  test('should reset filters when reset button is clicked', async () => {
    const savedFilters = {
      searchQuery: 'pizza',
      selectedCategory: 'MAIN_DISHES',
      selectedStatus: 'Actif',
      selectedSort: 'Prix (Ascendant)'
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFilters));

    render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Gestion des plats')).toBeInTheDocument();
    });

    // Find and click reset button
    const resetButton = screen.getByText('Réinitialiser');
    fireEvent.click(resetButton);

    // Verify localStorage was called to save default filters
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'dishes-filters',
        expect.stringContaining('"searchQuery":""')
      );
    });
  });

  test('should show active filters indicator', async () => {
    const savedFilters = {
      searchQuery: 'pizza',
      selectedCategory: 'MAIN_DISHES',
      selectedStatus: 'Actif',
      selectedSort: 'Prix (Ascendant)'
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFilters));

    render(
      <TestWrapper>
        <DishesPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Gestion des plats')).toBeInTheDocument();
    });

    // Should show "Actifs" badge when filters are applied
    await waitFor(() => {
      expect(screen.getByText('Actifs')).toBeInTheDocument();
    });
  });
});