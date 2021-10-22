import React, { useState, useEffect } from "react";
import App from "./App";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const GlobalContext = React.createContext({
  value: "",
  setValue: () => {},
});

const GlobalContextProvider = (props) => {
  const [value, setValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(onAuthStateChanged)
  const auth = getAuth();
  const user = auth.currentUser;
  console.log('user', user)

  useEffect(()=> {
    onAuthStateChanged(auth, (user) => {
      return user ? setIsLoggedIn(true) : setIsLoggedIn(false);
    });
    if (isLoggedIn) {
      setValue(user.email);
      // history.push('/home')
    }

  },[])

  return (
    <GlobalContext.Provider
      value={{
        value,
        setValue,
      }}
    >
      <App />
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;

// To access value in a component:
// const { value, setValue } = useContext(GlobalContext);
