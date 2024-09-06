import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Button } from "react-native-paper";
import { Colors } from "@/constants/Colors";

interface CardIndexProps {
  num: string;
  title: string;
  data: { title: string; value: string }[];
  onPressAdd?: () => void;
  onPressEdit?: () => void;
  onPressDelete?: () => void;
}

const CardIndex: React.FC<CardIndexProps> = ({
  num,
  title,
  data,
  onPressAdd,
  onPressEdit,
  onPressDelete,
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {num}. {title}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          icon="plus"
          mode="contained"
          textColor="black"
          style={styles.addButton}
          onPress={onPressAdd}
        >
          Tambah Data
        </Button>
      </View>

      <View style={styles.dataContainer}>
        {data?.map((item, index) => (
          <View key={index} style={styles.dataItem}>
            <Text style={styles.dataTitle}>{item.title} :</Text>
            <Text style={styles.dataValue}>{item.value}</Text>
          </View>
        ))}

        <View style={styles.actionButtonsContainer}>
          <Button
            icon="delete"
            mode="outlined"
            textColor={Colors.text_primary}
            style={styles.deleteButton}
            onPress={onPressDelete}
          >
            Hapus
          </Button>

          <Button
            icon="content-save-edit-outline"
            mode="outlined"
            textColor={Colors.text_primary}
            style={styles.editButton}
            onPress={onPressEdit}
          >
            Edit
          </Button>
        </View>
      </View>
    </View>
  );
};

export default memo(CardIndex);

const styles = StyleSheet.create({
  cardContainer: {
    gap: moderateScale(20),
    paddingTop: moderateScale(20),
    borderBottomWidth: 1,
    paddingBottom: moderateScale(20),
    borderColor: Colors.border_primary,
  },
  header: {
    paddingHorizontal: moderateScale(15),
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 17,
  },
  buttonContainer: {
    paddingHorizontal: moderateScale(15),
  },
  addButton: {
    paddingVertical: moderateScale(5),
    backgroundColor: Colors.button_secondary,
  },
  dataContainer: {
    paddingHorizontal: moderateScale(15),
    gap: moderateScale(10),
    paddingBottom: moderateScale(5),
  },
  dataItem: {
    marginBottom: moderateScale(10),
  },
  dataTitle: {
    fontSize: 15,
  },
  dataValue: {
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: moderateScale(10),
  },
  deleteButton: {
    flex: 1,
    borderColor: Colors.text_red,
  },
  editButton: {
    flex: 1,
    borderColor: "#2279C9",
  },
});
