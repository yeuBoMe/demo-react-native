// export type TabParamList = {
//   navigate(arg0: string): void;
//   HomePage: undefined;
//   Profile: undefined;
//   Voucher: undefined;
//   OrderHistory: undefined;
// };

// export type RootStackParamList = {
//   navigate(arg0: string): void;
//   Splash: undefined;
//   OnBoarding: undefined;
//   Login: undefined;
//   SignUp: undefined;
//   Order: { voucher?: string };
//   Detail?: { product: Product };
//   Edit: undefined;
//   About: undefined;
// };

// export interface Product {
//   id: string;
//   name: string;
//   price: number; // Sửa từ string thành number để đồng bộ với các màn hình trước
//   image: any;
//   source: string;
//   category: string;
//   description: string;
//   size?: { size: string }[];
// }

// export interface OrderItem {
//   id: string;
//   name: string;
//   date: string;
//   price: number;
//   image: any;
// }



export type TabParamList = {
  navigate(arg0: string): void;
  HomePage: undefined;
  Profile: undefined;
  Voucher: undefined;
  OrderHistory: undefined;
};

export type RootStackParamList = {
  navigate(arg0: string): void;
  Splash: undefined;
  OnBoarding: undefined;
  Login: undefined;
  SignUp: undefined;
  Order: { 
    voucherTitle?: string; 
    discountValue?: number;
    paymentMethod?: string;
    paymentFee?: number;
  };
  Detail?: { product: Product };
  Edit: undefined;
  About: undefined;
  Payment: {
    cartItems: any[];
    voucherTitle?: string;
    discountValue?: number;
    subtotal: string;
    total: string;
  };
};

export interface Product {
  id: string;
  name: string;
  price: number;
  image: any;
  source: string;
  category: string;
  description: string;
  size?: { size: string }[];
}

export interface OrderItem {
  id: string;
  name: string;
  date: string;
  price: number;
  image: any;
}