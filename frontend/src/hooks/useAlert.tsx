import { ReactNode, createContext, useContext, useMemo, useState } from 'react'

interface AlertContextType {
  alert: IAlert | null
  addAlert: (type: string, message: string) => void
  removeAlert: () => void
}

interface IAlert {
  type: string
  message: string
}

const AlertContext = createContext<AlertContextType>({} as AlertContextType)

const AlertProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [alert, setAlert] = useState<IAlert | null>(null)

  const removeAlert = () => setAlert(null)

  const addAlert = (type: string, message: string) =>
    setAlert({ type, message })

  const values = {
    alert,
    addAlert,
    removeAlert,
  }

  return (
    <AlertContext.Provider value={values}>{children}</AlertContext.Provider>
  )
}

const useAlert = (): AlertContextType => {
  return useContext(AlertContext)
}

export { AlertProvider, useAlert }
