import React, { useState, useEffect, type ChangeEvent } from 'react';
import { userAPI } from "../api/users/UserAPI";
import type { UserDTO } from "../models/user/UserDTO";
import type { UpdateProfileDTO } from "../api/users/IUserAPI";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  street: string;
  number: string;
}

const ProfilePage: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    street: '',
    number: ''
  });

  const [userId, setUserId] = useState<number | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchData = async () => {
    try {
      const data: UserDTO = await userAPI.getProfile()
      
      setUserId(data.id);
      setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          password: "",
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "",
          country: data.country || "",
          street: data.street || "",
          number: data.streetNumber || "",
        });

      if (data.profileImage) {
          setCurrentProfileImage(
            `${import.meta.env.VITE_API_URL}/users/profile-image/${data.id}`
          );
        }
    } catch (err: any) {
      setError(err.message || "Greška pri učitavanju profila.");
    }
  };

  fetchData();
}, []);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const updateData: UpdateProfileDTO = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        gender: formData.gender,
        country: formData.country,
        street: formData.street,
        street_number: formData.number,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await userAPI.updateProfile(updateData);

      if (profileImage) {
        const upload = await userAPI.uploadProfileImage(profileImage);
        setMessage(upload.message || "Profil i slika uspešno ažurirani.");
        setProfileImage(null);
        if (userId) {
          setCurrentProfileImage(
            `${import.meta.env.VITE_API_URL}/users/profile-image/${userId}?t=${Date.now()}`
          );
        }
      } else {
        setMessage("Profil uspešno ažuriran.");
      }
    } catch (err: any) {
      setError(err.message || "Greška pri ažuriranju profila.");
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Profil korisnika</h2>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      {message && <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}

      <form onSubmit={handleUpdate}>
        {currentProfileImage && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <img src={currentProfileImage} alt="Profilna" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        )}

        {profileImage && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <p>Preview nove slike:</p>
            <img src={URL.createObjectURL(profileImage)} alt="Preview" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        )}

        {Object.keys(formData).map((key) => {
          const field = key as keyof UserFormData;
          const labelMap: Record<keyof UserFormData, string> = {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            password: 'Password',
            dateOfBirth: 'Datum rođenja',
            gender: 'Pol',
            country: 'Država',
            street: 'Ulica',
            number: 'Broj'
          };

          if (field === 'gender') {
            return (
              <div key={field} style={{ marginBottom: '1rem' }}>
                <label>{labelMap[field]}:</label><br />
                <select name="gender" value={formData.gender} onChange={handleChange} required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="">Odaberite pol</option>
                  <option value="Male">Muški</option>
                  <option value="Female">Ženski</option>
                  <option value="Other">Ostalo</option>
                </select>
              </div>
            );
          }

          const inputType = field === 'password' ? 'password' : field === 'dateOfBirth' ? 'date' : 'text';
          return (
            <div key={field} style={{ marginBottom: '1rem' }}>
              <label>{labelMap[field]}:</label><br />
              <input
                type={inputType}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field === 'password' ? 'Ostavite prazno da ne promenite' : ''}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required={field !== 'password'}
              />
            </div>
          );
        })}

        <div style={{ marginBottom: '1rem' }}>
          <label>Profilna slika:</label><br />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <button type="submit" style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>Ažuriraj profil</button>
      </form>
    </div>
  );
};

export default ProfilePage;