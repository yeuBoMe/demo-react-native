// import { useState } from "react";
// import {
//     FlatList,
//     Image,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
//     SafeAreaView,
// } from "react-native";
// import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
// import { NavigationProp, useNavigation } from "@react-navigation/native";
// import { TabParamList, OrderItem } from "../../types/route";
// import { orderHistory, styles } from "../../../src/styles/cart/OrderHistory";
// import { useCart } from "../../contexts/CartContext"; // Import useCart
// import { useAuth } from "../../contexts/AuthContext";

// const OrderHistoryScreen: React.FC = () => {
//     const navigation = useNavigation<NavigationProp<TabParamList>>();
//     const { cartItems } = useCart(); // Lấy cartItems từ CartContext
//     const [searchQuery, setSearchQuery] = useState("");
//     const [searchResults, setSearchResults] = useState<OrderItem[]>([]);
//     const [isSearching, setIsSearching] = useState(false);
//     const { user } = useAuth();
//     // Handle search functionality based on displayed orders
//     const handleSearch = () => {
//         if (searchQuery.trim() === "") {
//             setIsSearching(false);
//             setSearchResults([]);
//             return;
//         }

//         const results = orderHistory.filter((order) =>
//             order.name.toLowerCase().includes(searchQuery.toLowerCase())
//         );

//         setSearchResults(results);
//         setIsSearching(true);
//     };

//     // Handle clearing the search input
//     const handleClearSearch = () => {
//         setSearchQuery("");
//         setIsSearching(false);
//         setSearchResults([]);
//     };

//     // Render each order item
//     const renderOrderItem = ({ item }: { item: OrderItem }) => (
//         <View style={styles.orderedList}>
//             <View style={styles.orderItem}>
//                 <Image source={item.image} style={styles.itemImage} />
//                 <View style={styles.itemDetails}>
//                     <Text style={styles.itemName}>{item.name}</Text>
//                     <Text style={styles.itemDate}>{item.date}</Text>
//                 </View>
//                 <View style={styles.itemPriceContainer}>
//                     <Text style={styles.price}>Price</Text>
//                     <Text style={styles.itemPrice}>₱{item.price.toFixed(2)}</Text>
//                 </View>
//             </View>
//         </View>
//     );

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 {/* --- Top bar: back + cart --- */}
//                 <View style={styles.topBar}>
//                     <View style={styles.headerIcons}>
//                         <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "Home" })}>
//                             <Ionicons
//                                 name="arrow-back-outline"
//                                 size={20}
//                                 color="black"
//                                 style={styles.backButton}
//                             />
//                         </TouchableOpacity>
//                         <Text style={styles.headerTitle}>Order History</Text>
//                     </View>
//                     <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
//                         <TouchableOpacity
//                             style={styles.cartIcon}
//                             onPress={() => navigation.navigate("Order")}
//                         >
//                             <Ionicons name="cart-outline" size={21} color="#333" />
//                             <View style={styles.cartBadge}>
//                                 <Text style={styles.cartBadgeText}>
//                                     {cartItems.length} {/* Hiển thị số lượng sản phẩm */}
//                                 </Text>
//                             </View>
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
//                             <Image
//                                 source={user?.avatar ? { uri: user.avatar } : require('../../../assets/user.png')}
//                                 style={{ width: 30, height: 30, borderRadius: 5 }}
//                             />
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>

//             {/* Search bar */}
//             <View style={styles.searchContainer}>
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Find food or restaurant..."
//                     placeholderTextColor="#c8c8c8"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                     onSubmitEditing={handleSearch}
//                     returnKeyType="search"
//                 />
//                 {searchQuery.length > 0 && (
//                     <TouchableOpacity onPress={handleClearSearch} style={{ marginLeft: 10 }}>
//                         <Ionicons name="close-circle-outline" size={20} color="#888" />
//                     </TouchableOpacity>
//                 )}
//                 <Ionicons
//                     name="search-outline"
//                     size={20}
//                     color="#1A7E6C"
//                     style={{ marginRight: 10 }}
//                 />
//             </View>

//             {/* Order List */}
//             {isSearching && searchResults.length === 0 ? (
//                 <View style={styles.emptyContainer}>
//                     <Text style={styles.emptyText}>
//                         No orders found for keyword "{searchQuery}"
//                     </Text>
//                 </View>
//             ) : (
//                 <FlatList
//                     data={isSearching ? searchResults : orderHistory}
//                     renderItem={renderOrderItem}
//                     keyExtractor={(item) => item.id}
//                     showsVerticalScrollIndicator={false}
//                 />
//             )}
//         </SafeAreaView>
//     );
// };

// export default OrderHistoryScreen;




import { useState } from "react";
import {
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TabParamList } from "../../types/route";
import styles from "../../styles/cart/OrderHistory";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useOrderHistory } from "../../contexts/OrderHistoryContext";

const OrderHistoryScreen = () => {
    const navigation = useNavigation<NavigationProp<TabParamList>>();
    const { cartItems } = useCart();
    const { user } = useAuth();
    const { orderHistory } = useOrderHistory();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = () => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            return;
        }

        const results = orderHistory.filter((order) =>
            order.items.some((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) || order.voucherTitle.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults(results);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderedList}>
            <View style={styles.orderItem}>
                <Text style={styles.orderDate}>{item.date}</Text>
                {item.items.map((product, index) => (
                    <View key={`${product.id}-${product.size}-${index}`} style={styles.itemDetails}>
                        <Image source={product.image} style={styles.itemImage} />
                        <View style={styles.itemText}>
                            <Text style={styles.itemName}>{product.name}</Text>
                            <Text style={styles.itemSize}>
                                Size: {product.size}{product.category === "Coffee" ? " OZ" : ""}
                            </Text>
                            <Text style={styles.itemQuantity}>Qty: {product.quantity}</Text>
                        </View>
                        <Text style={styles.itemPrice}>
                            ₱{(product.price * product.quantity).toFixed(2)}
                        </Text>
                    </View>
                ))}
                <View style={styles.orderSummary}>
                    <Text style={styles.summaryText}>Payment: {item.paymentMethod}</Text>
                    {item.voucherTitle && (
                        <Text style={styles.summaryText}>Voucher: {item.voucherTitle}</Text>
                    )}
                    <Text style={styles.summaryText}>Subtotal: ₱{item.subtotal}</Text>
                    {item.discount !== "0.00" && (
                        <Text style={styles.summaryText}>Discount: -₱{item.discount}</Text>
                    )}
                    <Text style={styles.summaryText}>Total: ₱{item.total}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.topBar}>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "Home" })}>
                            <Ionicons
                                name="arrow-back-outline"
                                size={20}
                                color="black"
                                style={styles.backButton}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Order History</Text>
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
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by food or voucher..."
                    placeholderTextColor="#c8c8c8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={handleClearSearch} style={{ marginLeft: 10 }}>
                        <Ionicons name="close-circle-outline" size={20} color="#888" />
                    </TouchableOpacity>
                )}
                <Ionicons
                    name="search-outline"
                    size={20}
                    color="#1A7E6C"
                    style={{ marginRight: 10 }}
                />
            </View>

            {searchQuery.length > 0 && searchResults.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        No orders found for "{searchQuery}"
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={searchQuery.length > 0 ? searchResults : orderHistory}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default OrderHistoryScreen;