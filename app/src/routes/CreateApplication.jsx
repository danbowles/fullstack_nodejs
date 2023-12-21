import React, { useState } from 'react';
import Header from "../components/Header"

const CreateApplication = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      // const redirectUrl = data.redirectUrl || '/'; // Use a default URL if not provided
      // window.location.href = redirectUrl;
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle errors gracefully, e.g., display an error message to the user
    }
  };

  return (
    <>
      <Header headerText="👋 Welcome" subTitleText="Fill out this short form to start your application!" />
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
        <br />
        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
        <br />
        <label htmlFor="dateOfBirth">Date of Birth:</label>
        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default CreateApplication;
