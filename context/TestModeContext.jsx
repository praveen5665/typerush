
'use client'
import { useState , createContext, useContext} from "react";

const TestModeContext = createContext();

export const TestModeContextProvider = ({ children }) => {

    const [testTime, setTestTime] = useState(15);
    
    const values = {
        testTime,
        setTestTime
    }
    return (<TestModeContext.Provider value={values}>{children}</TestModeContext.Provider>)
}

export const useTestModeContext = () => {
    return useContext(TestModeContext);
}