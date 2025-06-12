import { TextInput } from '../input/textInput';
import { useUsersListerDispatchContext, useUsersListerStateContext } from '../../../reducers/auth.reducer';
import { UserRepositoryImpl } from '../../../network/repositories/user.respository';
import CustomButton, { TypeButton, WidthButton } from '../buttons/custom.button';
import { useState } from 'react';
import { useAlerts } from '../../../hooks/alerts.hook';

export const ProfilContent: React.FC = () => {
    const dispatch = useUsersListerDispatchContext();
    const { currentUser } = useUsersListerStateContext();
    const [isLoadingUpdateUser, setIsLoadingUpdateUser] = useState(false);
    const [lastName, setLastName] = useState(currentUser?.lastname ?? "");
    const [firstName, setFirstName] = useState(currentUser?.firstname ?? "");
    const [email, setEmail] = useState(currentUser?.email ?? "");
    const userRepository = new UserRepositoryImpl();
    const { addAlert } = useAlerts();

    const handleSubmit = async () => {
        if (currentUser) {
            try {
                setIsLoadingUpdateUser(true);
                const userId = currentUser.id;
            
                const updatedUser = await userRepository.updateUser(userId, {
                    _id: currentUser.id,
                    email: email,
                    firstname: firstName,
                    lastname: lastName
                });
                
                dispatch({ type: "UPDATE_USER", payload: updatedUser });
                addAlert({
                    severity: 'success',
                    message: 'Profil mis à jour avec succès',
                    timeout: 3
                });
            } catch (error) {
                addAlert({
                    severity: 'error',
                    message: 'Erreur lors de la mise à jour du profil',
                    timeout: 3
                });
            } finally {
                setIsLoadingUpdateUser(false);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Informations personnelles</h2>
            
            <div className="grid grid-cols-2 gap-4">
                <TextInput 
                    label="Nom" 
                    name="lastName" 
                    value={lastName} 
                    onChange={(newValue) => setLastName(newValue)} 
                    $isError={false}
                    $isDisabled={false}
                />
                <TextInput 
                    label="Prénom" 
                    name="firstName" 
                    value={firstName} 
                    onChange={(newValue) => setFirstName(newValue)} 
                    $isError={false}
                    $isDisabled={false}
                />
            </div>

            <TextInput 
                label="Email" 
                name="email" 
                value={email} 
                onChange={(newValue) => setEmail(newValue)} 
                $isError={false}
                $isDisabled={false}
                type="email" 
            />

            <div className="flex justify-end pt-4">
                <CustomButton 
                    type={TypeButton.PRIMARY} 
                    onClick={handleSubmit} 
                    width={WidthButton.SMALL} 
                    isLoading={isLoadingUpdateUser}
                >
                    Enregistrer les modifications
                </CustomButton>
            </div>
        </div>
    );
};
