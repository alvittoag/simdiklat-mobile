import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useState } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { moderateScale } from "react-native-size-matters";

const TABS_CONTENTS = [
  { name: "Biodata Diri", path: "biodata-diri" },
  { name: "kompetensi" },
];

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("Biodata Diri");

  console.log(activeTab);
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        flexDirection: "row",
        elevation: 3,
        borderBottomWidth: Platform.OS === "ios" ? 1 : 0,
        borderBottomColor: Colors.border_primary,
      }}
    >
      {TABS_CONTENTS.map((item: any) => (
        <TouchableOpacity
          key={item.name}
          onPress={() => setActiveTab(item.name)}
          style={{
            backgroundColor:
              item.name === activeTab ? Colors.button_secondary : Colors.white,
            paddingVertical: moderateScale(24),
            flex: 1,
          }}
        >
          <Text
            style={{ textAlign: "center", fontWeight: "600", fontSize: 15 }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
