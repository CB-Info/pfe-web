import { FormEvent, useState } from 'react';
import { TextInput } from "../../components/input/textInput";
import TitleStyle from "../../style/title.style";
import CustomButton, { TypeButton, WidthButton } from "../../components/buttons/custom.button";
import FirebaseAuthManager from '../../../network/authentication/firebase.auth.manager';
import { useAlerts } from '../../../contexts/alerts.context';
import { BaseContent } from '../../components/contents/base.content';
import { ArrowLeft, Mail } from 'lucide-react';

interface PasswordResetPageProps {
  onBackToLogin: () => void;
}

export default function PasswordResetPage({ onBackToLogin }: PasswordResetPageProps) {
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const { addAlert } = useAlerts();

  const firebaseAuthManager = FirebaseAuthManager.getInstance();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    if (!emailInput.trim()) {
      setEmailError(true);
      addAlert({ 
        severity: "error", 
        message: "Veuillez saisir votre adresse email" 
      });
      return;
    }

    if (!validateEmail(emailInput)) {
      setEmailError(true);
      addAlert({ 
        severity: "error", 
        message: "Veuillez saisir une adresse email valide" 
      });
      return;
    }

    setIsLoading(true);
    setEmailError(false);

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

  const handleEmailChange = (value: string) => {
    setEmailInput(value);
    if (emailError && value.trim()) {
      setEmailError(false);
    }
  };

  if (isEmailSent) {
    return (
      <BaseContent>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="p-8 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center gap-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-green-100 rounded-full">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-center">
                <TitleStyle>Email envoyé !</TitleStyle>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  Nous avons envoyé un lien de réinitialisation à <strong>{emailInput}</strong>
                </p>
                <p className="text-gray-500 mt-2 text-xs">
                  Vérifiez votre boîte de réception et vos spams
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              <CustomButton 
                type={TypeButton.PRIMARY} 
                width={WidthButton.MEDIUM} 
                onClick={onBackToLogin} 
                isLoading={false}
              >
                Retour à la connexion
              </CustomButton>
              
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmailInput("");
                }}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Renvoyer l'email
              </button>
            </div>
          </div>
        </div>
      </BaseContent>
    );
  }

  return (
    <BaseContent>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="p-8 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center gap-6 max-w-md w-full mx-4">
          <div className="flex flex-col items-center text-center">
            <TitleStyle>Mot de passe oublié ?</TitleStyle>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
              <TextInput 
                name='email' 
                label='Adresse email' 
                type='email' 
                value={emailInput} 
                onChange={handleEmailChange} 
                $isError={emailError}
                $isDisabled={isLoading}
              />
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <CustomButton 
                inputType="submit" 
                type={TypeButton.PRIMARY} 
                width={WidthButton.MEDIUM} 
                onClick={() => {}} 
                isLoading={isLoading}
                isDisabled={!emailInput.trim() || isLoading}
              >
                Envoyer le lien de réinitialisation
              </CustomButton>
              
              <button
                type="button"
                onClick={onBackToLogin}
                disabled={isLoading}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </button>
            </div>
          </form>
        </div>
      </div>
    </BaseContent>
  );
}