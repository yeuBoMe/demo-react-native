// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     Image,
//     TouchableOpacity,
//     ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import styles from "../../styles/cart/Order";
// import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
// import { RootStackParamList } from "../../types/route";
// import { useCart } from "../../contexts/CartContext";
// import { useAuth } from "../../contexts/AuthContext";

// const OrderScreen = () => {
//     const navigation = useNavigation<NavigationProp<RootStackParamList>>();
//     const route = useRoute<RouteProp<RootStackParamList, "Order">>();
//     const { cartItems, increaseQuantity, decreaseQuantity, removeItem } = useCart();
//     const { user } = useAuth();
//     const [selectedVoucher, setSelectedVoucher] = useState(route.params?.voucherTitle || "");
//     const [discountValue, setDiscountValue] = useState(route.params?.discountValue || 0);

//     const calculateSubtotal = () => {
//         return cartItems
//             .reduce((total, item) => total + item.price * item.quantity, 0)
//             .toFixed(2);
//     };

//     const calculateDiscountAmount = () => {
//         const subtotal = parseFloat(calculateSubtotal());
//         const discount = (subtotal * discountValue) / 100;
//         return discount.toFixed(2);
//     };

//     const calculateTotal = () => {
//         const subtotal = parseFloat(calculateSubtotal());
//         const discount = (subtotal * discountValue) / 100;
//         const total = subtotal - discount;
//         return total.toFixed(2);
//     };

//     const calculateItemTotal = (price, quantity) => {
//         return (price * quantity).toFixed(2);
//     };

//     const handleApplyPromocode = () => {
//         navigation.navigate("Main", { screen: "Voucher" });
//     };

//     const handleCheckout = () => {
//         navigation.navigate("Payment");
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.headerContainer}>
//                 <TouchableOpacity
//                     onPress={() => {
//                         if (route.params?.voucherTitle) {
//                             navigation.navigate("Main", { screen: "Home" });
//                         } else {
//                             navigation.goBack();
//                         }
//                     }}
//                 >
//                     <Ionicons
//                         name="arrow-back-outline"
//                         size={20}
//                         color="black"
//                         style={styles.backButton}
//                     />
//                 </TouchableOpacity>
//                 <Text style={styles.headerText}>My Order</Text>
//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                     <TouchableOpacity style={styles.cartIcon}>
//                         <Ionicons name="cart-outline" size={21} color="#333" />
//                         <View style={styles.cartBadge}>
//                             <Text style={styles.cartBadgeText}>
//                                 {cartItems.length}
//                             </Text>
//                         </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         onPress={() => navigation.navigate("Main", { screen: "Profile" })}
//                     >
//                         <Image
//                             source={user?.avatar ? { uri: user.avatar } : require('../../../assets/user.png')}
//                             style={{ width: 30, height: 30, borderRadius: 5 }}
//                         />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <ScrollView
//                 style={{ flex: 1 }}
//                 contentContainerStyle={{ paddingBottom: 100 }}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {cartItems.map((item) => (
//                     <View key={`${item.id}-${item.size}`} style={styles.orderItem}>
//                         <Image source={item.image} style={styles.itemImage} />
//                         <View style={styles.itemDetails}>
//                             <Text style={styles.itemName}>{item.name}</Text>
//                             <Text style={styles.itemSize}>
//                                 Size: {item.size}{item.category === "Coffee" ? " OZ" : ""}
//                             </Text>
//                             <Text style={styles.itemPrice}>
//                                 ₱{calculateItemTotal(item.price, item.quantity)}
//                             </Text>
//                             <View style={styles.quantityContainer}>
//                                 <TouchableOpacity onPress={() => decreaseQuantity(item.id, item.size)}>
//                                     <Ionicons name="remove" size={20} color="#333" />
//                                 </TouchableOpacity>
//                                 <Text style={styles.quantityText}>{item.quantity}</Text>
//                                 <TouchableOpacity onPress={() => increaseQuantity(item.id, item.size)}>
//                                     <Ionicons name="add" size={20} color="#333" />
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                         <TouchableOpacity
//                             onPress={() => removeItem(item.id, item.size)}
//                             style={styles.deleteButton}
//                         >
//                             <Ionicons name="trash-outline" size={20} color="white" />
//                         </TouchableOpacity>
//                     </View>
//                 ))}
//             </ScrollView>

