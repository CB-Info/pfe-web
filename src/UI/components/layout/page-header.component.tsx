import React from 'react';
import { motion } from 'framer-motion';
import CustomButton from '../buttons/custom.button';
import { TypeButton, WidthButton } from '../buttons/button.types';

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  createButtonLabel?: string;
}

/**
 * Composant d'en-tête de page réutilisable avec les éléments dynamiques suivants :
 * - Icon: Tout nœud React à afficher comme icône d'en-tête
 * - Title: Texte du titre principal
 * - Description: Texte de sous-titre sous le titre
 * - Bouton de création optionnel : Pour les pages qui nécessitent une fonctionnalité de création d'entité
 * 
 * Exemple d'utilisation :
 * <PageHeader
 *   icon={<MenuIcon />}
 *   title="Cartes de menu"
 *   description="Gérez vos cartes de menu de restaurant"
 *   showCreateButton={true}
 *   onCreateClick={() => handleCreate()}
 *   createButtonLabel="Nouvelle carte"
 * />
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  description,
  showCreateButton = false,
  onCreateClick,
  createButtonLabel = "Créer"
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-6 flex-shrink-0"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="text-gray-600 text-sm mt-1">
              {description}
            </p>
          </div>
        </div>
        
        {showCreateButton && onCreateClick && (
          <CustomButton
            type={TypeButton.PRIMARY}
            onClick={onCreateClick}
            width={WidthButton.MEDIUM}
            isLoading={false}
          >
            {createButtonLabel}
          </CustomButton>
        )}
      </div>
    </motion.div>
  );
};