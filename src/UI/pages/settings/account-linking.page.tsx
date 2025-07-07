import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PanelContent } from '../../components/contents/panel.content';
import { OAuthButton } from '../../components/auth/OAuthButton';
import { useOAuth } from '../../../hooks/useOAuth';
import { OAUTH_PROVIDERS } from '../../../config/oauth.config';
import { Shield, Unlink, CheckCircle, AlertTriangle } from 'lucide-react';
import { ConfirmationModal } from '../../components/modals/confirmation.modal';

export const AccountLinkingPage: React.FC = () => {
  const { linkAccount, unlinkAccount, getLinkedProviders, isLoading } = useOAuth();
  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);
  const [unlinkModalOpen, setUnlinkModalOpen] = useState(false);
  const [providerToUnlink, setProviderToUnlink] = useState<string>('');

  useEffect(() => {
    setLinkedProviders(getLinkedProviders());
  }, [getLinkedProviders]);

  const handleLinkAccount = async (providerId: string) => {
    try {
      await linkAccount(providerId);
      setLinkedProviders(getLinkedProviders());
    } catch (error) {
      console.error('Failed to link account:', error);
    }
  };

  const handleUnlinkAccount = async (providerId: string) => {
    setProviderToUnlink(providerId);
    setUnlinkModalOpen(true);
  };

  const confirmUnlink = async () => {
    if (providerToUnlink) {
      try {
        await unlinkAccount(providerToUnlink);
        setLinkedProviders(getLinkedProviders());
      } catch (error) {
        console.error('Failed to unlink account:', error);
      }
    }
    setUnlinkModalOpen(false);
    setProviderToUnlink('');
  };

  const isProviderLinked = (providerId: string) => {
    return linkedProviders.includes(providerId);
  };

  const canUnlink = linkedProviders.length > 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold">Comptes liés</h2>
          <p className="text-sm text-gray-600">
            Gérez les méthodes de connexion à votre compte
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Sécurité renforcée</h3>
            <p className="text-sm text-blue-700 mt-1">
              Liez plusieurs comptes pour une connexion plus flexible et sécurisée.
              Vous pourrez vous connecter avec n'importe lequel de vos comptes liés.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Linked Accounts */}
      <PanelContent>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Méthodes de connexion</h3>
          
          <div className="space-y-4">
            {OAUTH_PROVIDERS.map((provider, index) => {
              const isLinked = isProviderLinked(provider.id);
              
              return (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {/* Provider icon would go here */}
                      <span className="text-sm font-medium">
                        {provider.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{provider.name}</h4>
                      <p className="text-sm text-gray-600">
                        {isLinked ? 'Compte lié' : 'Non lié'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLinked ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <button
                          onClick={() => handleUnlinkAccount(provider.id)}
                          disabled={!canUnlink || isLoading}
                          className={`
                            px-3 py-1 text-sm rounded-md transition-colors duration-200
                            ${canUnlink && !isLoading
                              ? 'text-red-600 hover:bg-red-50 border border-red-200'
                              : 'text-gray-400 cursor-not-allowed border border-gray-200'
                            }
                          `}
                        >
                          <Unlink className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="w-32">
                        <OAuthButton
                          provider={provider}
                          onClick={handleLinkAccount}
                          isLoading={isLoading}
                          className="text-xs py-2"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Warning for single provider */}
          {linkedProviders.length === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">
                    Une seule méthode de connexion
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Nous recommandons de lier au moins deux comptes pour éviter 
                    de perdre l'accès à votre compte.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </PanelContent>

      {/* Unlink Confirmation Modal */}
      <ConfirmationModal
        modalName="unlink-account-modal"
        isOpen={unlinkModalOpen}
        onClose={() => setUnlinkModalOpen(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Délier le compte {providerToUnlink}
          </h3>
          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir délier ce compte ? Vous ne pourrez plus 
            vous connecter avec cette méthode.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setUnlinkModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              onClick={confirmUnlink}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Délier
            </button>
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default AccountLinkingPage;