//             <View style={styles.PromoSummaryContainer}>
//                 <View style={styles.promoContainer}>
//                     <TouchableOpacity onPress={handleApplyPromocode}>
//                         <View style={styles.sectionTitleContainer}>
//                             <Text
//                                 style={[
//                                     styles.sectionTitle,
//                                     {
//                                         color: selectedVoucher ? "#808080" : "#FF8C42",
//                                     },
//                                 ]}
//                             >
//                                 Apply promocode
//                             </Text>
//                             <Text
//                                 style={[
//                                     styles.sectionTitleArrow,
//                                     {
//                                         color: selectedVoucher ? "#808080" : "#FF8C42",
//                                     },
//                                 ]}
//                             >
//                                 ›
//                             </Text>
//                         </View>
//                     </TouchableOpacity>
//                     {selectedVoucher ? (
//                         <View style={styles.promoInputContainer}>
//                             <Text style={[styles.promoText, { color: "#116953" }]}>
//                                 {String(selectedVoucher)}
//                             </Text>
//                             <Ionicons
//                                 name="checkmark-circle"
//                                 size={20}
//                                 color="#1A7E6C"
//                                 style={styles.checkIcon}
//                             />
//                         </View>
//                     ) : null}
//                 </View>

//                 <View style={styles.summaryContainer}>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryText}>Subtotal</Text>
//                         <Text style={styles.summaryText3}>₱{calculateSubtotal()}</Text>
//                     </View>
//                     {discountValue > 0 && (
//                         <View style={styles.summaryRow}>
//                             <Text style={styles.summaryText}>Discount ({discountValue}%)</Text>
//                             <Text style={[styles.summaryText3, { color: "#FF8C42" }]}>
//                                 -₱{calculateDiscountAmount()}
//                             </Text>
//                         </View>
//                     )}
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryText}>Delivery</Text>
//                         <Text style={[styles.summaryText3, { color: "#1A7E6C" }]}>Free</Text>
//                     </View>
//                     <View style={styles.line}></View>
//                     <View style={styles.summaryRow}>
//                         <Text style={[styles.summaryText2]}>Total</Text>
//                         <Text style={[styles.summaryText2]}>₱{calculateTotal()}</Text>
//                     </View>
//                 </View>
//             </View>

//             <View style={styles.checkoutContainer}>
//                 <TouchableOpacity
//                     style={styles.checkoutButton}
//                     onPress={handleCheckout}
//                 >
//                     <Text style={styles.checkoutText}>Checkout</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// export default OrderScreen;



// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     Image,
//     TouchableOpacity,
//     ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import styles from "../../styles/cart/Order";
// import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
// import { RootStackParamList } from "../../types/route";
// import { useCart } from "../../contexts/CartContext";
// import { useAuth } from "../../contexts/AuthContext";

// const OrderScreen = () => {
//     const navigation = useNavigation<NavigationProp<RootStackParamList>>();
//     const route = useRoute<RouteProp<RootStackParamList, "Order">>();
//     const { cartItems, increaseQuantity, decreaseQuantity, removeItem } = useCart();
//     const { user } = useAuth();
//     const [selectedVoucher, setSelectedVoucher] = useState(route.params?.voucherTitle || "");
//     const [discountValue, setDiscountValue] = useState(route.params?.discountValue || 0);

//     const calculateSubtotal = () => {
//         return cartItems
//             .reduce((total, item) => total + item.price * item.quantity, 0)
//             .toFixed(2);
//     };

//     const calculateDiscountAmount = () => {
//         const subtotal = parseFloat(calculateSubtotal());
//         const discount = (subtotal * discountValue) / 100;
//         return discount.toFixed(2);
//     };

//     const calculateTotal = () => {
//         const subtotal = parseFloat(calculateSubtotal());
//         const discount = (subtotal * discountValue) / 100;
//         const total = subtotal - discount;
//         return total.toFixed(2);
//     };

//     const calculateItemTotal = (price, quantity) => {
//         return (price * quantity).toFixed(2);
//     };

//     const handleApplyPromocode = () => {
//         navigation.navigate("Main", { screen: "Voucher" });
//     };

