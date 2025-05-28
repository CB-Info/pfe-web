import { useState } from 'react';
import { ProfilContent } from "../../components/settingsContent/profilContent";
import { PreferencesContent } from "../../components/settingsContent/preferencesContent";
import { BaseContent } from '../../components/contents/base.content';
import { PanelContent } from '../../components/contents/panel.content';
import { User, Settings, Shield } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'preferences', label: 'Préférences', icon: Settings },
  { id: 'security', label: 'Sécurité', icon: Shield }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <BaseContent>
      <div className="flex flex-col h-full p-6 gap-6">
        <h1 className="text-2xl font-semibold">Paramètres</h1>
        
        <div className="flex flex-1 gap-6">
          {/* Sidebar */}
          <div className="w-64">
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
          <div className="flex-1">
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
    </BaseContent>
  );
}