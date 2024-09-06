import { View, Text } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BiodataDiri from "@/components/sections/biodata-kompetensi/BiodataDiri";
import DataKompetensi from "@/components/sections/biodata-kompetensi/DataKompetensi";
import BiodataDiriScreen from "./biodata-diri";
import DataKompetensiScreen from "./data-kompetensi";
import { Colors } from "@/constants/Colors";
import { moderateScale } from "react-native-size-matters";

const Tab = createMaterialTopTabNavigator();

export default function LayoutBiodataKompetensi() {
  return (
    <Tab.Navigator
      initialRouteName="biodata"
      screenOptions={{
        tabBarAndroidRipple: {
          borderless: false,
          foreground: false,
          radius: 1,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.primary,
          height: 3,
        },

        tabBarStyle: {
          paddingVertical: moderateScale(13),
          backgroundColor: Colors.white,
        },
        tabBarBounces: false,
      }}
    >
      <Tab.Screen
        options={{
          title: "Biodata Diri",
          tabBarLabel(props) {
            return (
              <Text
                style={{ color: props.color, fontSize: 15, fontWeight: "500" }}
              >
                Biodata Diri
              </Text>
            );
          },
        }}
        name="biodata"
        component={BiodataDiriScreen}
      />
      <Tab.Screen
        name="kompetensi"
        options={{
          tabBarLabel(props) {
            return (
              <Text
                style={{
                  color: props.color,
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Data Kompetensi
              </Text>
            );
          },
        }}
        component={DataKompetensiScreen}
      />
    </Tab.Navigator>
  );
}
