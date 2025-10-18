import { createContext, useContext, useState, useEffect } from 'react'
import KdomojiNotification from './KdomojiNotification.jsx'
import KdomojiDetailsModal from './KdomojiDetailsModal.jsx'
import { getUnviewedKdomojis, markKdomojiAsViewed } from '../utils/kdomojiManager.js'

const KdomojiContext = createContext()

export function useKdomoji() {
  const context = useContext(KdomojiContext)
  if (!context) {
    throw new Error('useKdomoji must be used within KdomojiProvider')
  }
  return context
}

export function KdomojiProvider({ children }) {
  const [notificationQueue, setNotificationQueue] = useState([])
  const [currentNotification, setCurrentNotification] = useState(null)
  const [detailsModal, setDetailsModal] = useState(null)

  // Charger les kdomojis non vus au démarrage
  useEffect(() => {
    const unviewed = getUnviewedKdomojis()
    if (unviewed.length > 0) {
      setNotificationQueue(unviewed)
    }
  }, [])

  // Afficher la prochaine notification dans la queue
  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      const [next, ...rest] = notificationQueue
      setCurrentNotification(next)
      setNotificationQueue(rest)
    }
  }, [currentNotification, notificationQueue])

  const handleNotificationClose = () => {
    if (currentNotification) {
      markKdomojiAsViewed(currentNotification.id)
    }
    setCurrentNotification(null)
  }

  const handleViewDetails = (kdomoji) => {
    setDetailsModal(kdomoji)
    setCurrentNotification(null)
    if (kdomoji) {
      markKdomojiAsViewed(kdomoji.id)
    }
  }

  const showKdomoji = (kdomoji) => {
    // Ajouter à la queue s'il n'est pas déjà présent (functional setter pour éviter race conditions)
    setNotificationQueue(prev => {
      const exists = prev.find(k => k.id === kdomoji.id)
      const isCurrentlyShown = currentNotification && currentNotification.id === kdomoji.id
      
      if (!exists && !isCurrentlyShown) {
        return [...prev, kdomoji]
      }
      return prev
    })
  }

  const value = {
    showKdomoji,
    currentNotification,
  }

  return (
    <KdomojiContext.Provider value={value}>
      {children}
      
      {/* Notification popup */}
      {currentNotification && (
        <KdomojiNotification
          kdomoji={currentNotification}
          onClose={handleNotificationClose}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Details modal */}
      {detailsModal && (
        <KdomojiDetailsModal
          kdomoji={detailsModal}
          onClose={() => setDetailsModal(null)}
        />
      )}
    </KdomojiContext.Provider>
  )
}
