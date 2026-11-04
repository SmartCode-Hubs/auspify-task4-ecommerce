import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) return prev.map((item) => item._id === product._id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // NEW: Update Quantity
  const updateQty = (id, amount) => {
    setCartItems((prev) => prev.map((item) => {
      if (item._id === id) {
        const newQty = item.qty + amount;
        return { ...item, qty: newQty < 1 ? 1 : newQty }; // Prevent 0 or negative
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCartItems((prev) => prev.filter((item) => item._id !== id));
  const clearCart = () => setCartItems([]);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQty, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};