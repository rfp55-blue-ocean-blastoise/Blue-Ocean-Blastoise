import React, { useState } from "react";
import App from "./App";

export const GlobalContext = React.createContext({
  value: "",
  setValue: () => {},
});

const GlobalContextProvider = (props) => {
  const [value, setValue] = useState("");

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
