import React from 'react';

const InputField = ({ label, name, type = 'text', register, placeholder }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      {type === 'textarea' ? (
        <textarea
          {...register(name, { required: true })}
          className="p-2 border w-full rounded-md focus:outline-none focus:ring focus:border-blue-300 min-h-[100px]"
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          {...register(name, { required: true })}
          className="p-2 border w-full rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default InputField;