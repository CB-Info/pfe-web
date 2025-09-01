import { Link } from "react-router-dom";
import { BaseContent } from "../components/contents/base.content";

export default function NotFoundPage() {
  return (
    <BaseContent>
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Page non trouvée
        </h2>
        <p className="text-gray-600 mb-6">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </BaseContent>
  );
}
