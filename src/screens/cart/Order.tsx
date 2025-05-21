import React, { useState, useEffect, createContext } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/cart/Order";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/route";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useOrderHistory } from "../../contexts/OrderHistoryContext";
import PopUp from '../../components/modal/Modal2';
import AsyncStorage from "@react-native-async-storage/async-storage";

const imageMap = {
    "apple.png": require("../../../assets/apple.png"),
    "burger.png": require("../../../assets/burger.png"),
    "yogurt.png": require("../../../assets/yogurt.png"),
    "ice-cream.png": require("../../../assets/ice-cream.png"),
    "coffee.png": require("../../../assets/coffee.png"),
    "kiwi-shake.png": require("../../../assets/kiwi-shake.png"),
    "blueberry-maze.png": require("../../../assets/blueberry-maze.png"),
    "mango-smoothie.png": require("../../../assets/mango-smoothie.png"),
    "apple-juice.png": require("../../../assets/apple-juice.png"),
    "pats-burger.png": require("../../../assets/pats-burger.png"),
    "cheese-burger.png": require("../../../assets/cheese-burger.png"),
    "chicken-burger.png": require("../../../assets/chicken-burger.png"),
    "veggie-burger.png": require("../../../assets/veggie-burger.png"),
    "berries-yogurt.png": require("../../../assets/berries-yogurt.png"),
    "strawberry-yogurt.png": require("../../../assets/strawberry-yogurt.png"),
    "plain-yogurt.png": require("../../../assets/plain-yogurt.png"),
    "mango-yogurt.png": require("../../../assets/mango-yogurt.png"),
    "vanilla-cream.png": require("../../../assets/vanilla-cream.png"),
    "chocolate-cream.png": require("../../../assets/chocolate-cream.png"),
    "strawberry-cream.png": require("../../../assets/strawberry-cream.png"),
    "caramel-cream.png": require("../../../assets/caramel-cream.png"),
    "espresso.png": require("../../../assets/espresso.png"),
    "latte.png": require("../../../assets/latte.png"),
    "cappuccino.png": require("../../../assets/cappuccino.png"),
    "mocha.png": require("../../../assets/mocha.png"),
};

const normalizeImage = (img) => {
    // Nếu là đường dẫn kiểu "../../assets/xxx.png" thì chỉ lấy "xxx.png"
    if (typeof img === "string" && img.includes("/")) {
        const parts = img.split("/");
        return parts[parts.length - 1];
    }
    return img;
};

const getImageSource = (img) => {
    const fileName = normalizeImage(img);
    return imageMap[fileName] || undefined;
};

type Order = {
    id: string;
    items: any[];
    subtotal: string;
    discount: string;
    voucherTitle: string;
    paymentMethod: string;
    paymentFee: string;
    total: string;
    date: string;
    username: string;
};

type OrderHistoryContextType = {
    orderHistory: Order[];
    addOrder: (order: Order) => void;
    clearOrders: () => void;
};

const OrderHistoryContext = createContext<OrderHistoryContextType>({
    orderHistory: [],
    addOrder: () => {},
    clearOrders: () => {},
});

type OrderHistoryProviderProps = {
    children: React.ReactNode;
};

export const OrderHistoryProvider = ({ children }: OrderHistoryProviderProps) => {
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const { user } = useAuth();

    // Load order history khi user thay đổi
    useEffect(() => {
        const loadOrderHistory = async () => {
            if (!user?.username) {
                setOrderHistory([]);
                return;
            }
            try {
                const data = await AsyncStorage.getItem(`orderHistory_${user.username}`);
                setOrderHistory(data ? JSON.parse(data) : []);
            } catch (error) {
                setOrderHistory([]);
            }
        };
        loadOrderHistory();
    }, [user]);

    // Lưu order history mỗi khi thay đổi
    useEffect(() => {
        if (!user?.username) return;
        AsyncStorage.setItem(
            `orderHistory_${user.username}`,
            JSON.stringify(orderHistory)
        );
    }, [orderHistory, user]);

    const addOrder = (order: Order) => {
        setOrderHistory((prev) => [...prev, order]);
    };

    const clearOrders = () => {
        setOrderHistory([]);
    };

    return (
        <OrderHistoryContext.Provider
            value={{ orderHistory, addOrder, clearOrders }}
        >
            {children}
        </OrderHistoryContext.Provider>
    );
};

