import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

interface ButtonProps extends IButtonProps{
  title: string;
  type?: "PRIMARY" | "SECONDARY";
}

export function Button ({ title, type = "PRIMARY", ...rest }: ButtonProps) {
  return (
    <ButtonNativeBase 
      h={14}
      w="full"
      rounded="sm"
      fontSize="md"
      textTransform="uppercase"
      bg={type === "SECONDARY" ? "red.500" : "yellow.500"}
      textAlign="center"
      _pressed={{
        bg: type === "SECONDARY" ? "red.600" : "yellow.600"
      }}
      {...rest}
    >
      <Text 
        fontSize="sm"
        fontFamily="heading"
        color={type === "SECONDARY" ? "white" : "black"}
      >
        {title}
      </Text>
    </ButtonNativeBase>
  )
}