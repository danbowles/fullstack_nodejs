import TextInput from './TextInput';

const ApplicantFormComponents = ({ formData, onChange }) => {
  return (
    <div className="-mx-3 flex flex-wrap">
      <div className="w-full px-3 sm:w-1/2">
        <TextInput inputId="firstName" value={formData.firstName} onChange={onChange} label="First Name" type="text" />
      </div>
      <div className="w-full px-3 sm:w-1/2">
        <TextInput inputId="lastName" value={formData.lastName} onChange={onChange} label="Last Name" type="text" />
      </div>
      <div className="w-full px-3 sm:w-1/2">
        <TextInput inputId="dateOfBirth" value={formData.dateOfBirth} onChange={onChange} label="Date of Birth" type="date" />
      </div>
    </div>
  );
};

export default ApplicantFormComponents;