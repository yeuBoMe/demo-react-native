import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Load cart từ AsyncStorage lúc app khởi động
    useEffect(() => {
        const loadCart = async () => {
            try {
                const storedCart = await AsyncStorage.getItem("cartItems");
                if (storedCart) {
                    setCartItems(JSON.parse(storedCart));
                }
            } catch (error) {
                console.error("Lỗi khi load cart từ AsyncStorage:", error);
            }
        };
        loadCart();
    }, []);

    // Lưu cart mỗi khi cartItems thay đổi
    useEffect(() => {
        const saveCart = async () => {
            try {
                await AsyncStorage.setItem(
                    "cartItems",
                    JSON.stringify(cartItems)
                );
            } catch (error) {
                console.error("Lỗi khi lưu cart vào AsyncStorage:", error);
            }
        };
        saveCart();
    }, [cartItems]);

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
            prevItems
                .map((item) =>
                    item.id === id && item.size === size
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeItem = (id, size) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => !(item.id === id && item.size === size))
        );
    };

    const clearCart = () => {
        setCartItems([]);
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
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart phải được dùng bên trong CartProvider");
    }
    return context;
};

const imageMap = {
    "apple.png": require("../../assets/apple.png"),
    "burger.png": require("../../assets/burger.png"),
    "yogurt.png": require("../../assets/yogurt.png"),
    "ice-cream.png": require("../../assets/ice-cream.png"),
    "coffee.png": require("../../assets/coffee.png"),
    "kiwi-shake.png": require("../../assets/kiwi-shake.png"),
    "blueberry-maze.png": require("../../assets/blueberry-maze.png"),
    "mango-smoothie.png": require("../../assets/mango-smoothie.png"),
    "apple-juice.png": require("../../assets/apple-juice.png"),
    "pats-burger.png": require("../../assets/pats-burger.png"),
    "cheese-burger.png": require("../../assets/cheese-burger.png"),
    "chicken-burger.png": require("../../assets/chicken-burger.png"),
    "veggie-burger.png": require("../../assets/veggie-burger.png"),
    "berries-yogurt.png": require("../../assets/berries-yogurt.png"),
    "strawberry-yogurt.png": require("../../assets/strawberry-yogurt.png"),
    "plain-yogurt.png": require("../../assets/plain-yogurt.png"),
    "mango-yogurt.png": require("../../assets/mango-yogurt.png"),
    "vanilla-cream.png": require("../../assets/vanilla-cream.png"),
    "chocolate-cream.png": require("../../assets/chocolate-cream.png"),
    "strawberry-cream.png": require("../../assets/strawberry-cream.png"),
    "caramel-cream.png": require("../../assets/caramel-cream.png"),
    "espresso.png": require("../../assets/espresso.png"),
    "latte.png": require("../../assets/latte.png"),
    "cappuccino.png": require("../../assets/cappuccino.png"),
    "mocha.png": require("../../assets/mocha.png"),
};

const normalizeImage = (img) => {
    if (typeof img === "string" && img.includes("/")) {
        const parts = img.split("/");
        return parts[parts.length - 1];
    }
    return img;
};

const getImageSource = (image) => {
    const fileName = normalizeImage(image);
    return imageMap[fileName] || undefined;
};

const styles = {
    itemImage: {
        width: 100,
        height: 100,
    },
};

const CartItemImage = ({ item }) => (
    <Image source={getImageSource(item.image)} style={styles.itemImage} />
);