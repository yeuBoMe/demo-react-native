// import React, { createContext, useContext, useState } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//     const [cartItems, setCartItems] = useState([]);

//     const addToCart = (item) => {
//         setCartItems((prevItems) => {
//             const existingItem = prevItems.find(
//                 (i) => i.id === item.id && i.size === item.size
//             );
//             if (existingItem) {
//                 return prevItems.map((i) =>
//                     i.id === item.id && i.size === item.size
//                         ? { ...i, quantity: i.quantity + item.quantity }
//                         : i
//                 );
//             }
//             return [...prevItems, item];
//         });
//     };

//     const increaseQuantity = (id, size) => {
//         setCartItems((prevItems) =>
//             prevItems.map((item) =>
//                 item.id === id && item.size === size
//                     ? { ...item, quantity: item.quantity + 1 }
//                     : item
//             )
//         );
//     };

//     const decreaseQuantity = (id, size) => {
//         setCartItems((prevItems) =>
//             prevItems.map((item) =>
//                 item.id === id && item.size === size && item.quantity > 1
//                     ? { ...item, quantity: item.quantity - 1 }
//                     : item
//             )
//         );
//     };

//     const removeItem = (id, size) => {
//         setCartItems((prevItems) =>
//             prevItems.filter((item) => !(item.id === id && item.size === size))
//         );
//     };

//     return (
//         <CartContext.Provider
//             value={{
//                 cartItems,
//                 addToCart,
//                 increaseQuantity,
//                 decreaseQuantity,
//                 removeItem,
//             }}
//         >
//             {children}
//         </CartContext.Provider>
//     );
// };

// export const useCart = () => useContext(CartContext);



import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (i) => i.id === item.id && i.size === item.size
            );
            if (existingItem) {
                return prevItems.map((i) =>
                    i.id === item.id && i.size === item.size
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prevItems, item];
        });
    };

    const increaseQuantity = (id, size) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id && item.size === size
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQuantity = (id, size) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id && item.size === size && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const removeItem = (id, size) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => !(item.id === id && item.size === size))
        );
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                setCartItems,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeItem,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);