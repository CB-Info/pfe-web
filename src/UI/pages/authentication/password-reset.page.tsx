import { FormEvent, useState } from 'react';
import TitleStyle from "../../style/title.style";
import FirebaseAuthManager from '../../../network/authentication/firebase.auth.manager';
import { useAlerts } from '../../../contexts/alerts.context';
import { BaseContent } from '../../components/contents/base.content';
import { ArrowLeft, Mail, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordResetPageProps {
  onBackToLogin: () => void;
}

export default function PasswordResetPage({ onBackToLogin }: PasswordResetPageProps) {
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { addAlert } = useAlerts();

  const firebaseAuthManager = FirebaseAuthManager.getInstance();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmailInput(value);
    if (value && !validateEmail(value)) {
      setEmailError("Format d'email invalide");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    if (!emailInput.trim()) {
      setEmailError("L'email est requis");
      return;
    }

    if (!validateEmail(emailInput)) {
      setEmailError("Format d'email invalide");
      return;
    }

    setIsLoading(true);

    try {
      await firebaseAuthManager.sendPasswordResetEmail(emailInput);
      setIsEmailSent(true);
      addAlert({ 
        severity: "success", 
        message: "Un email de réinitialisation a été envoyé à votre adresse",
        timeout: 5
      });
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors de l'envoi de l'email";
      
      if (error?.code === 'auth/user-not-found') {
        errorMessage = "Aucun compte n'est associé à cette adresse email";
      } else if (error?.code === 'auth/invalid-email') {
        errorMessage = "L'adresse email n'est pas valide";
      } else if (error?.code === 'auth/too-many-requests') {
        errorMessage = "Trop de tentatives. Veuillez réessayer plus tard";
      }
      
      addAlert({ 
        severity: "error", 
        message: errorMessage,
        timeout: 7
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <BaseContent>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6"
              >
                <Mail className="h-8 w-8 text-white" />
              </motion.div>
              
              <div className="space-y-4">
                <TitleStyle className="text-2xl font-bold text-gray-900">
                  Email envoyé !
                </TitleStyle>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Nous avons envoyé un lien de réinitialisation à
                  </p>
                  <p className="font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg text-sm">
                    {emailInput}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Vérifiez votre boîte de réception et vos spams
                  </p>
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                <button
                  onClick={onBackToLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Retour à la connexion
                </button>
                
                <button
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmailInput("");
                  }}
                  className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors duration-200"
                >
                  Renvoyer l'email
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </BaseContent>
    );
  }

  return (
    <BaseContent>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-6"
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <div className="space-y-2">
              <TitleStyle className="text-3xl font-bold text-gray-900">
                Mot de passe oublié ?
              </TitleStyle>
              <p className="text-gray-600 text-sm leading-relaxed">
                Saisissez votre adresse email et nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe
              </p>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={emailInput}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={`
                      block w-full pl-10 pr-3 py-3 border rounded-lg text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all duration-200
                      ${emailError 
                        ? 'border-red-300 bg-red-50' 
                        : emailInput && !emailError 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }
                    `}
                    placeholder="exemple@email.com"
                    disabled={isLoading}
                  />
                  {emailInput && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {emailError ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-600 text-xs flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {emailError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <div className="w-full">
                <button
                  type="submit"
                  disabled={isLoading || !!emailError || !emailInput.trim()}
                  className={`
                    w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${isLoading || !!emailError || !emailInput.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                    }
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Envoyer le lien de réinitialisation
                    </div>
                  )}
                </button>
              </div>

              {/* Back to Login */}
              <button
                type="button"
                onClick={onBackToLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 disabled:opacity-50 py-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </BaseContent>
  );
}