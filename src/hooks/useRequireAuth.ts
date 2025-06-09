import { useAuthStore } from "@/stores/authStore"
import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

export const useRequireAuth = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate({
        to: '/login',
        replace: true
      })
    }
  }, [isAuthenticated, navigate])

  return user
}