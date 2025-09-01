import React from "react";
import { Link } from "react-router-dom";
import { BaseContent } from "../contents/base.content";

export const ForbiddenMessage: React.FC = () => (
  <BaseContent>
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="text-6xl mb-4">🚫</div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Accès refusé
      </h2>
      <p className="text-gray-600 mb-6">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        ← Retour au tableau de bord
      </Link>
    </div>
  </BaseContent>
);
