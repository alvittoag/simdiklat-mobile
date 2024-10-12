import { View, Text } from "react-native";
import React from "react";
import { moderateScale } from "react-native-size-matters";
import { Button, IconButton } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Pagination({
  page,
  setPage,
  totalPage,
  loading,
  horizontal = 15,
  bottom = 10,
}: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPage: number;
  loading: boolean;
  horizontal?: number;
  bottom?: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: moderateScale(horizontal),
        paddingVertical: moderateScale(bottom),
        marginBottom: moderateScale(10),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconButton
          icon={"chevron-left"}
          disabled={page === 1 || loading}
          onPress={() => setPage(page - 1)}
          size={30}
          iconColor="white"
          mode="contained"
          style={{
            backgroundColor: page === 1 ? "grey" : Colors.text_primary,
            borderRadius: 7,
            width: 55,
            height: 50,
          }}
        />

        <IconButton
          icon={"chevron-double-left"}
          disabled={page === 1 || loading}
          onPress={() => setPage(1)}
          size={30}
          iconColor="white"
          mode="contained"
          style={{
            backgroundColor: page === 1 ? "grey" : Colors.text_primary,
            borderRadius: 7,
            width: 50,
            height: 45,
          }}
        />
      </View>

      <Text
        style={{
          color: Colors.text_primary,
          fontWeight: "500",
          fontSize: 16,
        }}
      >
        Hal {totalPage === 0 ? "-" : page} of {totalPage}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconButton
          size={30}
          icon={"chevron-double-right"}
          disabled={page === totalPage || totalPage === 0 || loading}
          onPress={() => setPage(totalPage)}
          mode="contained"
          iconColor="white"
          style={{
            backgroundColor:
              page === totalPage || totalPage === 0
                ? "grey"
                : Colors.text_primary,
            borderRadius: 7,
            width: 50,
            height: 45,
          }}
        />

        <IconButton
          size={30}
          icon={"chevron-right"}
          disabled={page === totalPage || totalPage === 0 || loading}
          onPress={() => setPage(page + 1)}
          mode="contained"
          iconColor="white"
          style={{
            backgroundColor:
              page === totalPage || totalPage === 0
                ? "grey"
                : Colors.text_primary,
            borderRadius: 7,
            width: 55,
            height: 50,
          }}
        />
      </View>
    </View>
  );
}