//     const handleCheckout = () => {
//         navigation.navigate("Payment", {
//             cartItems,
//             voucherTitle: selectedVoucher,
//             discountValue,
//             subtotal: calculateSubtotal(),
//             total: calculateTotal(),
//         });
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.headerContainer}>
//                 <TouchableOpacity
//                     onPress={() => {
//                         if (route.params?.voucherTitle) {
//                             navigation.navigate("Main", { screen: "Home" });
//                         } else {
//                             navigation.goBack();
//                         }
//                     }}
//                 >
//                     <Ionicons
//                         name="arrow-back-outline"
//                         size={20}
//                         color="black"
//                         style={styles.backButton}
//                     />
//                 </TouchableOpacity>
//                 <Text style={styles.headerText}>My Order</Text>
//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                     <TouchableOpacity style={styles.cartIcon}>
//                         <Ionicons name="cart-outline" size={21} color="#333" />
//                         <View style={styles.cartBadge}>
//                             <Text style={styles.cartBadgeText}>
//                                 {cartItems.length}
//                             </Text>
//                         </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         onPress={() => navigation.navigate("Main", { screen: "Profile" })}
//                     >
//                         <Image
//                             source={user?.avatar ? { uri: user.avatar } : require('../../../assets/user.png')}
//                             style={{ width: 30, height: 30, borderRadius: 5 }}
//                         />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <ScrollView
//                 style={{ flex: 1 }}
//                 contentContainerStyle={{ paddingBottom: 100 }}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {cartItems.map((item) => (
//                     <View key={`${item.id}-${item.size}`} style={styles.orderItem}>
//                         <Image source={item.image} style={styles.itemImage} />
//                         <View style={styles.itemDetails}>
//                             <Text style={styles.itemName}>{item.name}</Text>
//                             <Text style={styles.itemSize}>
//                                 Size: {item.size}{item.category === "Coffee" ? " OZ" : ""}
//                             </Text>
//                             <Text style={styles.itemPrice}>
//                                 ₱{calculateItemTotal(item.price, item.quantity)}
//                             </Text>
//                             <View style={styles.quantityContainer}>
//                                 <TouchableOpacity onPress={() => decreaseQuantity(item.id, item.size)}>
//                                     <Ionicons name="remove" size={20} color="#333" />
//                                 </TouchableOpacity>
//                                 <Text style={styles.quantityText}>{item.quantity}</Text>
//                                 <TouchableOpacity onPress={() => increaseQuantity(item.id, item.size)}>
//                                     <Ionicons name="add" size={20} color="#333" />
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                         <TouchableOpacity
//                             onPress={() => removeItem(item.id, item.size)}
//                             style={styles.deleteButton}
//                         >
//                             <Ionicons name="trash-outline" size={20} color="white" />
//                         </TouchableOpacity>
//                     </View>
//                 ))}
//             </ScrollView>

//             <View style={styles.PromoSummaryContainer}>
//                 <View style={styles.promoContainer}>
//                     <TouchableOpacity onPress={handleApplyPromocode}>
//                         <View style={styles.sectionTitleContainer}>
//                             <Text
//                                 style={[
//                                     styles.sectionTitle,
//                                     {
//                                         color: selectedVoucher ? "#808080" : "#FF8C42",
//                                     },
//                                 ]}
//                             >
//                                 Apply promocode
//                             </Text>
//                             <Text
//                                 style={[
//                                     styles.sectionTitleArrow,
//                                     {
//                                         color: selectedVoucher ? "#808080" : "#FF8C42",
//                                     },
//                                 ]}
//                             >
//                                 ›
//                             </Text>
//                         </View>
//                     </TouchableOpacity>
//                     {selectedVoucher ? (
//                         <View style={styles.promoInputContainer}>
//                             <Text style={[styles.promoText, { color: "#116953" }]}>
//                                 {String(selectedVoucher)}
//                             </Text>
//                             <Ionicons
//                                 name="checkmark-circle"
//                                 size={20}
//                                 color="#1A7E6C"
//                                 style={styles.checkIcon}
//                             />
//                         </View>
//                     ) : null}
//                 </View>

