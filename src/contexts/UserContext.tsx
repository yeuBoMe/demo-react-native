import React, { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Định nghĩa kiểu user cho rõ ràng
export interface IUser {
  name: string;
  username: string; // email
  password: string;
  avatar?: string | null;
  address: string;
  vouchers?: { id: string; code: string }[]; // Thêm vouchers vào kiểu IUser
}

// Kiểu context: user và hàm setUser
interface IUserContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

// Tạo context với default là null và hàm rỗng
export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
});

// Provider component bọc toàn bộ app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  // Khi mount, load user từ AsyncStorage nếu có
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Giả sử user đăng nhập rồi, lưu username trong key "currentUser"
        const currentUsername = await AsyncStorage.getItem("currentUser");
        if (currentUsername) {
          const userDataString = await AsyncStorage.getItem(currentUsername);
          if (userDataString) {
            const userData: IUser = JSON.parse(userDataString);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
      }
    };
    loadUser();
  }, []);

  const removeVoucher = (voucherId: string) => {
    setUser((prev) => ({
      ...prev,
      vouchers: prev?.vouchers?.filter(v => v.id !== voucherId)
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};