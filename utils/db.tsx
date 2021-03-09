import React, { createContext, useRef, useEffect, useState, useContext } from 'react'

import firebase from './firebase'
import 'firebase/firestore'
import { useAuth } from './useAuth'



interface AdminContext {
  isAdmin: boolean | null
}


const adminContext = createContext<AdminContext>({isAdmin:null})


export const useCheckAdmin = () => {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean|null>(null)
  const ref = useRef(0)

  useEffect(()=>{
    const val = ref.current;
    if (user !== void 0) {
      if (user === null) {
        setIsAdmin(false)
      } else {
        const fn = async () => {
          await firebase.firestore().collection("admin").doc("admin")
          .get().then(() => {
              if (val == ref.current) setIsAdmin(true);
          }).catch(() => {
              if (val == ref.current) setIsAdmin(false)
          });
        }
        fn()
      }
    }
    return () => {
      ref.current += 1
    }
  }, [user])

  return {isAdmin}
}


export const ProvideAdmin:React.FC = ({ children }) => {
  const isAdmin = useCheckAdmin()

  return (
    <adminContext.Provider value={isAdmin}>
      {children}
    </adminContext.Provider>
  )
}


export const useAdmin = () => {
  return useContext(adminContext);
};