//                 <View style={styles.summaryContainer}>
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryText}>Subtotal</Text>
//                         <Text style={styles.summaryText3}>₱{calculateSubtotal()}</Text>
//                     </View>
//                     {discountValue > 0 && (
//                         <View style={styles.summaryRow}>
//                             <Text style={styles.summaryText}>Discount ({discountValue}%)</Text>
//                             <Text style={[styles.summaryText3, { color: "#FF8C42" }]}>
//                                 -₱{calculateDiscountAmount()}
//                             </Text>
//                         </View>
//                     )}
//                     <View style={styles.summaryRow}>
//                         <Text style={styles.summaryText}>Delivery</Text>
//                         <Text style={[styles.summaryText3, { color: "#1A7E6C" }]}>Free</Text>
//                     </View>
//                     <View style={styles.line}></View>
//                     <View style={styles.summaryRow}>
//                         <Text style={[styles.summaryText2]}>Total</Text>
//                         <Text style={[styles.summaryText2]}>₱{calculateTotal()}</Text>
//                     </View>
//                 </View>
//             </View>

//             <View style={styles.checkoutContainer}>
//                 <TouchableOpacity
//                     style={styles.checkoutButton}
//                     onPress={handleCheckout}
//                 >
//                     <Text style={styles.checkoutText}>Checkout</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// export default OrderScreen;




import React, { useState } from "react";
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

const OrderScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "Order">>();
    const { cartItems, setCartItems, increaseQuantity, decreaseQuantity, removeItem } = useCart();
    const { user } = useAuth();
    const { addOrder } = useOrderHistory();
    const [selectedVoucher, setSelectedVoucher] = useState(route.params?.voucherTitle || "");
    const [discountValue, setDiscountValue] = useState(route.params?.discountValue || 0);
    const [paymentMethod, setPaymentMethod] = useState(route.params?.paymentMethod || "PayPal");
    const [paymentFee, setPaymentFee] = useState(route.params?.paymentFee || 0);

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
        });
    };

    const handleCheckout = () => {
        if (!cartItems.length) {
            alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
            return;
        }
        const order = {
            id: Date.now().toString(),
            items: cartItems,
            subtotal: calculateSubtotal(),
            discount: calculateDiscountAmount(),
            voucherTitle: selectedVoucher,
            paymentMethod: paymentMethod,
            paymentFee: paymentFee.toFixed(2),
            total: calculateTotal(),
            date: new Date().toLocaleString(),
        };
        addOrder(order);
        setCartItems([]);
        navigation.navigate("Main", { screen: "OrderHistory" });
    };

    return (
        <View style={styles.container}>
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
                    <Ionicons
                        name="arrow-back-outline"
                        size={20}
                        color="black"
                        style={styles.backButton}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>My Order</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity style={styles.cartIcon}>
                        <Ionicons name="cart-outline" size={21} color="#333" />
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>
                                {cartItems.length}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Main", { screen: "Profile" })}
                    >
                        <Image
                            source={user?.avatar ? { uri: user.avatar } : require('../../../assets/user.png')}
                            style={{ width: 30, height: 30, borderRadius: 5 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {cartItems.map((item) => (
                    <View key={`${item.id}-${item.size}`} style={styles.orderItem}>
                        <Image source={item.image} style={styles.itemImage} />
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
                        <TouchableOpacity
                            onPress={() => removeItem(item.id, item.size)}
                            style={styles.deleteButton}
                        >
                            <Ionicons name="trash-outline" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.PromoSummaryContainer}>
                <View style={styles.promoContainer}>
                    <TouchableOpacity onPress={handleApplyPromocode}>
                        <View style={styles.sectionTitleContainer}>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    {
                                        color: selectedVoucher ? "#808080" : "#FF8C42",
                                    },
                                ]}
                            >
                                Apply promocode
                            </Text>
                            <Text
                                style={[
                                    styles.sectionTitleArrow,
                                    {
                                        color: selectedVoucher ? "#808080" : "#FF8C42",
                                    },
                                ]}
                            >
                                ›
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {selectedVoucher ? (
                        <View style={styles.promoInputContainer}>
                            <Text style={[styles.promoText, { color: "#116953" }]}>
                                {String(selectedVoucher)}
                            </Text>
                            <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color="#1A7E6C"
                                style={styles.checkIcon}
                            />
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
                            <Text style={[styles.summaryText3, { color: "#FF8C42" }]}>
                                {paymentMethod}
                            </Text>
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
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={handleCheckout}
                >
                    <Text style={styles.checkoutText}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OrderScreen;