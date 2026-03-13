import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Amplify } from "aws-amplify";
import { fetchAuthSession, getCurrentUser, signIn, signOut } from "aws-amplify/auth";

const adminGroupName = import.meta.env.VITE_COGNITO_ADMIN_GROUP || "admin";
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;

if (userPoolId && userPoolClientId) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
      },
    },
  });
}

const AuthContext = createContext(null);

function getUserGroups(session) {
  const groups = session?.tokens?.idToken?.payload?.["cognito:groups"];
  return Array.isArray(groups) ? groups : [];
}

async function readAccessToken() {
  const session = await fetchAuthSession();
  return session?.tokens?.accessToken?.toString() || "";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [configured, setConfigured] = useState(Boolean(userPoolId && userPoolClientId));

  const refreshUser = async () => {
    if (!userPoolId || !userPoolClientId) {
      setUser(null);
      setConfigured(false);
      return;
    }

    setConfigured(true);

    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const groups = getUserGroups(session);

      setUser({
        id: currentUser.userId,
        username: currentUser.username,
        email: currentUser.signInDetails?.loginId || "",
        groups,
      });
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      setAuthLoading(true);
      await refreshUser();
      if (mounted) {
        setAuthLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    if (!userPoolId || !userPoolClientId) {
      throw new Error("Missing Cognito configuration. Set the Vite Cognito environment variables.");
    }

    const result = await signIn({
      username: email,
      password,
    });

    if (result?.nextStep?.signInStep && result.nextStep.signInStep !== "DONE") {
      throw new Error("This account requires an additional Cognito sign-in step.");
    }

    await refreshUser();
  };

  const logout = async () => {
    if (!userPoolId || !userPoolClientId) {
      setUser(null);
      return;
    }

    await signOut();
    setUser(null);
  };

  const getAccessToken = async () => {
    if (!userPoolId || !userPoolClientId) {
      return "";
    }

    return readAccessToken();
  };

  const value = useMemo(
    () => ({
      user,
      authLoading,
      configured,
      isAdmin: user?.groups?.includes(adminGroupName) || false,
      login,
      logout,
      getAccessToken,
      refreshUser,
    }),
    [user, authLoading, configured]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}