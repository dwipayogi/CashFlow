import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const KEYS = {
  USERS: "users",
  TRANSACTIONS: "transactions",
  BUDGETS: "budgets",
  CURRENT_USER: "currentUser",
};

// Types
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  category: string;
  createdAt: string;
  updatedAt: string;
  categoryData?: {
    id: string;
    name: string;
    description: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface Budget {
  id: string;
  userId: string;
  amount: number;
  target: number;
  description: string;
  type: "EXPENSE" | "SAVINGS";
  category: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  categoryData?: {
    id: string;
    name: string;
    description: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Generate unique ID
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await AsyncStorage.getItem(KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

// Save users
const saveUsers = async (users: User[]) => {
  try {
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
  }
};

// Register user
export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<{
  success: boolean;
  message?: string;
  user?: any;
  token?: string;
}> => {
  try {
    const users = await getUsers();

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    const newUser: User = {
      id: generateId(),
      username,
      email,
      password, // In real app, this should be hashed
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await saveUsers(users);

    // Set current user
    const { password: _, ...userWithoutPassword } = newUser;
    await AsyncStorage.setItem(
      KEYS.CURRENT_USER,
      JSON.stringify(userWithoutPassword)
    );

    return {
      success: true,
      user: userWithoutPassword,
      token: newUser.id, // Using user ID as token
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, message: "Registration failed" };
  }
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<{
  success: boolean;
  message?: string;
  user?: any;
  token?: string;
}> => {
  try {
    const users = await getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    // Set current user
    const { password: _, ...userWithoutPassword } = user;
    await AsyncStorage.setItem(
      KEYS.CURRENT_USER,
      JSON.stringify(userWithoutPassword)
    );

    return {
      success: true,
      user: userWithoutPassword,
      token: user.id, // Using user ID as token
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: "Login failed" };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem(KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Get all transactions
export const getTransactions = async (
  userId: string
): Promise<Transaction[]> => {
  try {
    const transactions = await AsyncStorage.getItem(KEYS.TRANSACTIONS);
    const allTransactions: Transaction[] = transactions
      ? JSON.parse(transactions)
      : [];
    return allTransactions.filter((t) => t.userId === userId);
  } catch (error) {
    console.error("Error getting transactions:", error);
    return [];
  }
};

// Save all transactions
const saveTransactions = async (transactions: Transaction[]) => {
  try {
    await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions:", error);
  }
};

// Add transaction
export const addTransaction = async (
  userId: string,
  data: {
    description: string;
    amount: number;
    type: "DEPOSIT" | "WITHDRAWAL";
    category?: string;
  }
): Promise<{ success: boolean; message?: string; data?: Transaction }> => {
  try {
    const transactions = await AsyncStorage.getItem(KEYS.TRANSACTIONS);
    const allTransactions: Transaction[] = transactions
      ? JSON.parse(transactions)
      : [];

    const categoryData = data.category
      ? {
          id: generateId(),
          name: data.category,
          description: data.category,
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : undefined;

    const newTransaction: Transaction = {
      id: generateId(),
      userId,
      amount: data.amount,
      description: data.description,
      type: data.type,
      category: data.category || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      categoryData,
    };

    allTransactions.push(newTransaction);
    await saveTransactions(allTransactions);

    return { success: true, data: newTransaction };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { success: false, message: "Failed to add transaction" };
  }
};

// Get all budgets
export const getBudgets = async (userId: string): Promise<Budget[]> => {
  try {
    const budgets = await AsyncStorage.getItem(KEYS.BUDGETS);
    const allBudgets: Budget[] = budgets ? JSON.parse(budgets) : [];
    return allBudgets.filter((b) => b.userId === userId);
  } catch (error) {
    console.error("Error getting budgets:", error);
    return [];
  }
};

// Save all budgets
const saveBudgets = async (budgets: Budget[]) => {
  try {
    await AsyncStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
  } catch (error) {
    console.error("Error saving budgets:", error);
  }
};

// Add budget
export const addBudget = async (
  userId: string,
  data: {
    amount: number;
    target: number;
    description: string;
    type: "EXPENSE" | "SAVINGS";
    category?: string;
    endDate?: string;
  }
): Promise<{ success: boolean; message?: string; data?: Budget }> => {
  try {
    const budgets = await AsyncStorage.getItem(KEYS.BUDGETS);
    const allBudgets: Budget[] = budgets ? JSON.parse(budgets) : [];

    const categoryData = data.category
      ? {
          id: generateId(),
          name: data.category,
          description: data.category,
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : undefined;

    const newBudget: Budget = {
      id: generateId(),
      userId,
      amount: data.amount,
      target: data.target,
      description: data.description,
      type: data.type,
      category: data.category || "",
      endDate: data.endDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      categoryData,
    };

    allBudgets.push(newBudget);
    await saveBudgets(allBudgets);

    return { success: true, data: newBudget };
  } catch (error) {
    console.error("Error adding budget:", error);
    return { success: false, message: "Failed to add budget" };
  }
};

// Update budget
export const updateBudget = async (
  userId: string,
  budgetId: string,
  data: {
    description?: string;
    amount?: number;
    target?: number;
    category?: string;
    endDate?: string;
  }
): Promise<{ success: boolean; message?: string; data?: Budget }> => {
  try {
    const budgets = await AsyncStorage.getItem(KEYS.BUDGETS);
    const allBudgets: Budget[] = budgets ? JSON.parse(budgets) : [];

    const budgetIndex = allBudgets.findIndex(
      (b) => b.id === budgetId && b.userId === userId
    );

    if (budgetIndex === -1) {
      return { success: false, message: "Budget not found" };
    }

    const categoryData = data.category
      ? {
          id: generateId(),
          name: data.category,
          description: data.category,
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : allBudgets[budgetIndex].categoryData;

    allBudgets[budgetIndex] = {
      ...allBudgets[budgetIndex],
      ...data,
      categoryData,
      updatedAt: new Date().toISOString(),
    };

    await saveBudgets(allBudgets);

    return { success: true, data: allBudgets[budgetIndex] };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, message: "Failed to update budget" };
  }
};

// Delete budget
export const deleteBudget = async (
  userId: string,
  budgetId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const budgets = await AsyncStorage.getItem(KEYS.BUDGETS);
    const allBudgets: Budget[] = budgets ? JSON.parse(budgets) : [];

    const filteredBudgets = allBudgets.filter(
      (b) => !(b.id === budgetId && b.userId === userId)
    );

    if (filteredBudgets.length === allBudgets.length) {
      return { success: false, message: "Budget not found" };
    }

    await saveBudgets(filteredBudgets);

    return { success: true };
  } catch (error) {
    console.error("Error deleting budget:", error);
    return { success: false, message: "Failed to delete budget" };
  }
};
