// Hook (use-auth.js)
import React, { useState, useEffect, useContext, createContext } from "react";
import firebase from "../utils/firebase";
import 'firebase/auth';


interface AuthContext {
  user: Record<string, any>|null|undefined;
  signin: (...args:any)=>void;
  signup: (...args:any)=>void;
  signout: (...args:any)=>void;
  sendPasswordResetEmail: (...args:any)=>void;
  confirmPasswordReset: (...args:any)=>void;
}


const authContext = createContext<AuthContext>({
  user: null,
  signin: (email:string, password:string)=>{},
  signup: ()=>{},
  signout: ()=>{},
  sendPasswordResetEmail: ()=>{},
  confirmPasswordReset: ()=>{}
});


function useProvideAuth() {
  const [user, setUser] = useState<firebase.User|null|undefined>(void 0);

  const signin = (email:string, password: string) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signup = (email:string, password:string) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
      });
  };

  const sendPasswordResetEmail = (email: string) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (code:string, password:string) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);


  return {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset
  };
}


export const ProvideAuth:React.FC = ({ children }) => {
  const auth = useProvideAuth();

  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  )
}


export const useAuth = () => {
  return useContext(authContext);
};
