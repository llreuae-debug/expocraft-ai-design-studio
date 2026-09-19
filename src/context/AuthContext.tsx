"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { DEMO_USERS } from "@/lib/constants";

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  switchRole: (role: UserRole) => void;
  setUser: (user: User) => void;
  // Permissions
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isDesigner: boolean;
  isEstimator: boolean;
  isSales: boolean;
  isClient: boolean;
  canEditProject: boolean;
  canEditBOQ: boolean;
  canEditDesign: boolean;
  canGenerateQuotation: boolean;
  canApproveClientQuote: boolean;
  canViewInternalCost: boolean;
  canManageSettings: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]); // Default to Super Admin

  useEffect(() => {
    const savedRole = localStorage.getItem("expocraft_user_role");
    if (savedRole) {
      const found = DEMO_USERS.find((u) => u.role === savedRole);
      if (found) setCurrentUser(found);
    }
  }, []);

  const switchRole = (role: UserRole) => {
    const found = DEMO_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem("expocraft_user_role", role);
    }
  };

  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";
  const isAdmin = isSuperAdmin || currentUser.role === "ADMIN";
  const isDesigner = currentUser.role === "DESIGNER";
  const isEstimator = currentUser.role === "ESTIMATOR";
  const isSales = currentUser.role === "SALES";
  const isClient = currentUser.role === "CLIENT";

  const canEditProject = !isClient;
  const canEditBOQ = isAdmin || isEstimator;
  const canEditDesign = isAdmin || isDesigner;
  const canGenerateQuotation = isAdmin || isEstimator || isSales;
  const canApproveClientQuote = isClient || isAdmin;
  const canViewInternalCost = !isClient;
  const canManageSettings = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers: DEMO_USERS,
        switchRole,
        setUser: setCurrentUser,
        isSuperAdmin,
        isAdmin,
        isDesigner,
        isEstimator,
        isSales,
        isClient,
        canEditProject,
        canEditBOQ,
        canEditDesign,
        canGenerateQuotation,
        canApproveClientQuote,
        canViewInternalCost,
        canManageSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
