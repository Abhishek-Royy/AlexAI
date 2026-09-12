import React, { useEffect } from "react";
import Home from "./pages/Home";
import { getCurrentUser } from "./apis/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUserdata } from "./redux/userSlice";

function App() {


  // used for update the data in redux
  const dispatch=useDispatch()

  useEffect(() => {
    const getUser = async () => {
    const data=await getCurrentUser();
    dispatch(setUserdata(data))
    };
    getUser();
  }, []);

  return (
    <>
      <Home />
    </>
  );
}

export default App;
