"use client"

import { useEffect } from 'react'

export default function MarkMessagesSeen() {
  useEffect(() => {
    try {
      const now = new Date().toISOString()
      localStorage.setItem('messagesLastSeenAt', now)
      // Notify other tabs to update
      window.dispatchEvent(new StorageEvent('storage', { key: 'messagesLastSeenAt', newValue: now }))
    } catch {}
  }, [])
  return null
}

