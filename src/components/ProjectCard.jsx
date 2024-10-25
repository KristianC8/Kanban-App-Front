import React from 'react'

// eslint-disable-next-line react/prop-types
export const ProjectCard = ({ title, description }) => {
  return (
    <article className='w-full p-4 rounded-md bg-[#1a1a1a] hover:scale-105 hover:shadow-md hover:shadow-[#f74c3c] transition-all duration-500 cursor-pointer'>
      <h2 className='text-xl font-semibold text-[#f74c3c]'>{title}</h2>
      <h5 className='text-base font-semibold text-[#989898]'>Descripción:</h5>
      <p>{description}</p>
    </article>
  )
}
