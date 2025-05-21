import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Định nghĩa kiểu dữ liệu cho Order và Product
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
  username: string;
}

// Kiểu dữ liệu context
interface OrderHistoryContextType {
  orderHistory: Order[];
  addOrder: (order: Order) => void;
  clearOrders: () => void;
}

// Tạo context với giá trị mặc định (để khỏi undefined)
const OrderHistoryContext = createContext<OrderHistoryContextType>({
  orderHistory: [],
  addOrder: () => {},
  clearOrders: () => {},
});

interface OrderHistoryProviderProps {
  children: ReactNode;
}

export const OrderHistoryProvider = ({ children }: OrderHistoryProviderProps) => {
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  // Ví dụ: giả sử load data từ AsyncStorage hoặc API khi mount
  useEffect(() => {
    // Giả sử load async ở đây, ví dụ:
    // loadOrderHistoryFromStorage().then(data => setOrderHistory(data || []));
  }, []);

  // Hàm thêm đơn hàng mới
  const addOrder = (order: Order) => {
    setOrderHistory((prev) => [...prev, order]);
  };

  // Hàm xóa toàn bộ đơn hàng (nếu cần)
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

// Hook tiện lợi để dùng trong component
export const useOrderHistory = () => useContext(OrderHistoryContext);