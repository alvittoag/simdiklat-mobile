import { View, Text, ScrollView } from "react-native";
import React from "react";
import BiodataDiri from "@/components/sections/biodata-kompetensi/BiodataDiri";
import ContainerBackground from "@/components/container/ContainerBackground";

export default function BiodataDiriScreen({ navigation }: any) {
  return (
    <ContainerBackground>
      <BiodataDiri navigation={navigation} />
    </ContainerBackground>
  );
}
