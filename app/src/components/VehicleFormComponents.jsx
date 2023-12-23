import TextInput from './TextInput';
import { buttonClasses } from '../utils';

const VehicleFormComponents = ({ formData, onChange, handleRemoveVehicle, canRemoveVehicle, vehicleIndex }) => {
  return (
    <div className="-mx-3 flex flex-wrap">
      <div className="w-full px-3 sm:w-1/5">
        <TextInput inputId="year" value={formData.year} onChange={(e) => onChange(vehicleIndex, 'year', e.target.value)} label="Year" type="text" maxLength={4} />
      </div>
      <div className="w-full px-3 sm:w-2/5">
        <TextInput inputId="make" value={formData.make} onChange={(e) => onChange(vehicleIndex, 'make', e.target.value)} label="Make" type="text" />
      </div>
      <div className="w-full px-3 sm:w-2/5">
        <TextInput inputId="model" value={formData.model} onChange={(e) => onChange(vehicleIndex, 'model', e.target.value)} label="Model" type="text" maxLength={2} />
      </div>
      <div className="w-full px-3 sm:w-3/5">
        <TextInput inputId="vin" value={formData.vin} onChange={(e) => onChange(vehicleIndex, 'vin', e.target.value)} label="Vehicle Identification Number (VIN)" type="text" maxLength={17} />
      </div>
      <div className="w-full px-3 sm:w-2/5">
        <div className="my-9">
          <button onClick={() => handleRemoveVehicle(vehicleIndex)} className={buttonClasses(!canRemoveVehicle)}>Remove</button>
        </div>
      </div>
    </div>
  );
};

export default VehicleFormComponents;