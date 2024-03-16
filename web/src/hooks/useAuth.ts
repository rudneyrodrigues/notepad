import { useContext } from 'react'
import { AuthContext, AuthContextDataProps } from '@/contexts/AuthProvider'

export const useAuth = (): AuthContextDataProps => {
  const context = useContext(AuthContext)

  return context
}
