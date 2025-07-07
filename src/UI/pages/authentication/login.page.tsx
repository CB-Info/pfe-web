import { FormEvent, useState } from 'react';
import { TextInput } from "../../components/input/textInput";
import TitleStyle from "../../style/title.style";
import CustomButton, { TypeButton, WidthButton } from "../../components/buttons/custom.button";
import { UserRepositoryImpl } from '../../../network/repositories/user.respository';
import { useAlerts } from '../../../contexts/alerts.context';
import { BaseContent } from '../../components/contents/base.content';
import PasswordResetPage from './password-reset.page';
import { Eye, EyeOff, Shield, Lock, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [emailInput, setEmailInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const { addAlert } = useAlerts();
  const userRepository = new UserRepositoryImpl()

  if (showPasswordReset) {
    return <PasswordResetPage onBackToLogin={() => setShowPasswordReset(false)} />;
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 1, label: "Faible", color: "text-red-500" };
    if (password.length < 8) return { strength: 2, label: "Moyen", color: "text-orange-500" };
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 4, label: "Fort", color: "text-green-500" };
    }
    return { strength: 3, label: "Correct", color: "text-blue-500" };
  };

  const passwordStrength = getPasswordStrength(passwordInput);

  const handleEmailChange = (value: string) => {
    setEmailInput(value);
    if (value && !validateEmail(value)) {
      setEmailError("Format d'email invalide");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPasswordInput(value);
    if (value && value.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    // Validation
    let hasErrors = false;
    
    if (!emailInput.trim()) {
      setEmailError("L'email est requis");
      hasErrors = true;
    } else if (!validateEmail(emailInput)) {
      setEmailError("Format d'email invalide");
      hasErrors = true;
    }
    
    if (!passwordInput.trim()) {
      setPasswordError("Le mot de passe est requis");
      hasErrors = true;
    }
    
    if (hasErrors) return;

    setIsLoading(true);
    
    try {
      await userRepository.login(emailInput, passwordInput);
      if (rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
      }
    } catch (error) {
      addAlert({ 
        severity: "error", 
        message: "Email ou mot de passe incorrect. Veuillez vérifier vos informations.",
        timeout: 5
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6"
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <div className="space-y-2">
              <TitleStyle className="text-3xl font-bold text-gray-900">
                Connexion sécurisée
              </TitleStyle>
              <p className="text-gray-600 text-sm">
                Accédez à votre espace de gestion
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              Connexion protégée par chiffrement SSL
            </span>
          </motion.div>

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
                    placeholder="Votre adresse email"
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

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={passwordInput}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className={`
                      block w-full pl-10 pr-12 py-3 border rounded-lg text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all duration-200
                      ${passwordError 
                        ? 'border-red-300 bg-red-50' 
                        : passwordInput && !passwordError 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }
                    `}
                    placeholder="Votre mot de passe"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <AnimatePresence>
                  {passwordInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              passwordStrength.strength === 1 ? 'bg-red-500 w-1/4' :
                              passwordStrength.strength === 2 ? 'bg-orange-500 w-2/4' :
                              passwordStrength.strength === 3 ? 'bg-blue-500 w-3/4' :
                              passwordStrength.strength === 4 ? 'bg-green-500 w-full' : 'w-0'
                            }`}
                          />
                        </div>
                        {passwordStrength.label && (
                          <span className={`text-xs font-medium ${passwordStrength.color}`}>
                            {passwordStrength.label}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-600 text-xs flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {passwordError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                  disabled={isLoading}
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit Button */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <button
                  type="submit"
                  disabled={isLoading || !!emailError || !!passwordError || !emailInput || !passwordInput}
                  className={`
                    w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${isLoading || !!emailError || !!passwordError || !emailInput || !passwordInput
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                    }
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Connexion en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Se connecter
                    </div>
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500">
              En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </BaseContent>
  );
}