import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext({
  imsakNotif: false,
  setImsakNotif: () => {},
  aksamNotif: false,
  setAksamNotif: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [imsakNotif, setImsakNotif] = useState(false);
  const [aksamNotif, setAksamNotif] = useState(false);

  return (
    <NotificationContext.Provider value={{ imsakNotif, setImsakNotif, aksamNotif, setAksamNotif }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
