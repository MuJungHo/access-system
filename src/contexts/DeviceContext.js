import React, { createContext, useState } from "react";

const DeviceContext = createContext();

function DeviceProvider(props) {
  const [DEVICE, setDEVICE] = useState({});
  const [DEVICES, setDEVICES] = useState([]);

  const value = {
    DEVICE,
    setDEVICE,
    DEVICES,
    setDEVICES,
  };

  return <DeviceContext.Provider value={value} {...props} />;
}

export { DeviceContext, DeviceProvider };