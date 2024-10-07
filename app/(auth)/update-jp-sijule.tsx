import { View, Text, Platform, FlatList } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";

import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { Button } from "react-native-paper";
import { useQuery } from "@apollo/client";
import { IJule, IProfilePeserta } from "@/type";
import { getProfilePeserta } from "@/services/query/getProfilePeserta";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import { useQuery as useQ } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { FlashList } from "@shopify/flash-list";
import { parseDateLong } from "@/lib/parseDate";

type response = {
  status: "success" | "error";
  message: string;
  data: IJule[];
};

export default function UpdateJpSiJule() {
  const { data, loading, error } = useQuery<{
    profilPesertaDiklat: IProfilePeserta;
  }>(getProfilePeserta);

  const {
    data: dataJule,
    isPending,
    error: errorJule,
  } = useQ({
    queryKey: ["jule"],
    queryFn: async () => {
      const res = await axiosService.get<response>("/api/jp-sijule/get");
      return res.data;
    },
  });

  if (loading || isPending) return <Loading />;

  if (error || errorJule) return <Error />;

  return (
    <ContainerBackground>
      <View
        style={{
          paddingVertical: moderateScale(20),
          paddingHorizontal: moderateScale(15),
          gap: moderateScale(20),
        }}
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          data={dataJule.data}
          keyExtractor={(item) => item.id_pelatihan.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 20,
                backgroundColor: "white",
                padding: 18,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.border_primary,
                position: "relative",
              }}
            >
              <View style={{ gap: 15 }}>
                <Text style={{ fontSize: 16, fontWeight: 500 }}>
                  {item.name}
                </Text>

                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  JP : {item.jp ?? "-"}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  position: "absolute",
                  bottom: 19,
                  right: 20,
                }}
              >
                {parseDateLong(item.selesai as any)}
              </Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <View
              style={{
                backgroundColor: "white",
                marginBottom: moderateScale(20),
                paddingVertical: moderateScale(15),
                borderRadius: 10,
                gap: moderateScale(5),
                borderWidth: 1,
                borderColor: Colors.border_primary,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 19,
                  fontWeight: "bold",
                }}
              >
                Data Sijule
              </Text>
              <Text style={{ textAlign: "center", fontSize: 17 }}>
                {data?.profilPesertaDiklat.full_name} (
                {data?.profilPesertaDiklat.nrk})
              </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <Button
              icon={"content-save-outline"}
              labelStyle={{ color: "black" }}
              style={{
                backgroundColor: Colors.button_secondary,
                paddingVertical: moderateScale(8),
                flex: 1,
                borderRadius: 7,
              }}
              textColor="black"
            >
              Simpan
            </Button>
          )}
        />
      </View>
    </ContainerBackground>
  );
}
