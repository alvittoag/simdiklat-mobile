import { View, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Searchbar } from "react-native-paper";
import { Icon } from "react-native-paper";

export default function SearchBar({
  search,
  handleSearchChange,
  showDialog,
  showFilter,
  showSort,
  showSortDialog,
}: {
  search: string;
  showDialog?: () => void;
  showSortDialog?: () => void;
  handleSearchChange: (text: string) => void;
  showFilter?: boolean;
  showSort?: boolean;
}) {
  return (
    <View
      style={{
        marginHorizontal: 15,
        marginTop: 15,
        backgroundColor: "white",
        paddingVertical: 8,
        paddingLeft: 10,
        paddingRight: 15,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        borderRadius: 5,
        elevation: 7,
        borderBottomWidth: Platform.OS === "android" ? 0.5 : 0.5,
        borderWidth: Platform.OS === "android" ? 0 : 0.5,
        borderBottomColor: Colors.border_primary,
        borderColor: Colors.border_primary,
      }}
    >
      <Searchbar
        value={search}
        onChangeText={handleSearchChange}
        placeholder="Cari Data..."
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
          borderRadius: 7,
        }}
      />

      <View style={{ flexDirection: "row", gap: 20 }}>
        {showSort && (
          <TouchableOpacity onPress={showDialog}>
            <Icon source="filter" color={Colors.text_primary} size={26} />
          </TouchableOpacity>
        )}

        {showFilter && (
          <TouchableOpacity onPress={showSortDialog}>
            <Icon source="arrow-up" color={Colors.text_primary} size={26} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
