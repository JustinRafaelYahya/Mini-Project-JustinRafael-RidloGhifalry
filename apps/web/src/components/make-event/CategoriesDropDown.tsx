import React from 'react';

interface CategoriesDropDownProps {
  className: string;
  categories: any;
  register: any;
  name: string;
}

const CategoriesDropDown: React.FC<CategoriesDropDownProps> = ({
  className,
  categories,
  register,
  name,
}) => {
  return (
    <select className={className} {...register(name)}>
      {categories.map((category: string, index: number) => (
        <option key={index} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default CategoriesDropDown;
