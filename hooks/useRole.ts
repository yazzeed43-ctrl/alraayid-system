import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Role = 'admin' | 'employee' | null

export function useRole() {
  const [role, setRole] = useState<Role>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setRole(null)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      setRole(data?.role ?? null)
      setLoading(false)
    }

    getRole()
  }, [])

  return { role, loading, isAdmin: role === 'admin', isEmployee: role === 'employee' }
}
