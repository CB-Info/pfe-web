import { useState } from 'react';
import { ProfilContent } from "../../components/settingsContent/profilContent";
import { PreferencesContent } from "../../components/settingsContent/preferencesContent";
import { BaseContent } from '../../components/contents/base.content';
import { PanelContent } from '../../components/contents/panel.content';
import { User, Settings as SettingsIcon, Shield } from 'lucide-react';
import { PageHeader } from '../../components/layout/page-header.component';

const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'preferences', label: 'Préférences', icon: SettingsIcon },
  { id: 'security', label: 'Sécurité', icon: Shield }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        <PageHeader
          icon={<SettingsIcon className="w-6 h-6 text-gray-600" />}
          title="Paramètres"
          description="Configurez vos préférences et paramètres de compte"
        />
        
        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <div className="flex gap-6 h-full">
              {/* Sidebar */}
              <div className="w-64 flex-shrink-0">
                <PanelContent>
                  <nav className="p-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`
                            w-full px-4 py-3 mb-1 rounded-lg flex items-center gap-3 transition-colors duration-200
                            ${activeTab === tab.id 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'hover:bg-gray-50 text-gray-700'}
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </PanelContent>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <PanelContent>
                  <div className="p-6">
                    {activeTab === 'profile' && <ProfilContent />}
                    {activeTab === 'preferences' && <PreferencesContent />}
                    {activeTab === 'security' && (
                      <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold mb-4">Sécurité</h2>
                        <p className="text-gray-600">
                          Les paramètres de sécurité seront bientôt disponibles.
                        </p>
                      </div>
                    )}
                  </div>
                </PanelContent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseContent>
  );
}
