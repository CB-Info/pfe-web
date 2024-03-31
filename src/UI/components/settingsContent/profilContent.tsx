import React, { ChangeEvent, useState } from 'react';
import { TextInput } from '../input/textInput';
import { useUsersListerDispatchContext, useUsersListerStateContext } from '../../../auth/auth.reducer';
import { UserRepositoryImpl } from '../../../network/repositories/user.respository';
import { auth } from '../../../firebase-config';
import CustomButton, { TypeButton, WidthButton } from '../custom.button';

export const ProfilContent: React.FC = () => {
    const dispatch = useUsersListerDispatchContext();
    const { currentUser } = useUsersListerStateContext();
    const [isLoadingUpdateUser, setIsLoadingUpdateUser] = useState(false)
    const [userDetails, setUserDetails] = useState({
        lastName: currentUser?.lastname || '',
        firstName: currentUser?.firstname || '',
        email: currentUser?.email || '',
    });
    const [lastName, setLastName] = useState(currentUser?.lastname ?? "")
    const [firstName, setFirstName] = useState(currentUser?.firstname ?? "")
    const [email, setEmail] = useState(currentUser?.email ?? "")
    const userRepository = new UserRepositoryImpl();

    const handleChange = (name: string) => (newValue: string) => {
        setUserDetails(prevDetails => ({ ...prevDetails, [name]: newValue }));
    };

    const handleSubmit = async () => {
        console.log(lastName)
        console.log(firstName)
        console.log(email)

        console.log(userDetails)
        if (currentUser){
            try {
                //setIsLoadingUpdateUser(true)
                const userId = currentUser.id;
            
                const updatedUser = await userRepository.updateUser(userId, {
                    _id: currentUser.id,
                    email: email,
                    firstname: firstName,
                    lastname: lastName
                });
                dispatch({ type: "UPDATE_USER", payload: updatedUser });
                //setIsLoadingUpdateUser(false)
              } catch (error) {
              }
        }
      };

    return (
        <div className="flex flex-col gap-4">
            {/* Section personnel */}
            <div className="space-y-4">
                <TextInput 
                    label="Nom" 
                    name="lastName" 
                    value={lastName} 
                    onChange={(newValue) => setLastName(newValue)} 
                    isError={false} 
                />
                <TextInput 
                    label="Prénom" 
                    name="firstName" 
                    value={firstName} 
                    onChange={(newValue) => setFirstName(newValue)} 
                    isError={false} 
                />
                <TextInput 
                    label="Email" 
                    name="email" 
                    value={email} 
                    onChange={(newValue) => setEmail(newValue)} 
                    isError={false} 
                    type="email" 
                />
            </div>

            <CustomButton  type={TypeButton.PRIMARY} onClick={handleSubmit} width={WidthButton.SMALL} isLoading={false}>Enregistrer</CustomButton>

            {/* Section établissement */}
        </div>
    );
};
