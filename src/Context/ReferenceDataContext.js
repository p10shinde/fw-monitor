import { createContext, useState } from "react";

let tBal = {
  FWW: { alcor: 0, ingame: 0, total: 0 },
  FWF: { alcor: 0, ingame: 0, total: 0 },
  FWG: { alcor: 0, ingame: 0, total: 0 },
};

let ReferenceDataContext = createContext({});
const ReferenceDataContextProvider = ({ children }) => {
  const accDet = {
    tBalances: tBal,
    curr_energy: 0,
    max_energy: 0,
  };
  const [accDetails, setAccDetails] = useState(accDet);

  return (
    <ReferenceDataContext.Provider value={{ accDetails, setAccDetails }}>
      {children}
    </ReferenceDataContext.Provider>
  );
};

export { ReferenceDataContext, ReferenceDataContextProvider };
