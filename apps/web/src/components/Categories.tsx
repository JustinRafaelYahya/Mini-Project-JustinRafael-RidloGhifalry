import React from 'react';

interface CategoriesProp {
  title: string;
  key: string;
  slug: string;
  icon: any;
}

const Categories = ({
  className,
  buttonClass,
  categories,
  onSelectCategory,
}: {
  className: string;
  buttonClass: string;
  categories: CategoriesProp[];
  onSelectCategory: (key: string) => void;
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
