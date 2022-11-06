import React from "react";
import Logo from "../assets/logo.svg";
import { Center, Icon, Text } from "native-base";
import { Fontisto } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export function SignIn() {
  const { signIn, user } = useAuth();

  console.log(user);

  return (
    <Center w="full" flex={1} p={7}>
      <Logo width={212} height={40} />

      <Button
        title="ENTRAR COM O GOOGLE"
        leftIcon={<Icon as={Fontisto} name="google" size="md" color="white" />}
        type="SECONDARY"
        mt={12}
        onPress={signIn}
      />

      <Text
        textAlign="center"
        color="white"
        mt={4}
      >
        Não utilizamos nenhuma informação além {"\n"} do seu e-mail para criação de sua conta.
      </Text>
    </Center>
  )
}