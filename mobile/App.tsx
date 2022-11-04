import React from 'react';
import { NativeBaseProvider, Center } from 'native-base';
import { THEME } from './src/styles/theme';
import { 
  useFonts, 
  Roboto_400Regular, 
  Roboto_500Medium, 
  Roboto_700Bold 
} from '@expo-google-fonts/roboto';
import { Loading } from './src/components/Loading';
import { SignIn } from './src/screens/SignIn';
import { StatusBar } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold
  })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Center flex={1} bg="gray.900">
        { !fontsLoaded ? <Loading /> : <SignIn/> }
      </Center>
    </NativeBaseProvider>
  );
}