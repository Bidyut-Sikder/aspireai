import React from 'react'

import { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex justify-center pt-40'>
        {children}
    </div>
  )
}

export default layout