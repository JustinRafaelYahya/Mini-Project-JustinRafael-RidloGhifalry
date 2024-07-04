"use client"
import { useState } from "react"
import React from "react"


const Categories = ({className, divClass, categories}) => {
  return (
    <div className={className}>
{categories.map((category) => (
  <div className={divClass} key={category.key}>
  {category.icon}
   <p className="my-4">{category.title}</p>
  </div>))}
</div>
  )
}
export default Categories
