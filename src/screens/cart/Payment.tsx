import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import styles from '../../styles/cart/Payment';
import { RootStackParamList } from '../../types/route';
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const PaymentScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "Payment">>();
    const { cartItems } = useCart();
    const { user } = useAuth();
    const [selected, setSelected] = useState("PayPal");

    // Cung cấp giá trị mặc định
    const { voucherTitle = "", discountValue = 0, subtotal = "0.00" } = route.params || {};

    const calculatePaymentFee = () => {
        const baseTotal = parseFloat(subtotal || "0.00");
        let fee = 0;
        if (selected === "PayPal") {
            fee = baseTotal * 0.02; // Phí PayPal 2%
        } else if (selected === "GCash") {
            fee = baseTotal * 0.015; // Phí GCash 1.5%
        }
        return fee.toFixed(2);
    };

    const handleSelectPayment = (option: string) => {
        setSelected(option);
        navigation.navigate("Order", {
            voucherTitle,
            discountValue,
            paymentMethod: option,
            paymentFee: parseFloat(calculatePaymentFee()),
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.topBar}>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Ionicons
                                    name="arrow-back-outline"
                                    size={20}
                                    color="black"
                                    style={styles.backButton}
                                />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Payment</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
                            <TouchableOpacity
                                style={styles.cartIcon}
                                onPress={() => navigation.navigate("Order")}
                            >
                                <Ionicons name="cart-outline" size={21} color="#333" />
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>
                                        {cartItems.length}
                                    </Text>
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

                    <View style={styles.userRow}>
                        <Text style={styles.name}>Credit Cards</Text>
                        <TouchableOpacity style={styles.addBtnSmall}>
                            <Feather name="plus" size={14} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Credit Cards */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 20 }}
                    style={styles.card}
                >
                    <ImageBackground
                        source={require("../../../assets/credit-card.png")}
                        style={styles.bannerContainer}
                        imageStyle={{ borderRadius: 15 }}
                    >
                        <View style={styles.cardDecoration}>
                            <View style={styles.circle1} />
                            <View style={styles.circle2}>
                                <View style={styles.circle3}>
                                    <View style={styles.circle4} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.topRow}>
                            <Text style={styles.visa}>VISA</Text>
                        </View>
                        <View style={styles.cardNumberContainer}>
                            <Text style={styles.cardNumber}>7741 6588 2123 6644</Text>
                        </View>
                        <View style={styles.bottomRow}>
                            <Text style={styles.namec}>JORDAN{"\n"}WATSON</Text>
                            <Text style={styles.exp}>EXP. END{"\n"}12/25</Text>
                        </View>
                    </ImageBackground>
                    <ImageBackground
                        source={require("../../../assets/banner01-gradient.png")}
                        style={styles.bannerContainer}
                        imageStyle={{ borderRadius: 15 }}
                    >
                        <View style={styles.cardDecoration2}>
                            <View style={styles.circle2_1} />
                            <View style={styles.circle2_2}>
                                <View style={styles.circle2_3}>
                                    <View style={styles.circle2_4} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.topRow}>
                            <Text style={styles.visa}>VISA</Text>
                        </View>
                        <View style={styles.cardNumberContainer}>
                            <Text style={styles.cardNumber}>7741 6588 2123 6644</Text>
                        </View>
                        <View style={styles.bottomRow}>
                            <Text style={styles.namec}>JORDAN{"\n"}WATSON</Text>
                            <Text style={styles.exp}>EXP. END{"\n"}12/25</Text>
                        </View>
                    </ImageBackground>
                </ScrollView>

                {/* Other Payment Options */}
                <View style={styles.otherOptionsContainer}>
                    <Text style={styles.otherTitle}>Other options</Text>
                    {["Apple Pay", "PayPal", "GCash"].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={styles.paymentOptionCard}
                            onPress={() => handleSelectPayment(option)}
                        >
                            <View style={styles.optionLeft}>
                                <View style={styles.iconWithBalance}>
                                    <Image
                                        source={
                                            option === "Apple Pay"
                                                ? require("../../../assets/appay.png")
                                                : option === "PayPal"
                                                ? require("../../../assets/paypal.png")
                                                : require("../../../assets/gcash.png")
                                        }
                                        style={[styles.optionIcon, { marginBottom: 4 }]}
                                    />
                                    <Text style={styles.optionBalance}>
                                        Balance: ${option === "Apple Pay" ? "1,340" : "3,340"}
                                    </Text>
                                </View>
                            </View>
                            <View style={[
                                styles.radioOuter,
                                { borderColor: selected === option ? '#FBB040' : '#ccc' }
                            ]}>
                                {selected === option && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PaymentScreen;