import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export function SimpleSignOut() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    console.log('SimpleSignOut: Logout clicked')
    try {
      await logout()
      console.log('SimpleSignOut: Logout successful')
      navigate('/login')
    } catch (error) {
      console.error('SimpleSignOut: Logout error:', error)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10000,
      backgroundColor: 'red',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      fontSize: '18px',
      fontWeight: 'bold',
      border: '3px solid white',
      boxShadow: '0 0 20px rgba(0,0,0,0.5)'
    }}>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: 'darkred',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          fontSize: '16px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🚨 EMERGENCY LOGOUT BUTTON 🚨
      </button>
    </div>
  )
}
