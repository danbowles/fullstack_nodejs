import React, { useState } from 'react';
import { json, useLoaderData } from "react-router-dom";
import AlertBanner from "../components/banners/AlertBanner";
import TextInput from "../components/TextInput";
import { isEveryPropertyTruthy, buttonClasses } from "../utils";

import Header from "../components/Header";
import Hr from '../components/Hr';
import ApplicantFormComponents from '../components/ApplicantFormComponents';
import VehicleFormComponents from '../components/VehicleFormComponents';
import SuccessBanner from '../components/banners/SuccessBanner';

export async function loader({ params: { id } }) {
  const application = await fetch(`http://localhost:3000/application/${id}`)
    .then((res) => {
      if (!res.ok) throw res;
      return res.json()
    });
  return json({ application, id });
}

const ResumeApplication = () => {
  const { application, id } = useLoaderData();
  const [applicantData, setApplicantData] = useState({
    ...application.applicant,
    dateOfBirth: application.applicant.dateOfBirth.split('T')[0]
  });

  // Note @dan: If this were to be any bigger, I'd probably use a reducer

  const [addressData, setAddressData] = useState(application.address || { street: '', city: '', state: '', zipCode: '' });
  const [vehicleData, setVehicleData] = useState(application.vehicles || [{ year: '', make: '', model: '', vin: '', key: Date.now() }]);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const clearBanner = () => {
    setError(null);
    setUpdateSuccess(null);
  }

  const handleAddVehicle = () => {
    if (vehicleData.length < 3) {
      setVehicleData([...vehicleData, { year: '', make: '', model: '', vin: '', key: Date.now() }]);
    }
  };

  const handleRemoveVehicle = (index) => {
    if (vehicleData.length > 1) { // Prevent removing the last car
      setVehicleData(vehicleData.filter((vehicle, i) => i !== index));
    }
  };

  const handleChangeVehicle = (index, field, value) => {
    setVehicleData(
      vehicleData.map(
        (vehicle, i) => (i === index ? { ...vehicle, [field]: value } : vehicle)
      )
    );
    clearBanner();
    setSubmitting(false);
  };

  const handleApplicantChange = (event) => {
    clearBanner();
    setApplicantData({
      ...applicantData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddressChange = (event) => {
    clearBanner();
    setAddressData({
      ...addressData,
      [event.target.name]: event.target.value,
    });
  };

  const updatedApplication = {
    ...applicantData,
    address: addressData,
    vehicles: vehicleData
  }

  const handleUpdateApplication = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`http://localhost:3000/application/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedApplication),
      }).then(res => {
        if (!res.ok) throw res;
        setSubmitting(false);
        return res.json();
      }).then(data => {
        setUpdateSuccess(data);
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

  // Note @dan: Great candidate for a refactor/resuable function with handleUpdateApplication
  const handleValidateApplication = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`http://localhost:3000/application/validate/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedApplication),
      }).then(res => {
        if (!res.ok) throw res;
        setSubmitting(false);
        return res.json();
      }).then(data => {
        setUpdateSuccess(data);
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

  const formValid = isEveryPropertyTruthy(updatedApplication)
    && !error
    && !submitting;

  const canAddVehicle = vehicleData.length < 3;
  const canRemoveVehicle = vehicleData.length > 1;

  return (
    <>
      <Header headerText="Welcome Back" subTitleText="Continue where you left off!" />
      <p className="mt-5 mb-5 font-bold">ℹ️ Please note, all fields are required</p>
      {error && error.message && <AlertBanner message={error.message} />}
      {updateSuccess && updateSuccess.message && <SuccessBanner message={updateSuccess.message} />}
      <div className="-mx-3 flex flex-wrap mt-5">
        <div className="flex w-full px-3 sm:w-1/2 justify-center">
          <button onClick={handleUpdateApplication} disabled={!formValid} className={buttonClasses(!formValid)}>
            Update Application
          </button>
        </div>
        <div className="flex w-full px-3 sm:w-1/2 justify-center">
          <button onClick={handleValidateApplication} disabled={!formValid} className={buttonClasses(!formValid)}>
            Validate Application
          </button>
        </div>
      </div >
      <form className="mt-4">
        <p className="text-xl mb-1 font-bold">👤 Your Information</p>
        <Hr />
        <ApplicantFormComponents formData={applicantData} onChange={handleApplicantChange} />
        <p className="text-xl mb-1 font-bold">📍 Your Address</p>
        <Hr />
        <div className="-mx-3 flex flex-wrap">
          <div className="w-full px-3">
            <TextInput inputId="street" value={addressData.street} onChange={handleAddressChange} label="Street Address" type="text" />
          </div>
          <div className="w-full px-3 sm:w-3/5">
            <TextInput inputId="city" value={addressData.city} onChange={handleAddressChange} label="City" type="text" />
          </div>
          <div className="w-full px-3 sm:w-1/5">
            <TextInput inputId="state" value={addressData.state} onChange={handleAddressChange} label="State" type="text" maxLength={2} />
          </div>
          <div className="w-full px-3 sm:w-1/5">
            <TextInput inputId="zipCode" value={addressData.zipCode} onChange={handleAddressChange} label="Zip" type="text" maxLength={5} />
          </div>
        </div>
        <p className="text-xl mb-3 font-bold">🚘 Your Vehicle(s)</p>
        {vehicleData.map((vehicle, vehicleIndex) =>
          <div key={vehicle.vin || vehicle.key}>
            <Hr />
            <VehicleFormComponents formData={vehicle} onChange={handleChangeVehicle} handleRemoveVehicle={handleRemoveVehicle} canRemoveVehicle={canRemoveVehicle} vehicleIndex={vehicleIndex} />
          </div>
        )}
        <div className="-mx-3 flex flex-wrap">
          <div className="mt-4 flex w-full px-3 sm:w-1/2 justify-center">
            <button onClick={handleAddVehicle} disabled={!canAddVehicle} className={buttonClasses(!canAddVehicle)}>
              Add Vehicle
            </button>
          </div>
        </div>
      </form >
    </>
  )
}

export default ResumeApplication;