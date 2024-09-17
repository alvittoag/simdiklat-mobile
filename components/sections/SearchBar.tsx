import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Searchbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({
  search,
  handleSearchChange,
  showDialog,
  showFilter,
}: {
  search: string;
  showDialog?: () => void;
  handleSearchChange: (text: string) => void;
  showFilter?: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: Colors.border_primary,
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
      }}
    >
      <Searchbar
        value={search}
        onChangeText={handleSearchChange}
        placeholder="Search"
        placeholderTextColor={Colors.text_primary}
        iconColor={Colors.text_primary}
        inputStyle={{
          color: Colors.text_primary,
        }}
        style={{
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: Colors.border_primary,
          flex: 1,
        }}
      />

      {showFilter && (
        <TouchableOpacity onPress={showDialog}>
          <Ionicons name="filter" size={30} />
        </TouchableOpacity>
      )}
    </View>
  );
}
