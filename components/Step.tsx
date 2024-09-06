import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const Step = ({ value, increment, decrement }) => {
  return (
    <View style={styles.container}>
      <Button title="-" onPress={decrement} />
      <Text style={styles.value}>{value}</Text>
      <Button title="+" onPress={increment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    marginHorizontal: 20,
    fontSize: 20,
  },
});

export default Step;
