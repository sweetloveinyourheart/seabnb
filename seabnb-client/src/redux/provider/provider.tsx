"use client"

import { FunctionComponent } from "react";
import { store } from "../store";
import { Provider } from "react-redux";

interface ReduxProviderProps {
    children: any
}
 
const ReduxProvider: FunctionComponent<ReduxProviderProps> = ({ children }) => {
    return (  
        <Provider store={store}>
            {children}
        </Provider>
    );
}
 
export default ReduxProvider;