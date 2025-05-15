import { useState } from 'react';
import { Card } from '../../../data/models/card.model';
import { BaseContent } from '../../components/contents/base.content';
import TitleStyle from '../../style/title.style';
import { PanelContent } from '../../components/contents/panel.content';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress } from '@mui/material';
import { useAlerts } from '../../../contexts/alerts.context';
import CustomButton, { TypeButton, WidthButton } from '../../components/buttons/custom.button';
import Badge from '../../components/badge/badge';

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addAlert } = useAlerts();

  const handleCreateCard = () => {
    setSelectedCard(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleDeleteCard = async (card: Card) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      try {
        setIsLoading(true);
        // TODO: Implement delete logic
        addAlert({ 
          severity: 'success', 
          message: 'Carte supprimée avec succès',
          timeout: 3
        });
      } catch (error) {
        addAlert({ 
          severity: 'error', 
          message: 'Erreur lors de la suppression de la carte',
          timeout: 3
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <BaseContent>
      <div className="flex justify-between px-6 pt-8 items-center">
        <div className="flex items-center gap-4">
          <TitleStyle>Gestion des cartes</TitleStyle>
          <span className="text-sm text-gray-500">({cards.length} cartes)</span>
        </div>
        <CustomButton
          type={TypeButton.PRIMARY}
          onClick={handleCreateCard}
          width={WidthButton.SMALL}
          isLoading={false}
        >
          <AddIcon className="mr-2" />
          Nouvelle carte
        </CustomButton>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <PanelContent key={card.id} className="transition-transform duration-200 hover:scale-[1.02]">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{card.name}</h3>
                    <Badge label={card.isActive ? 'Active' : 'Inactive'} />
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      {card.dishes.length} plats
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditCard(card)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <EditIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <DeleteIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </PanelContent>
            ))}
          </div>
        </div>
      )}
    </BaseContent>
  );
}