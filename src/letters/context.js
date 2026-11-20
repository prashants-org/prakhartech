import { createContext, useContext } from 'react'

// { user, profile, who, isAdmin, settings }
export const SessionContext = createContext(null)
export const useSession = () => useContext(SessionContext)
