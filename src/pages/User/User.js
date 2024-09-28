import React, { useEffect, useState } from 'react';
import './User.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUsername, fetchUserProfile } from '../../app/redux/authSlice';
import Account from '../../components/Account/Account';
import EditNameForm from '../../components/EditNameForm/EditNameForm';

function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Récupère les informations du profil utilisateur et le token depuis le store Redux
  const profile = useSelector((state) => state.auth.profile);
  const token = useSelector((state) => state.auth.token);

  // Définit l'état pour gérer le mode édition et le nom d'utilisateur actuel
  const [isEditing, setIsEditing] = useState(false); // Indique si l'utilisateur est en mode édition
  const [currentUsername, setCurrentUsername] = useState(profile?.userName || ''); // Pré-remplit avec le username actuel

   // Effet pour vérifier si l'utilisateur est authentifié
   useEffect(() => {
    if (!token) {
      navigate('/sign-in'); // Redirige vers la page de connexion si le token est manquant
    }
  }, [token, navigate]);

  // Effet pour mettre à jour le nom d'utilisateur dans le formulaire une fois que le profil est chargé
  useEffect(() => {
    if (profile && profile.userName) {  // Assurez-vous d'utiliser 'userName' avec la bonne casse
      setCurrentUsername(profile.userName); // Met à jour l'état avec le nom d'utilisateur récupéré
    }
  }, [profile]);

  // Si le profil n'est pas encore chargé mais qu'on a un token, on déclenche l'appel API pour récupérer le profil
  useEffect(() => {
    if (token && !profile) {
      dispatch(fetchUserProfile(token)); // Appel à l'API pour récupérer le profil utilisateur
    }
  }, [token, profile, dispatch]);

  // Fonction pour activer le mode édition
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Fonction pour sauvegarder les modifications et désactiver le mode édition
  const handleSave = (newUsername) => {
    // Appelle la fonction Redux pour mettre à jour le nom d'utilisateur dans l'API et le store
    dispatch(updateUsername({ token, newUsername })) 
      .unwrap()
      .then(() => {
        setCurrentUsername(newUsername);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Failed to update username:", error);
      });
  };

  // Fonction pour annuler les modifications et quitter le mode édition
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <main className="main bg-dark">
      <div className="header">
        {/* Affiche un message de bienvenue avec le prénom et le nom de famille si le profil est chargé */}
        <h1>Welcome back<br />{profile ? `${profile.firstName} ${profile.lastName}` : "User"}!</h1>

        {/* Si en mode édition, affiche le formulaire pour modifier le nom, sinon affiche le bouton "Edit Name" */}
        {isEditing ? (
          <EditNameForm
            firstName={profile.firstName} // Envoie le prénom en tant que propriété
            lastName={profile.lastName} // Envoie le nom de famille en tant que propriété
            username={currentUsername} // Envoie le nom d'utilisateur actuel
            onSave={handleSave} // Fonction appelée lors de la sauvegarde
            onCancel={handleCancel} // Fonction appelée lors de l'annulation
          />
        ) : (
          <button className="edit-button" onClick={handleEdit}>Edit Name</button>
        )}
      </div>

      {/* Affiche les comptes de l'utilisateur */}
      <h2 className="sr-only">Accounts</h2>
      <Account 
        title="Argent Bank Checking (x8349)" 
        amount="$2,082.79" 
        description="Available Balance" 
      />
      <Account 
        title="Argent Bank Savings (x6712)" 
        amount="$10,928.42" 
        description="Available Balance" 
      />
      <Account 
        title="Argent Bank Credit Card (x8349)" 
        amount="$184.30" 
        description="Current Balance" 
      />
    </main>
  );
}

export default User;
