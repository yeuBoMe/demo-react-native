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

interface Product {
  id: string;
  name: string;
  image: any;
  size: string;
  category: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  items: Product[];
  paymentMethod: string;
  voucherTitle?: string;
  subtotal: string;
  discount: string;
  total: string;
  username: string; // Thêm username để phân biệt đơn hàng
}

const OrderHistoryScreen = () => {
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const { cartItems } = useCart();
  const { user } = useAuth();
  const { orderHistory } = useOrderHistory();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Order[]>([]);

  // Lọc đơn hàng chỉ cho user đang đăng nhập
  const userOrders = orderHistory.filter(
    (order) => order.username === user.username
  );

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const queryLower = searchQuery.toLowerCase();

    const results = userOrders.filter(
      (order) =>
        order.items.some((item) =>
          item.name.toLowerCase().includes(queryLower)
        ) ||
        (order.voucherTitle?.toLowerCase().includes(queryLower) ?? false)
    );

    setSearchResults(results);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderedList}>
      <View style={styles.orderItem}>
        <Text style={styles.orderDate}>{item.date}</Text>
        {item.items.map((product, index) => (
          <View
            key={`${product.id}-${product.size}-${index}`}
            style={styles.itemDetails}
          >
            <Image source={getImageSource(product.image)} style={styles.itemImage} />
            <View style={styles.itemText}>
              <Text style={styles.itemName}>{product.name}</Text>
              <Text style={styles.itemSize}>
                Size: {product.size}
                {product.category === "Coffee" ? " OZ" : ""}
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topBar}>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Main", { screen: "Home" })}
            >
              <Ionicons
                name="arrow-back-outline"
                size={20}
                color="black"
                style={styles.backButton}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Order History</Text>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}
          >
            <TouchableOpacity
              style={styles.cartIcon}
              onPress={() => navigation.navigate("Order")}
            >
              <Ionicons name="cart-outline" size={21} color="#333" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Main", { screen: "Profile" })}
            >
              <Image
                source={
                  user?.avatar
                    ? { uri: user.avatar }
                    : require("../../../assets/user.png")
                }
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
          <Text style={styles.emptyText}>No orders found for "{searchQuery}"</Text>
        </View>
      ) : (
        <FlatList
          data={searchQuery.length > 0 ? searchResults : userOrders.slice().reverse()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You haven't buy anything yet</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;