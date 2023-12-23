function TextInput({ inputId, label, type, onChange, value, required = true, maxLength = 100 }) {
  return (
    <div className="mb-5">
      <label htmlFor={inputId} className="mb-3 block text-base font-medium text-[#07074D]">
        {label}
      </label>
      <input
        onChange={onChange}
        value={value}
        required={required}
        type={type}
        name={inputId}
        id={inputId}
        placeholder={label}
        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        maxLength={maxLength}
      />
    </div>
  )
}

export default TextInput
