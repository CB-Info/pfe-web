import { useUsersListerStateContext } from "../../../reducers/auth.reducer";
import Loading from "../../components/common/loading.component";
import { BaseContent } from "../../components/contents/base.content";
import OwnerDashboard from "./OwnerDashboard";
import ManagerDashboard from "./ManagerDashboard";
import KitchenDashboard from "./KitchenDashboard";
import WaiterDashboard from "./WaiterDashboard";
import CustomerDashboard from "./CustomerDashboard";

/**
 * Dashboard principal qui route vers le dashboard approprié selon le rôle utilisateur
 */
export default function DashboardPage() {
  const { currentUser } = useUsersListerStateContext();

  if (!currentUser) {
    return (
      <BaseContent>
        <div className="flex items-center justify-center min-h-screen">
          <Loading
            variant="sandy"
            size="medium"
            text="Chargement de votre tableau de bord..."
          />
        </div>
      </BaseContent>
    );
  }

  // Routage vers le dashboard approprié selon le rôle
  switch (currentUser.role) {
    case "OWNER":
    case "ADMIN":
      return <OwnerDashboard />;
    case "MANAGER":
      return <ManagerDashboard />;
    case "KITCHEN_STAFF":
      return <KitchenDashboard />;
    case "WAITER":
      return <WaiterDashboard />;
    case "CUSTOMER":
    default:
      return <CustomerDashboard />;
  }
}
