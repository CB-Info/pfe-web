import { useState } from 'react';
import { ProfilContent } from "../UI/components/settingsContent/profilContent";
import { PreferencesContent } from "../UI/components/settingsContent/preferencesContent";
import { BaseContent } from '../UI/components/base.content';
import { PanelContent } from '../UI/components/panel.content';

const tabs = ['Profil', 'Préférences', 'Sécurité'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <BaseContent>
      <div className="w-full h-16 bg-red-500">

      </div>
      <div className="w-full h-full p-4">
        <PanelContent>
          <nav className="flex mb-4 w-1/3">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-2 px-4 text-sm font-inter font-medium text-center 
                        ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:bg-gray-50'}
                        focus:outline-blue-500`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="p-4">
            {activeTab === 'Profil' && (
          // Profil content
            <ProfilContent />
        )}
            {activeTab === 'Préférences' && (
          // Préférences content
          <PreferencesContent />
        )}
            {activeTab === 'Sécurité' && (
          // Sécurité content
          <div className="w-full h-40 bg-pink-300"></div>
        )}
          </div>
        </PanelContent>
      </div>
    </BaseContent>
  );
}



