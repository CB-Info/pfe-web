import React from 'react';
import { motion } from 'framer-motion';
import { OAuthButton } from './OAuthButton';
import { useOAuth } from '../../../hooks/useOAuth';
import { OAUTH_PROVIDERS } from '../../../config/oauth.config';

interface OAuthSectionProps {
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
  className?: string;
}

export const OAuthSection: React.FC<OAuthSectionProps> = ({
  title = "Connexion rapide",
  subtitle = "Connectez-vous avec votre compte préféré",
  onSuccess,
  className = ""
}) => {
  const { signInWithOAuth, isLoading } = useOAuth();

  const handleOAuthSignIn = async (providerId: string) => {
    try {
      const user = await signInWithOAuth(providerId);
      if (user && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // L'erreur est déjà gérée par le hook useOAuth
      console.error('OAuth sign-in failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`space-y-4 ${className}`}
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          {subtitle}
        </p>
      </div>

      <div className="space-y-3">
        {OAUTH_PROVIDERS.map((provider, index) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <OAuthButton
              provider={provider}
              onClick={handleOAuthSignIn}
              isLoading={isLoading}
            />
          </motion.div>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OAuthSection;