const CartItemImage = ({ item }) => (
    <Image source={getImageSource(item.image)} style={styles.itemImage} />
);

const OrderScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "Order">>();
    const { cartItems, setCartItems, increaseQuantity, decreaseQuantity, removeItem } = useCart();
    const { user } = useAuth();
    const { orderHistory, addOrder } = useOrderHistory();

    const userOrders = orderHistory.filter(
        (order) => order.username === user.username
    );

    const [selectedVoucher, setSelectedVoucher] = useState(route.params?.voucherTitle || "");
    const [discountValue, setDiscountValue] = useState(route.params?.discountValue || 0);
    const [paymentMethod, setPaymentMethod] = useState(route.params?.paymentMethod || "PayPal");
    const [paymentFee, setPaymentFee] = useState(route.params?.paymentFee || 0);
    const [modalVisible, setModalVisible] = useState(false);

    // Khi quay lại OrderScreen với params mới (ví dụ sau khi chọn payment), cập nhật state
    useEffect(() => {
        if (route.params?.paymentMethod) {
            setPaymentMethod(route.params.paymentMethod);
        }
        if (route.params?.paymentFee !== undefined) {
            setPaymentFee(route.params.paymentFee);
        }
        if (route.params?.voucherTitle) {
            setSelectedVoucher(route.params.voucherTitle);
        }
        if (route.params?.discountValue !== undefined) {
            setDiscountValue(route.params.discountValue);
        }
    }, [route.params]);

    const calculateSubtotal = () => {
        return cartItems
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2);
    };

    const calculateDiscountAmount = () => {
        const subtotal = parseFloat(calculateSubtotal());
        const discount = (subtotal * discountValue) / 100;
        return discount.toFixed(2);
    };

    const calculateTotal = () => {
        const subtotal = parseFloat(calculateSubtotal());
        const discount = (subtotal * discountValue) / 100;
        const total = subtotal - discount + paymentFee;
        return total.toFixed(2);
    };

    const calculateItemTotal = (price, quantity) => {
        return (price * quantity).toFixed(2);
    };

    const handleApplyPromocode = () => {
        navigation.navigate("Main", { screen: "Voucher" });
    };

    const handleSelectPayment = () => {
        navigation.navigate("Payment", {
            cartItems,
            voucherTitle: selectedVoucher,
            discountValue,
            subtotal: calculateSubtotal(),
            total: calculateTotal(),
            // Cho payment screen biết đã có voucher, discount
        });
    };

    const handleCheckout = () => {
        if (!cartItems.length) {
            alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
            return;
        }
        type Order = {
            id: string;
            items: typeof cartItems;
            subtotal: string;
            discount: string;
            voucherTitle: string;
            paymentMethod: string;
            paymentFee: string;
            total: string;
            date: string;
            username: string;
        };

        const order: Order = {
            id: Date.now().toString(),
            items: cartItems,
            subtotal: calculateSubtotal(),
            discount: calculateDiscountAmount(),
            voucherTitle: selectedVoucher,
            paymentMethod: paymentMethod,
            paymentFee: paymentFee.toFixed(2),
            total: calculateTotal(),
            date: new Date().toLocaleString(),
            username: user?.username || "guest",
        };
        addOrder(order); // Gọi đúng 1 tham số order
        setModalVisible(true);
        setCartItems([]);
        setTimeout(() => {
            setModalVisible(false);
            navigation.navigate("Main", { screen: "OrderHistory" });
        }, 1500);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if (route.params?.voucherTitle) {
                            navigation.navigate("Main", { screen: "Home" });
                        } else {
                            navigation.goBack();
                        }
                    }}
                >
                    <Ionicons name="arrow-back-outline" size={20} color="black" style={styles.backButton} />
                </TouchableOpacity>
                <Text style={styles.headerText}>My Order</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity style={styles.cartIcon}>
                        <Ionicons name="cart-outline" size={21} color="#333" />
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "Profile" })}>
                        <Image
                            source={user?.avatar ? { uri: user.avatar } : require('../../../assets/user.png')}
                            style={{ width: 30, height: 30, borderRadius: 5 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {cartItems.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, color: '#888' }}>No product, add to cart first</Text>
                </View>
            ) : (
                <>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {cartItems.map((item) => {
                            const imgSrc = getImageSource(item.image);
                            console.log("item.image:", item.image, "->", normalizeImage(item.image), "->", imgSrc);
                            return (
                                <View key={`${item.id}-${item.size}`} style={styles.orderItem}>
                                    <Image source={getImageSource(item.image)} style={styles.itemImage} />
                                    <View style={styles.itemDetails}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemSize}>
                                            Size: {item.size}{item.category === "Coffee" ? " OZ" : ""}
                                        </Text>
                                        <Text style={styles.itemPrice}>
                                            ₱{calculateItemTotal(item.price, item.quantity)}
                                        </Text>
                                        <View style={styles.quantityContainer}>
                                            <TouchableOpacity onPress={() => decreaseQuantity(item.id, item.size)}>
                                                <Ionicons name="remove" size={20} color="#333" />
                                            </TouchableOpacity>
                                            <Text style={styles.quantityText}>{item.quantity}</Text>
                                            <TouchableOpacity onPress={() => increaseQuantity(item.id, item.size)}>
                                                <Ionicons name="add" size={20} color="#333" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => removeItem(item.id, item.size)} style={styles.deleteButton}>
                                        <Ionicons name="trash-outline" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </ScrollView>

                    <View style={styles.PromoSummaryContainer}>
                        <View style={styles.promoContainer}>
                            <TouchableOpacity onPress={handleApplyPromocode}>
                                <View style={styles.sectionTitleContainer}>
                                    <Text style={[styles.sectionTitle, { color: selectedVoucher ? "#808080" : "#FF8C42" }]}>
                                        Apply promocode
                                    </Text>
                                    <Text style={[styles.sectionTitleArrow, { color: selectedVoucher ? "#808080" : "#FF8C42" }]}>
                                        ›
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {selectedVoucher ? (
                                <View style={styles.promoInputContainer}>
                                    <Text style={[styles.promoText, { color: "#116953" }]}>{String(selectedVoucher)}</Text>
                                    <Ionicons name="checkmark-circle" size={20} color="#1A7E6C" style={styles.checkIcon} />
                                </View>
                            ) : null}
                        </View>

                        <View style={styles.summaryContainer}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryText}>Subtotal</Text>
                                <Text style={styles.summaryText3}>₱{calculateSubtotal()}</Text>
                            </View>
                            {discountValue > 0 && (
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryText}>Discount ({discountValue}%)</Text>
                                    <Text style={[styles.summaryText3, { color: "#FF8C42" }]}>
                                        -₱{calculateDiscountAmount()}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryText}>Delivery</Text>
                                <Text style={[styles.summaryText3, { color: "#1A7E6C" }]}>Free</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryText}>Payment Method</Text>
                                <TouchableOpacity onPress={handleSelectPayment}>
                                    <Text style={[styles.summaryText3, { color: "#FF8C42" }]}>{paymentMethod}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryText}>Payment Fee</Text>
                                <Text style={styles.summaryText3}>₱{paymentFee.toFixed(2)}</Text>
                            </View>
                            <View style={styles.line}></View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryText2}>Total</Text>
                                <Text style={styles.summaryText2}>₱{calculateTotal()}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.checkoutContainer}>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                            <Text style={styles.checkoutText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <PopUp modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    );
};

export default OrderScreen;