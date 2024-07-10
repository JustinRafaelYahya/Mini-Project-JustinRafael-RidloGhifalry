import React from 'react';

const Categories = ({
  className,
  buttonClass,
  categories,
  onSelectCategory,
}) => {
  return (
    <nav className={className}>
      {categories.map((category) => (
        <button
          className={buttonClass}
          key={category.key}
          onClick={() => onSelectCategory(category.key)}
        >
          {category.icon}
          <p className="my-4">{category.title}</p>
        </button>
      ))}
    </nav>
  );
};

export default Categories;
