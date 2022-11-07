import React from "react";
import { StatusBar } from "react-native";
import { NativeBaseProvider, Center } from "native-base";
import { THEME } from "./src/styles/theme";
import { 
  useFonts, 
  Roboto_400Regular, 
  Roboto_500Medium, 
  Roboto_700Bold 
} from "@expo-google-fonts/roboto";
import { Loading } from "./src/components/Loading";
import { SignIn } from "./src/screens/SignIn";
import { Pools } from "./src/screens/Pools";
import { AuthContextProvider } from "./src/contexts/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold
  })

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <Center flex={1} bg="gray.900">
          { !fontsLoaded ? <Loading /> : <SignIn /> }
        </Center>
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}