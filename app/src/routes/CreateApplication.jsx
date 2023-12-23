import React, { useState } from 'react';
import Header from "../components/Header"
import AlertBanner from '../components/banners/AlertBanner';
import SuccessBanner from '../components/banners/SuccessBanner';
import ApplicantFormComponents from '../components/ApplicantFormComponents';
import { isEveryPropertyTruthy, buttonClasses } from '../utils';

const CreateApplication = () => {
  const [applicantData, setApplicantData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });

  const [newApplicationId, setNewApplicationId] = useState(0);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setError(null);
    setApplicantData({
      ...applicantData,
      [event.target.name]: event.target.value,
    });
  };

  isEveryPropertyTruthy(applicantData)
  const formValid = isEveryPropertyTruthy(applicantData)
    && !error
    && !submitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await fetch('http://localhost:3000/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicantData),
      }).then(res => {
        if (!res.ok) throw res;
        setSubmitting(false);
        return res.json();
      }).then(data => {
        setNewApplicationId(data.newApplicationId);
      }).catch(error => {
        error.json().then(err => {
          setSubmitting(false);
          setError(err);
        });
      });

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <Header headerText="👋 Welcome" subTitleText="Fill out this short form to start your application!" />
      <p className="mb-5 font-bold">ℹ️ Please note, all fields are required</p>
      {error && error.message && <AlertBanner message={error.message} />}
      {!newApplicationId ?
        <form onSubmit={handleSubmit}>
          <ApplicantFormComponents formData={applicantData} onChange={handleChange} />
          <div className="flex justify-end w-full">
            <button disabled={!formValid} className={buttonClasses(!formValid)}>
              Create Application
            </button>
          </div>
        </form >
        :
        <div className="">
          <SuccessBanner message="🎉 Your application has been created!" />
          <p className="mt-5">
            <span>Follow this link below to resume your application:  </span>
            <a href={`/application/${newApplicationId}`} className="hover:underline text-[#6A64F1] text-base font-semibold">Resume Application →</a>
          </p>
        </div>
      }
    </>
  )
}

export default CreateApplication;
