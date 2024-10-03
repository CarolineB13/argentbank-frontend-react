import React, { useState } from 'react';
import './EditNameForm.css';

function EditNameForm({ firstName, lastName, username, onSave, onCancel }) {
  const [newUsername, setNewUsername] = useState(username);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newUsername); // Appeler la fonction onSave avec le nouveau nom d'utilisateur
  };

  return (
    <form onSubmit={handleSubmit} className="edit-name-form">
      <h2>Edit user info</h2>
      <div className="input-wrapper">
        <label htmlFor="username">User name :</label>
        <input
          type="text"
          id="username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <label htmlFor="firstName">First name :</label>
        <input type="text" id="firstName" value={firstName} disabled />
      </div>
      <div className="input-wrapper">
        <label htmlFor="lastName">Last name :</label>
        <input type="text" id="lastName" value={lastName} disabled />
      </div>
      <div className="buttons">
      <button type="submit" className="save-button">Save</button>
      <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
    </div>
    </form>
  );
}

export default EditNameForm;
