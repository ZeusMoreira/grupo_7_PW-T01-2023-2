import React, { useEffect, useState } from 'react';
import './combobox.css';

const Combobox = ({ options, preselectedValue, placeholder = "Escolha uma opção...", classNameSelect, classNameDiv, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(preselectedValue || '');

  useEffect(() => {
    setSelectedValue(preselectedValue || '');
  }, [preselectedValue]);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedValue(selectedValue);
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <div className={`combobox ${classNameDiv}`}>
      <select
        value={selectedValue}
        onChange={handleSelectChange}
        className={classNameSelect}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Combobox;