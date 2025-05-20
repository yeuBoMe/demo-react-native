import React, { createContext, useContext, useState } from "react";

const OrderHistoryContext = createContext();

export const OrderHistoryProvider = ({ children }) => {
    const [orderHistory, setOrderHistory] = useState([]);

    const addOrder = (order) => {
        setOrderHistory((prev) => [...prev, order]);
    };

    return (
        <OrderHistoryContext.Provider value={{ orderHistory, addOrder }}>
            {children}
        </OrderHistoryContext.Provider>
    );
};

export const useOrderHistory = () => useContext(OrderHistoryContext);