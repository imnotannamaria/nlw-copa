import { createContext, useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  signIn: () => Promise<void>;
  isUserLoding: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const [isUserLoding, setIsUserLoding] = useState(false);

  const [request, response, promptAsync ] = Google.useAuthRequest({
    clientId: "850791439069-8doefcmuqav32ofhpjgjpg2saphmdi78.apps.googleusercontent.com",
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ["profile", "email"]
  })

  async function signIn() {
    try {
      setIsUserLoding(true);
      await promptAsync();
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setIsUserLoding(false);
    }
  }

  async function signInWithGoogle(accessToken: string){
    console.log("TOKEN DE AUTENTICAÇÃO = ", accessToken);
  }

  useEffect(() => {
    if(response?.type === "success" && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      signIn,
      user,
      isUserLoding
    }}>
      { children }
    </AuthContext.Provider>
  )
}