import { View, Text } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { Avatar, TextInput } from "react-native-paper";
import AppHeader from "@/components/AppHeader";
import { useNavigation } from "expo-router";

export default function KotakMasukDetail() {
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  return (
    <ContainerBackground>
      <AppHeader title="Arum Puspita" />
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingTop: moderateScale(20),
        }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: moderateScale(15),
            gap: moderateScale(20),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 15,
              alignItems: "flex-start",
              backgroundColor: Colors.primary,
              padding: moderateScale(15),
              borderRadius: 7,
              borderWidth: 1,
              borderColor: Colors.border_primary,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: 16,
                paddingBottom: moderateScale(30),
              }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: Colors.white,
                position: "absolute",
                left: 15,
                bottom: 12,
              }}
            >
              11 Agustuts 2024, 18:00
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row-reverse",
              gap: 15,
              alignItems: "flex-start",
              backgroundColor: "white",
              padding: moderateScale(15),
              borderRadius: 7,
              borderWidth: 1,
              borderColor: Colors.border_primary,
            }}
          >
            <Text
              style={{
                color: Colors.text_primary,
                fontSize: 16,
                paddingBottom: moderateScale(30),
              }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: Colors.text_secondary,
                position: "absolute",
                right: 15,
                bottom: 12,
              }}
            >
              11 Agustuts 2024, 18:00
            </Text>
          </View>
        </View>

        <View
          style={{
            borderTopColor: Colors.border_primary,
            borderTopWidth: 1,
          }}
        >
          <TextInput
            placeholder="Ketika pesan mu..."
            placeholderTextColor={Colors.text_secondary}
            textColor="black"
            multiline
            style={{
              flexGrow: 1,
              backgroundColor: "white",
              borderRadius: 0,
            }}
            right={<TextInput.Icon icon="send" color={Colors.primary} />}
          />
        </View>
      </View>
    </ContainerBackground>
  );
}
