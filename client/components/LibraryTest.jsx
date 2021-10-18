import React, { useContext } from "react";
import { GlobalContext } from "./GlobalContextProvider";
import { BrowserRouter } from "react-router-dom";

const Library = () => {
  const { value, setValue } = useContext(GlobalContext);

  return (
    <BrowserRouter>
      <div>{value}</div>
    </BrowserRouter>
  );
};

export default Library

