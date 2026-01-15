import React, { useState } from 'react';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    // kasnije dodati ostala polja: datum rodjenja, pol, drzava, ulica, broj
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register', formData);
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
