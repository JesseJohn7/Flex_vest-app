'use client'
import React, { createContext, useContext, useState } from 'react'


type User = { name?: string; email?: string } | null


const UserContext = createContext<any>(null)


export function UserProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<User>({ name: 'Jesse John', email: 'jesse@example.com' })


return (
<UserContext.Provider value={{ user, setUser }}>
{children}
</UserContext.Provider>
)
}


export function useUser() {
return useContext(UserContext)
}