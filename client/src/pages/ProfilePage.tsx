import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, type UserProfile } from "../services/userService";

// Tip za formu
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

// Payload koji se šalje serveru, dozvoljava dodatno polje password
type UpdateUserPayload = Partial<UserProfile> & { password?: string };

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

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: UserProfile = await getUserProfile();

        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          password: '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || '',
          country: data.country || '',
          street: data.street || '',
          number: data.number || ''
        });
      } catch (err) {
        setError('Ne mogu da učitam podatke profila.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const payload: UpdateUserPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        country: formData.country,
        street: formData.street,
        number: formData.number
      };

      if (formData.password) payload.password = formData.password;

      const res = await updateUserProfile(payload);

      setMessage(res?.message || 'Profil uspešno ažuriran.');
    } catch (err) {
      setError('Greška pri ažuriranju profila.');
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
