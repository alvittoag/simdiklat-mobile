import { View, Text, useWindowDimensions, LogBox } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import HTMLRenderer from "@/components/elements/HTMLRenderer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { useApolloClient } from "@apollo/client";
import { getKotakMasuk } from "@/services/query/get-kotak-masuk";

export default function KotakMasukPesan() {
  const queryClient = useQueryClient();
  const client = useApolloClient();
  const { id, dari, pesan, subjek, read } = useLocalSearchParams();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (id: number) => {
      await axiosService.put("/api/message/read", {
        message_id: id,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["count-notif"] });
      await client.reFetchObservableQueries();
    },

    onError: () => {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Terjadi kesalahan, silahkan coba kembali",
        button: "Tutup",
      });
    },
  });

  React.useEffect(() => {
    if (read === "0") {
      mutate(id as any);
    }
  }, [id]);

  return (
    <ContainerBackground>
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(20),
        }}
      >
        <View style={{ gap: moderateScale(5) }}>
          <Text style={{ fontWeight: 400, fontSize: 16 }}>Dari</Text>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>{dari}</Text>
        </View>

        <View style={{ gap: moderateScale(5) }}>
          <Text style={{ fontWeight: 400, fontSize: 16 }}>Subjek</Text>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>{subjek}</Text>
        </View>

        <View>
          <Text style={{ fontWeight: 400, fontSize: 16 }}>Isi Pesan</Text>

          <HTMLRenderer html={pesan as string} fontWeight="500" />
        </View>
      </View>
    </ContainerBackground>
  );
}
