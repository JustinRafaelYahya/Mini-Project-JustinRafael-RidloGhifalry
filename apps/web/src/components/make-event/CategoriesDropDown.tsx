import React from 'react';

interface Category {
  key: string;
  name: string;
}

interface CategoriesDropDownProps {
  className: string;
  categories: Category[]; // Define an array of Category type
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
      {categories.map((category: Category, index: number) => (
        <option key={index} value={category.key}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategoriesDropDown;
