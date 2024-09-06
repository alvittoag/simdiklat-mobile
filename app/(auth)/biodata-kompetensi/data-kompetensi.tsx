import { ScrollView, View } from "react-native";
import React from "react";
import DataKompetensi from "@/components/sections/biodata-kompetensi/DataKompetensi";
import ContainerBackground from "@/components/container/ContainerBackground";

export default function DataKompetensiScreen() {
  return (
    <ContainerBackground>
      <DataKompetensi />
    </ContainerBackground>
  );
}
