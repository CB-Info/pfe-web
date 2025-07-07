import { useState } from 'react';
import { ProfilContent } from "../../components/settingsContent/profilContent";
import { PreferencesContent } from "../../components/settingsContent/preferencesContent";
import { BaseContent } from '../../components/contents/base.content';
import { PanelContent } from '../../components/contents/panel.content';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Eye, 
  Globe,
  Smartphone,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  category: 'account' | 'privacy' | 'preferences' | 'support';
}

const settingsTabs: SettingsTab[] = [
  // Compte
  { 
    id: 'profile', 
    label: 'Profil', 
    icon: User, 
    description: 'Informations personnelles et coordonnées',
    category: 'account'
  },
  { 
    id: 'security', 
    label: 'Sécurité', 
    icon: Shield, 
    description: 'Mot de passe et authentification',
    category: 'account'
  },
  
  // Confidentialité
  { 
    id: 'privacy', 
    label: 'Confidentialité', 
    icon: Eye, 
    description: 'Contrôle de vos données personnelles',
    category: 'privacy'
  },
  
  // Préférences
  { 
    id: 'preferences', 
    label: 'Apparence', 
    icon: Settings, 
    description: 'Thème et personnalisation',
    category: 'preferences'
  },
  { 
    id: 'notifications', 
    label: 'Notifications', 
    icon: Bell, 
    description: 'Alertes et communications',
    category: 'preferences'
  },
  { 
    id: 'language', 
    label: 'Langue et région', 
    icon: Globe, 
    description: 'Langue d\'affichage et format',
    category: 'preferences'
  },
  { 
    id: 'mobile', 
    label: 'Application mobile', 
    icon: Smartphone, 
    description: 'Paramètres de l\'app mobile',
    category: 'preferences'
  },
  
  // Support
  { 
    id: 'help', 
    label: 'Aide et support', 
    icon: HelpCircle, 
    description: 'Documentation et assistance',
    category: 'support'
  }
];

const categoryLabels = {
  account: 'Compte',
  privacy: 'Confidentialité',
  preferences: 'Préférences',
  support: 'Support'
};

