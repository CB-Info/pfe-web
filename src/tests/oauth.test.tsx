import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OAuthButton } from '../UI/components/auth/OAuthButton';
import { OAuthSection } from '../UI/components/auth/OAuthSection';
import { useOAuth } from '../hooks/useOAuth';
import { OAUTH_PROVIDERS } from '../config/oauth.config';

// Mock du hook useOAuth
vi.mock('../hooks/useOAuth');
const mockUseOAuth = vi.mocked(useOAuth);

// Mock des contextes
vi.mock('../contexts/alerts.context', () => ({
  useAlerts: () => ({
    addAlert: vi.fn()
  })
}));

describe('OAuthButton Component', () => {
  const mockProvider = OAUTH_PROVIDERS[0]; // Google
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders OAuth button with provider name', () => {
    render(
      <OAuthButton
        provider={mockProvider}
        onClick={mockOnClick}
        isLoading={false}
      />
    );

    expect(screen.getByText(`Continuer avec ${mockProvider.name}`)).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    render(
      <OAuthButton
        provider={mockProvider}
        onClick={mockOnClick}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledWith(mockProvider.id);
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <OAuthButton
        provider={mockProvider}
        onClick={mockOnClick}
        isLoading={true}
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText(`Continuer avec ${mockProvider.name}`)).not.toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <OAuthButton
        provider={mockProvider}
        onClick={mockOnClick}
        isLoading={false}
        disabled={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});

describe('OAuthSection Component', () => {
  const mockSignInWithOAuth = vi.fn();

  beforeEach(() => {
    mockUseOAuth.mockReturnValue({
      signInWithOAuth: mockSignInWithOAuth,
      isLoading: false,
      error: null,
      linkAccount: vi.fn(),
      unlinkAccount: vi.fn(),
      getLinkedProviders: vi.fn(() => []),
      clearError: vi.fn()
    });
    mockSignInWithOAuth.mockClear();
  });

  it('renders all OAuth providers', () => {
    render(<OAuthSection />);

    OAUTH_PROVIDERS.forEach(provider => {
      expect(screen.getByText(`Continuer avec ${provider.name}`)).toBeInTheDocument();
    });
  });

  it('renders custom title and subtitle', () => {
    const customTitle = "Custom Title";
    const customSubtitle = "Custom Subtitle";

    render(
      <OAuthSection 
        title={customTitle}
        subtitle={customSubtitle}
      />
    );

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customSubtitle)).toBeInTheDocument();
  });

  it('calls signInWithOAuth when provider button is clicked', async () => {
    mockSignInWithOAuth.mockResolvedValue({ uid: 'test-uid' });

    render(<OAuthSection />);

    const googleButton = screen.getByText('Continuer avec Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith('google');
    });
  });

  it('calls onSuccess callback when sign-in is successful', async () => {
    const mockOnSuccess = vi.fn();
    mockSignInWithOAuth.mockResolvedValue({ uid: 'test-uid' });

    render(<OAuthSection onSuccess={mockOnSuccess} />);

    const googleButton = screen.getByText('Continuer avec Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles sign-in failure gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSignInWithOAuth.mockRejectedValue(new Error('Sign-in failed'));

    render(<OAuthSection />);

    const googleButton = screen.getByText('Continuer avec Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('OAuth sign-in failed:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('shows loading state for all buttons when isLoading is true', () => {
    mockUseOAuth.mockReturnValue({
      signInWithOAuth: mockSignInWithOAuth,
      isLoading: true,
      error: null,
      linkAccount: vi.fn(),
      unlinkAccount: vi.fn(),
      getLinkedProviders: vi.fn(() => []),
      clearError: vi.fn()
    });

    render(<OAuthSection />);

    // Vérifie que tous les boutons montrent l'état de chargement
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(OAUTH_PROVIDERS.length);
  });
});

describe('OAuth Configuration', () => {
  it('has correct provider configurations', () => {
    expect(OAUTH_PROVIDERS).toHaveLength(3);
    
    const providerIds = OAUTH_PROVIDERS.map(p => p.id);
    expect(providerIds).toContain('google');
    expect(providerIds).toContain('github');
    expect(providerIds).toContain('microsoft');
  });

  it('has valid scope configurations', () => {
    expect(OAUTH_CONFIG.scopes.google).toContain('email');
    expect(OAUTH_CONFIG.scopes.google).toContain('profile');
    expect(OAUTH_CONFIG.scopes.github).toContain('user:email');
    expect(OAUTH_CONFIG.scopes.microsoft).toContain('email');
    expect(OAUTH_CONFIG.scopes.microsoft).toContain('profile');
  });
});