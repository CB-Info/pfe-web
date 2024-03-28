import React, { ChangeEvent, FormEvent, useState } from 'react';
import { TextInput } from "../UI/components/input/textInput";
import TitleStyle from "../UI/style/title.style";
import CustomButton, { TypeButton, WidthButton } from "../UI/components/custom.button";
import { useUsersListerDispatchContext } from '../auth/auth.reducer';
import { UserRepositoryImpl } from '../network/repositories/user.respository';
import { useAlerts } from '../UI/components/alert/alerts-context';


export default function LoginPage() {
  const [emailInput, setEmailInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const dispatch = useUsersListerDispatchContext()
  const { addAlert, clearAlerts } = useAlerts();
  const [isLoading, setIsLoading] = useState(false)

  const userRepository = new UserRepositoryImpl()

  const handleSubmit = async (event: FormEvent) => {
    setIsLoading(true)
    event.preventDefault();
    try {
      const user = await userRepository.login(emailInput, passwordInput)
      dispatch({ type: "UPDATE_USER", payload: user })
    } catch (error) {
        addAlert({ severity: "error", message: "L'utilisateur ou le mot de passe est incorrecte" })
    }
    setIsLoading(false)
  };
  
  return (
    <div className="h-screen w-full bg-bg-color flex flex-col">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="p-6 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center gap-4">
          <div className='flex flex-col items-center justify-center'>
            <TitleStyle>Un seul compte,</TitleStyle>
            <TitleStyle>Plusieurs avantages</TitleStyle>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <TextInput name='email' label='Email' type='email' value={emailInput} onChange={(newValue) => setEmailInput(newValue)} isError={false} />
            </div>
            <div className="mb-6">
              <TextInput name='password' label='Mot de passe' type='password' value={passwordInput} onChange={(newValue) => setPasswordInput(newValue)} isError={false} />
              {/* <div className='flex justify-between pt-2'>
                <div className="flex items-center gap-1">
                  <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 border border-blue-500 cursor-pointer rounded " />
                  <label htmlFor="default-checkbox" className="text-xs font-inter italic text-right">Se rappeler de moi</label>
                </div>
                <p className="text-xs font-inter text-right">Mot de passe oublié ?</p>
              </div> */}
            </div>
            <div className="flex flex-col items-center justify-between mb-6 gap-2">
              <CustomButton inputType="submit" type={TypeButton.PRIMARY} width={WidthButton.SMALL} onClick={() => {}} isLoading={isLoading}>Se connecter</CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



