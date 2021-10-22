import React, { useState } from "react";
import App from "./App";
import { signOut, getAuth } from "firebase/auth";

export const GlobalContext = React.createContext({
  value: "",
  setValue: () => {},
});

const GlobalContextProvider = (props) => {
  const [value, setValue] = useState("");
  const auth = getAuth();
  // const user = auth.currentUser;
  const signUserOut = () => {
    auth.signOut()
  }
  return (
    <GlobalContext.Provider
      value={{
        value,
        setValue,
        signUserOut
      }}
    >
      <App />
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;

// To access value in a component:
// const { value, setValue } = useContext(GlobalContext);