const categoryDescriptions = {
  account: 'Gérez vos informations de compte et votre sécurité',
  privacy: 'Contrôlez la confidentialité de vos données',
  preferences: 'Personnalisez votre expérience utilisateur',
  support: 'Obtenez de l\'aide et du support'
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(settingsTabs[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeTabData = settingsTabs.find(tab => tab.id === activeTab);

  const groupedTabs = settingsTabs.reduce((acc, tab) => {
    if (!acc[tab.category]) {
      acc[tab.category] = [];
    }
    acc[tab.category].push(tab);
    return acc;
  }, {} as Record<string, SettingsTab[]>);

  const renderTabButton = (tab: SettingsTab, isMobile = false) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    
    return (
      <motion.button
        key={tab.id}
        onClick={() => {
          setActiveTab(tab.id);
          if (isMobile) setIsMobileMenuOpen(false);
        }}
        className={`
          w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 group
          ${isActive 
            ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm' 
            : 'hover:bg-gray-50 text-gray-700 border-2 border-transparent hover:border-gray-200'}
          ${isMobile ? 'justify-between' : ''}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`${tab.label} - ${tab.description}`}
        role="tab"
        aria-selected={isActive}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`
            p-2 rounded-lg transition-colors duration-200
            ${isActive 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}
          `}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-left min-w-0 flex-1">
            <div className={`font-medium text-sm ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
              {tab.label}
            </div>
            {!isMobile && (
              <div className="text-xs text-gray-500 mt-0.5 truncate">
                {tab.description}
              </div>
            )}
          </div>
        </div>
        {isMobile && (
          <ChevronRight className={`w-4 h-4 transition-colors duration-200 ${
            isActive ? 'text-blue-600' : 'text-gray-400'
          }`} />
        )}
      </motion.button>
    );
  };

  return (
    <BaseContent>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
              <p className="text-sm text-gray-600 mt-1">
                Gérez vos préférences et paramètres de compte
              </p>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              aria-label="Ouvrir le menu des paramètres"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Active tab info on mobile */}
          {activeTabData && (
            <div className="lg:hidden mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <activeTabData.icon className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-700">{activeTabData.label}</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">{activeTabData.description}</p>
            </div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 border-r border-gray-200 bg-gray-50">
            <div className="p-6 h-full overflow-y-auto">
              <nav className="space-y-6" role="tablist">
                {Object.entries(groupedTabs).map(([category, tabs]) => (
                  <div key={category}>
                    <div className="mb-3">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {categoryDescriptions[category as keyof typeof categoryDescriptions]}
                      </p>
                    </div>
                    <div className="space-y-1">
                      {tabs.map(tab => renderTabButton(tab))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-xl"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">Paramètres</h2>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Fermer le menu"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 overflow-y-auto h-full">
                    <nav className="space-y-6">
                      {Object.entries(groupedTabs).map(([category, tabs]) => (
                        <div key={category}>
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            {categoryLabels[category as keyof typeof categoryLabels]}
                          </h3>
                          <div className="space-y-1">
                            {tabs.map(tab => renderTabButton(tab, true))}
                          </div>
                        </div>
                      ))}
                    </nav>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <PanelContent>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 lg:p-8"
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
              >
                {activeTab === 'profile' && <ProfilContent />}
                {activeTab === 'preferences' && <PreferencesContent />}
                {activeTab === 'security' && <SecurityContent />}
                {activeTab === 'privacy' && <PrivacyContent />}
                {activeTab === 'notifications' && <NotificationsContent />}
                {activeTab === 'language' && <LanguageContent />}
                {activeTab === 'mobile' && <MobileContent />}
                {activeTab === 'help' && <HelpContent />}
              </motion.div>
            </PanelContent>
          </div>
        </div>
      </div>
    </BaseContent>
  );
}

// Nouveaux composants de contenu
const SecurityContent = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Sécurité</h2>
      <p className="text-gray-600">Gérez la sécurité de votre compte et vos méthodes d'authentification.</p>
    </div>
    
    <div className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Mot de passe</h3>
        <p className="text-sm text-gray-600 mb-3">Dernière modification il y a 30 jours</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Changer le mot de passe
        </button>
      </div>
      
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Authentification à deux facteurs</h3>
        <p className="text-sm text-gray-600 mb-3">Ajoutez une couche de sécurité supplémentaire</p>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          Configurer 2FA
        </button>
      </div>
    </div>
  </div>
);

const PrivacyContent = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Confidentialité</h2>
      <p className="text-gray-600">Contrôlez qui peut voir vos informations et comment elles sont utilisées.</p>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900">Profil public</h3>
          <p className="text-sm text-gray-600">Permettre aux autres de voir votre profil</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  </div>
);

const NotificationsContent = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Notifications</h2>
      <p className="text-gray-600">Choisissez quand et comment vous souhaitez être notifié.</p>
    </div>
    
    <div className="space-y-4">
      {[
        { label: 'Notifications par email', description: 'Recevoir des notifications par email' },
        { label: 'Notifications push', description: 'Recevoir des notifications sur votre appareil' },
        { label: 'Notifications de sécurité', description: 'Alertes importantes sur la sécurité' }
      ].map((item, index) => (
        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">{item.label}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={index === 2} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  </div>
);

const LanguageContent = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Langue et région</h2>
      <p className="text-gray-600">Personnalisez la langue d'affichage et les formats régionaux.</p>
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Langue d'affichage</label>
        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
          <option value="Europe/London">Europe/London (UTC+0)</option>
          <option value="America/New_York">America/New_York (UTC-5)</option>
        </select>
      </div>
    </div>
  </div>
);

const MobileContent = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Application mobile</h2>
      <p className="text-gray-600">Paramètres spécifiques à l'application mobile.</p>
    </div>
    
    <div className="text-center py-12">
      <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Application mobile bientôt disponible</h3>
      <p className="text-gray-600">Nous travaillons sur une application mobile pour améliorer votre expérience.</p>
    </div>
  </div>
);

const HelpContent = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Aide et support</h2>
      <p className="text-gray-600">Trouvez de l'aide et contactez notre équipe de support.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { title: 'Documentation', description: 'Guides et tutoriels', icon: '📚' },
        { title: 'FAQ', description: 'Questions fréquemment posées', icon: '❓' },
        { title: 'Contacter le support', description: 'Obtenez de l\'aide personnalisée', icon: '💬' },
        { title: 'Signaler un bug', description: 'Aidez-nous à améliorer l\'application', icon: '🐛' }
      ].map((item, index) => (
        <button
          key={index}
          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
        >
          <div className="text-2xl mb-2">{item.icon}</div>
          <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
        </button>
      ))}
    </div>
  </div>
);