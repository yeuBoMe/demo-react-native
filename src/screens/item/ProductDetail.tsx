import { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/item/ProductDetail";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/route";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import productsData from '../../data/products.json';

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
    if (typeof img === "string" && (img.startsWith("http") || img.startsWith("https"))) {
        return { uri: img };
    }
    if (imageMap[img]) return imageMap[img];
    return imageMap["latte.png"]; // fallback nếu không có
};

const getImageByProductName = (name) => {
    // Chuyển tên về dạng thường, thay dấu cách bằng dấu gạch ngang, bỏ ký tự đặc biệt
    const fileName = name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^a-z0-9\-]/g, "") + ".png";
    return imageMap[fileName] || undefined;
};

const DetailScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList, "Detail">>();
    const route = useRoute<RouteProp<RootStackParamList, "Detail">>();
    const { product } = route.params;
    const { addToCart, cartItems } = useCart();
    const { user } = useAuth();

    const currentCategory = product.category;

    // Lấy 2 sản phẩm đầu tiên của 2 category khác (không lấy trùng id)
    const otherCategories = productsData
        .filter(p => p.category !== currentCategory && p.id !== product.id)
        .reduce((acc, p) => {
            if (!acc.some(item => item.category === p.category)) {
                acc.push(p);
            }
            return acc;
        }, [])
        .slice(0, 2);

    const subProducts = [product, ...otherCategories];
    const subImages = subProducts.map(p => getImageByProductName(p.name));

    console.log("subProducts", subProducts.map(p => ({ name: p.name, image: p.image })));

    const [selectedSize, setSelectedSize] = useState(product.sizes[0].size);
    const [quantity, setQuantity] = useState(1);
    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        setSelectedImageIndex(0);
        setSelectedSize(product.sizes[0].size);
    }, [product]);

    const getPriceForSize = (size) => {
        const sizeObj = product.sizes.find((s) => s.size === size);
        return sizeObj ? sizeObj.price : product.price;
    };

    return (
        <ImageBackground
            source={require("../../../assets/item01-gradient.png")}
            style={styles.container}
        >
            <View style={styles.headerContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                        name="arrow-back-outline"
                        size={20}
                        color="black"
                        style={styles.backButton}
                        onPress={() => navigation.navigate("Main")}
                    />
                    <Text style={styles.itemName}>{product.name}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
                    <TouchableOpacity
                        style={styles.cartIcon}
                        onPress={() => navigation.navigate("Order")}
                    >
                        <Ionicons name="cart-outline" size={21} color="#333" />
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "Profile" })}>
                        <Image
                            source={user?.avatar ? { uri: user.avatar } : require("../../../assets/user.png")}
                            style={{ width: 30, height: 30, borderRadius: 5, marginLeft: 2 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.illustration}>
                    <View style={styles.mainImage_Quantity}>
                        <View style={styles.mainImageContainer}>
                            <Image source={getImageByProductName(product.name)} style={styles.mainImage} />
                        </View>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity style={styles.quantityButton} activeOpacity={1}>
                                <TouchableOpacity onPress={decreaseQuantity}>
                                    <Ionicons name="remove" size={22} color="white" />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{quantity}</Text>
                                <TouchableOpacity onPress={increaseQuantity}>
                                    <Ionicons name="add" size={22} color="white" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.subImageList}>
                        {subImages.map((img, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    if (index === 0) {
                                        setSelectedImageIndex(0);
                                    } else {
                                        // Lấy product gốc từ productsData theo id
                                        const nextProduct = productsData.find(p => p.id === subProducts[index].id);
                                        if (nextProduct) {
                                            navigation.replace("Detail", { product: nextProduct });
                                        }
                                    }
                                }}
                                activeOpacity={0.8}
                            >
                                <View style={styles.subImageContainer}>
                                    <Image source={img} style={styles.subImage} />
                                    {selectedImageIndex === index && <View style={styles.overlay} />}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.infoContainerWrapper}>
                    <View style={styles.infoContainer}>
                        <View style={styles.titleRow}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productPrice}>₱{getPriceForSize(selectedSize).toFixed(2)}</Text>
                        </View>

                        <View style={styles.sourceRow}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.sourceText}>{product.source} </Text>
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={10}
                                    color="#1A7E6C"
                                    style={{ paddingBottom: 6 }}
                                />
                            </View>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Ionicons name="star-half" size={16} color="#FFD700" />
                                <Text style={styles.ratingText}>4.2</Text>
                            </View>
                        </View>

                        <View style={styles.sizeContainer}>
                            <Text style={styles.sectionTitle}>Size</Text>
                            <View style={styles.sizeOptions}>
                                {product.sizes.map((item, index) => {
                                    const isSelected = selectedSize === item.size;
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => setSelectedSize(item.size)}
                                            style={styles.sizeOption}
                                        >
                                            {isSelected ? (
                                                <View style={styles.selectedSizeContainer}>
                                                    <View style={styles.circle1} />
                                                    <View style={styles.circle2} />
                                                    <Text style={styles.selectedSizeText}>{item.size}</Text>
                                                    <Text style={styles.selectedSizeText}>
                                                        {product.category === "Coffee" ? "OZ" : ""}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <>
                                                    <View style={styles.sizeOverlay} />
                                                    <Text style={styles.sizeText}>{item.size}</Text>
                                                    <Text style={styles.unitText}>
                                                        {product.category === "Coffee" ? "OZ" : ""}
                                                    </Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.descriptionContainer}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.descriptionText}>{product.description}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => {
                    const price = getPriceForSize(selectedSize);
                    addToCart({
                        id: product.id,
                        name: product.name,
                        price: price,
                        image: product.image,
                        source: product.source,
                        size: selectedSize,
                        quantity: quantity,
                        category: product.category,
                    });
                    navigation.navigate("Order");
                }}
            >
                <Ionicons name="cart-outline" size={20} color="#fff" style={{ marginRight: 5 }} />
                <Text style={styles.addToCartText}>Add to cart</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
};

export default DetailScreen;