import React from "react";
import { UserRole } from "../../../data/models/user.model";
import { useUsersListerStateContext } from "../../../reducers/auth.reducer";
import { ForbiddenMessage } from "../common/ForbiddenMessage";
import Loading from "../common/loading.component";

interface RequireRoleProps {
  allowed: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Composant garde qui vérifie si l'utilisateur a les permissions requises
 * pour accéder au contenu enfant
 */
export const RequireRole: React.FC<RequireRoleProps> = ({
  allowed,
  children,
  fallback,
}) => {
  const { currentUser } = useUsersListerStateContext();

  // Affichage de chargement si l'utilisateur n'est pas encore chargé
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading
          variant="sandy"
          size="medium"
          text="Vérification des permissions..."
        />
      </div>
    );
  }

  // Vérification des permissions
  if (!allowed.includes(currentUser.role)) {
    return fallback || <ForbiddenMessage />;
  }

  return <>{children}</>;
};
