import { View, Text } from "react-native";

export default function Guide() {
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{ color: "white", fontSize: 20, fontFamily: "NotoSansBold" }}
      >
        Fejlesztés alatt...
      </Text>
    </View>
  );
}
