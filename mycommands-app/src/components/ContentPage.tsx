import React from 'react'
import { Outlet } from 'react-router-dom'

export const ContentPage = () => {
  return (
    <div>
      ContentPage
      <Outlet/>
    </div>
  )
}
