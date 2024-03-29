import { useState, useEffect, useContext } from "react";
import { createContext } from "react";
import { Auth, DataStore } from "aws-amplify";
import { Courier } from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbCourier, setDbCourier] = useState(null);
  const sub = authUser?.attributes?.sub;

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setAuthUser);
  });

  console.log(sub);

  useEffect(() => {
    if (sub)
      DataStore.query(Courier, (courier) => courier.sub.eq(sub))
        .then((couriers) => setDbCourier(couriers[0]))
        .catch((err) => console.log(err));
  }, [sub]);

  return (
    <AuthContext.Provider value={{ authUser, dbCourier, sub, setDbCourier }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);
