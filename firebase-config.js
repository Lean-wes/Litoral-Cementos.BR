// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_QmiH-7Jl_JuYyJ8qiT706Gl9E38gr6k",
  authDomain: "litoralcementos.firebaseapp.com",
  projectId: "litoralcementos",
  storageBucket: "litoralcementos.firebasestorage.app",
  messagingSenderId: "242770167169",
  appId: "1:242770167169:web:b792d7befcbff576095480"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Google Auth Provider
const provider = new GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthChanged = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Helper function to get user's data collection
export const getUserCollection = (user, collectionName) => {
  if (!user || !user.uid) {
    throw new Error('Usuario no autenticado');
  }
  return collection(db, 'users', user.uid, collectionName);
};

// Firestore functions for products
export const saveProduct = async (user, product) => {
  try {
    const productsRef = getUserCollection(user, 'products');
    const docRef = await addDoc(productsRef, {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error('Error saving product:', error);
    throw error;
  }
};

export const getProducts = async (user) => {
  try {
    const productsRef = getUserCollection(user, 'products');
    const q = query(productsRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const updateProduct = async (user, productId, updates) => {
  try {
    const productRef = doc(getUserCollection(user, 'products'), productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (user, productId) => {
  try {
    const productRef = doc(getUserCollection(user, 'products'), productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Firestore functions for sales
export const saveSale = async (user, sale) => {
  try {
    const salesRef = getUserCollection(user, 'sales');
    const docRef = await addDoc(salesRef, {
      ...sale,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...sale };
  } catch (error) {
    console.error('Error saving sale:', error);
    throw error;
  }
};

export const getSales = async (user) => {
  try {
    const salesRef = getUserCollection(user, 'sales');
    const q = query(salesRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const sales = [];
    querySnapshot.forEach((doc) => {
      sales.push({ id: doc.id, ...doc.data() });
    });
    return sales;
  } catch (error) {
    console.error('Error getting sales:', error);
    throw error;
  }
};

// Firestore functions for expenses
export const saveExpense = async (user, expense) => {
  try {
    const expensesRef = getUserCollection(user, 'expenses');
    const docRef = await addDoc(expensesRef, {
      ...expense,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...expense };
  } catch (error) {
    console.error('Error saving expense:', error);
    throw error;
  }
};

export const getExpenses = async (user) => {
  try {
    const expensesRef = getUserCollection(user, 'expenses');
    const q = query(expensesRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const expenses = [];
    querySnapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() });
    });
    return expenses;
  } catch (error) {
    console.error('Error getting expenses:', error);
    throw error;
  }
};

export const updateExpense = async (user, expenseId, updates) => {
  try {
    const expenseRef = doc(getUserCollection(user, 'expenses'), expenseId);
    await updateDoc(expenseRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (user, expenseId) => {
  try {
    const expenseRef = doc(getUserCollection(user, 'expenses'), expenseId);
    await deleteDoc(expenseRef);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// Firestore functions for categories
export const saveCategory = async (user, category) => {
  try {
    const categoriesRef = getUserCollection(user, 'categories');
    const docRef = await addDoc(categoriesRef, {
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...category };
  } catch (error) {
    console.error('Error saving category:', error);
    throw error;
  }
};

export const getCategories = async (user) => {
  try {
    const categoriesRef = getUserCollection(user, 'categories');
    const q = query(categoriesRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};