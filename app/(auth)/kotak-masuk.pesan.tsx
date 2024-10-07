import {
  View,
  Text,
  useWindowDimensions,
  LogBox,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import HTMLRenderer from "@/components/elements/HTMLRenderer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { useApolloClient } from "@apollo/client";
import { getKotakMasuk } from "@/services/query/get-kotak-masuk";
import { Button } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import Loading from "@/components/elements/Loading";

export default function KotakMasukPesan() {
  const queryClient = useQueryClient();
  const client = useApolloClient();
  const { id, user_id, dari, pesan, subjek, read } = useLocalSearchParams();

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

  if (isPending) return <Loading />;

  return (
    <ContainerBackground>
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(20),
        }}
      >
        <View style={{ flexDirection: "row", gap: moderateScale(10) }}>
          <Button
            onPress={() =>
              router.push({
                pathname: "/kotak-masuk.create",
                params: {
                  user: dari,
                  user_id: user_id,
                },
              })
            }
            icon={"reply"}
            textColor="white"
            mode="contained"
            style={{
              backgroundColor: Colors.button_primary,
              paddingVertical: 7,
              borderRadius: 7,
              flex: 1,
            }}
          >
            Balas
          </Button>

          <Button
            onPress={() =>
              router.push({
                pathname: "/kotak-masuk.create",
                params: { subject: subjek, message: pesan },
              })
            }
            icon={"share"}
            textColor="black"
            mode="contained"
            style={{
              backgroundColor: Colors.button_secondary,
              paddingVertical: 7,
              borderRadius: 7,
              flex: 1,
            }}
          >
            Teruskan
          </Button>
        </View>
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
