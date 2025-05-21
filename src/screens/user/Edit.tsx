import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../../types/route';
import styles from '../../styles/user/Edit';
import { TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';
import { useState } from 'react';
import PopUp from '../../components/modal/Modal';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useCart } from '../../contexts/CartContext';

const EditScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList, "Edit">>();
    const [modalVisible, setModalVisible] = useState(false);
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.username || '');
    const [password, setPassword] = useState(user?.password ?? '');
    const [address, setAddress] = useState(user?.address || '');
    const [avatar, setAvatar] = useState(user?.avatar || null);
    const { cartItems } = useCart();

    const handleUpdateProfile = async () => {
        if (!user) return;

        // Validate data
        if (!name.trim()) {
            Alert.alert("Validation Error", "Full Name cannot be empty.");
            return;
        }

        // Regex for name: letters and spaces only, min 2 characters
        const nameRegex = /^[a-zA-Z\s]{2,}$/;
        if (!nameRegex.test(name)) {
            Alert.alert("Validation Error", "Full Name must contain only letters and spaces, minimum 2 characters.");
            return;
        }

        if (!address.trim()) {
            Alert.alert("Validation Error", "Address cannot be empty.");
            return;
        }

        // Regex for address: must include letters, allow numbers, spaces, commas, and common address characters, min 5 characters
        const addressRegex = /^[a-zA-Z\s]+[a-zA-Z0-9\s,.-]*$/;
        if (!addressRegex.test(address)) {
            Alert.alert("Validation Error", "Address must start with letters and can include numbers, spaces, commas, periods, or hyphens.");
            return;
        }

        // Additional check to prevent phone number-like input
        const phoneNumberRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
        if (phoneNumberRegex.test(address)) {
            Alert.alert("Validation Error", "Address cannot be a phone number.");
            return;
        }

        if (!email.trim()) {
            Alert.alert("Validation Error", "E-mail cannot be empty.");
            return;
        }

        // Regex for email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Validation Error", "E-mail format is invalid.");
            return;
        }

        if (!password.trim()) {
            Alert.alert("Validation Error", "Password cannot be empty.");
            return;
        }

        const updatedUser = {
            ...user,
            name,
            username: email,
            password,
            avatar,
            address,
        };

        try {
            if (email !== user.username) {
                await AsyncStorage.removeItem(user.username);
            }
            await AsyncStorage.setItem(updatedUser.username, JSON.stringify(updatedUser));
            setUser(updatedUser);
            setModalVisible(true);
        } catch (error) {
            console.error("Error updating user", error);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to change your profile picture!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            setAvatar(selectedAsset.uri);
            if (user) {
                const updatedUser = { ...user, avatar: selectedAsset.uri };
                setUser(updatedUser);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "Profile" })}>
                        <Ionicons name="arrow-back-outline" size={20} color="black" style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.cartIcon} onPress={() => navigation.navigate("Order")}>
                        <Ionicons name="cart-outline" size={21} color="#333" />
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "Profile" })}>
                        <Image
                            source={avatar ? { uri: avatar } : require("../../../assets/user.png")}
                            style={{ width: 30, height: 30, borderRadius: 5 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.avatarWrapper}>
                <Image
                    source={avatar ? { uri: avatar } : require('../../../assets/avatar.png')}
                    style={styles.avatar}
                />
                <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
                    <Feather name="plus" size={16} color="#fff" />
                </TouchableOpacity>
            </View>

            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        placeholder="e.g. Joe Black"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        placeholder="e.g. 123 Main St, City"
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                    />
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        placeholder="e.g. joeblack@domain.com"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        placeholder="Enter new password"
                        secureTextEntry
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={handleUpdateProfile} style={styles.updateButton}>
                        <Text style={styles.updateButtonText}>Update Profile</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>

            <PopUp modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </SafeAreaView>
    );
};

export default EditScreen;