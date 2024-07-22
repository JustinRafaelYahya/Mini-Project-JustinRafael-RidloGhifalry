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
      {categories.map((category: string) => (
        <option key={category.id} value={category.key}>
          {category.title}
        </option>
      ))}
    </select>
  );
};

export default CategoriesDropDown;
