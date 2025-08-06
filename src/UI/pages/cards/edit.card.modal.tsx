import { useState, useEffect } from "react";
import { FullScreenModal } from "../../components/modals/full-screen-modal";
import { ConfirmationModal } from "../../components/modals/confirmation.modal";
import { TextInput } from "../../components/input/textInput";
import { CardsRepositoryImpl } from "../../../network/repositories/cards.repository";
import { DishesRepositoryImpl } from "../../../network/repositories/dishes.repository";
import { useAlerts } from "../../../hooks/useAlerts";
import { Dish } from "../../../data/models/dish.model";
import { CardDto } from "../../../data/dto/card.dto";
import Loading from "../../components/common/loading.component";
import { EnhancedDishSelection } from "../../components/cards/dish-selection/enhanced-dish-selection.component";
import { Save, X, Trash2, AlertTriangle } from "lucide-react";

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardDto;
  onCardUpdated: (card: CardDto) => void;
  onCardDeleted: (cardId: string) => void;
}

export const EditCardModal: React.FC<EditCardModalProps> = ({
  isOpen,
  onClose,
  card,
  onCardUpdated,
  onCardDeleted,
}) => {
  const [name, setName] = useState(card.name);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDishes, setSelectedDishes] = useState<Set<string>>(
    new Set(card.dishesId)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const { addAlert } = useAlerts();
  const dishesRepository = new DishesRepositoryImpl();
  const cardsRepository = new CardsRepositoryImpl();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setIsLoading(true);
        const fetchedDishes = await dishesRepository.getAll();
        setDishes(fetchedDishes);
      } catch (error) {
        setError("Erreur lors de la récupération des plats");
        addAlert({
          severity: "error",
          message: "Erreur lors de la récupération des plats",
          timeout: 5,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchDishes();
    }
  }, [isOpen]);

  // Reset form when card changes
  useEffect(() => {
    setName(card.name);
    setSelectedDishes(new Set(card.dishesId));
    setError("");
  }, [card]);

  const handleClose = () => {
    setName(card.name);
    setSelectedDishes(new Set(card.dishesId));
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError("Le nom de la carte est requis");
      addAlert({
        severity: "error",
        message: "Le nom de la carte est requis",
        timeout: 3,
      });
      return;
    }

    if (selectedDishes.size === 0) {
      setError("Sélectionnez au moins un plat");
      addAlert({
        severity: "error",
        message: "Sélectionnez au moins un plat pour la carte",
        timeout: 3,
      });
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const updatedCard = await cardsRepository.update({
        _id: card._id,
        name: name.trim(),
        dishesId: Array.from(selectedDishes),
        isActive: card.isActive,
        dateOfCreation: card.dateOfCreation,
      });

      addAlert({
        severity: "success",
        message: `La carte "${updatedCard.name}" a été mise à jour avec succès`,
        timeout: 3,
      });

      onCardUpdated(updatedCard);
      handleClose();
    } catch (error) {
      const errorMessage = "Erreur lors de la mise à jour de la carte";
      setError(errorMessage);
      addAlert({
        severity: "error",
        message: errorMessage,
        timeout: 5,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onCardDeleted(card._id);
      addAlert({
        severity: "success",
        message: `La carte "${card.name}" a été supprimée avec succès`,
        timeout: 3,
      });
      handleClose();
    } catch (error) {
      addAlert({
        severity: "error",
        message: "Erreur lors de la suppression de la carte",
        timeout: 5,
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  // Check if there are unsaved changes
  const hasChanges =
    name !== card.name ||
    selectedDishes.size !== card.dishesId.length ||
    !Array.from(selectedDishes).every((id) => card.dishesId.includes(id));

  return (
    <>
      <FullScreenModal
        isOpen={isOpen}
        onClose={handleClose}
        title={`Modifier la carte "${card.name}"`}
        maxWidth="6xl"
      >
        <div className="flex flex-col h-full">
          {/* Form Section */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 max-w-md">
                <TextInput
                  name="cardName"
                  label="Nom de la carte"
                  value={name}
                  onChange={setName}
                  $isError={!!error && !name.trim()}
                  $isDisabled={isSubmitting}
                />

                {error && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Card Info */}
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Statut:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      card.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {card.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Créée le:</span>{" "}
                  {new Date(card.dateOfCreation).toLocaleDateString("fr-FR")}
                </div>
                <div>
                  <span className="font-medium">Plats originaux:</span>{" "}
                  {card.dishesId.length}
                </div>
              </div>
            </div>

            {/* Changes indicator */}
            {hasChanges && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <p className="text-amber-800 text-sm font-medium">
                    Vous avez des modifications non sauvegardées
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Dish Selection Section */}
          <div className="flex-1 p-6 overflow-hidden">
            <div className="h-full">
              <EnhancedDishSelection
                dishes={dishes}
                selectedDishIds={selectedDishes}
                onSelectionChange={setSelectedDishes}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer la carte
                </button>

                <div className="text-sm text-gray-600">
                  {selectedDishes.size > 0 && (
                    <span>
                      {selectedDishes.size} plat
                      {selectedDishes.size > 1 ? "s" : ""} sélectionné
                      {selectedDishes.size > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !name.trim() ||
                    selectedDishes.size === 0 ||
                    !hasChanges
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loading size="small" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Sauvegarder les modifications
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </FullScreenModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        modalName="delete-card-confirm-modal"
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Supprimer la carte
            </h2>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              Êtes-vous sûr de vouloir supprimer la carte{" "}
              <strong>"{card.name}"</strong> ?
            </p>
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              ⚠️ Cette action est irréversible et supprimera définitivement la
              carte.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loading size="small" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Supprimer définitivement
                </>
              )}
            </button>
          </div>
        </div>
      </ConfirmationModal>
    </>
  );
};
