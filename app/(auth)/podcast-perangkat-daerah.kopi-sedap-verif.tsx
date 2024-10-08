import { View, Text, Linking } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { useLocalSearchParams } from "expo-router";
import { IKopiSedap } from "@/type";
import { moderateScale } from "react-native-size-matters";
import { Button, TextInput } from "react-native-paper";
import { parseHtml } from "@/lib/parseHtml";
import parseLongText from "@/lib/parseLongText";
import HTMLRenderer from "@/components/elements/HTMLRenderer";
import { Colors } from "@/constants/Colors";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { axiosService } from "@/services/axiosService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function KopiSedapVerif() {
  const queryClient = useQueryClient();

  const { item } = useLocalSearchParams();
  const [isOpen, setIsOpen] = React.useState(false);
  const [passcode, setPasscode] = React.useState("");

  const [data, setData] = React.useState<IKopiSedap>(
    JSON.parse(item as string)
  );

  React.useEffect(() => {
    if (item) {
      const parsedData = JSON.parse(item as string);
      setData(parsedData);

      setIsOpen(false);
    }
  }, [item]);

  const { mutate, isPending: isPendingMutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosService.post("/api/podcast/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: `Berhasil Melakukan Pendaftaran Sertifkat Podcast Kopi Sedap Tersebut`,
        button: "Tutup",
      });
      queryClient.invalidateQueries({
        queryKey: ["kopi-sedap-list"],
      });

      setIsOpen(false);
      setPasscode("");
      setData((prev) => ({ ...prev, isRegisterd: true }));
    },

    onError: (e) => {
      console.error(e);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Gagal Melakukan Pendaftaran Sertifkat",
        button: "Tutup",
      });
    },
  });

  const handleRegister = () => {
    if (passcode !== data.passcode) {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Peringatan",
        textBody: "Passcode Tidak Sesuai",
        button: "Tutup",
      });
    }

    const formData = new FormData();
    formData.append("jadwal_diklat_id", data.angkatan_id as any);
    formData.append("diklat_id", data.jadwal_diklat.diklat_id as any);

    mutate(formData);
  };

  return (
    <ContainerBackground>
      {data.isRegisterd && (
        <View
          style={{
            backgroundColor: "#DFEFD8",
            paddingHorizontal: 15,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border_primary,
          }}
        >
          <Text style={{ fontWeight: 400, fontSize: 15 }}>
            Success : Anda telah terdaftar di Podcast Kopi Sedap tersebut
          </Text>
        </View>
      )}

      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(20),
        }}
      >
        <View style={{ gap: 10 }}>
          <Text style={{ fontWeight: 500, fontSize: 16 }}>
            Interaktif Via Zoom Meeting
          </Text>

          <Button
            onPress={() => Linking.openURL(data.zoom_url)}
            icon={"laptop"}
            mode="contained"
            textColor="white"
            style={{
              backgroundColor: "#3FA2F6",
              borderRadius: 7,
              paddingVertical: 10,
            }}
          >
            Ikut Melalui Zoom Meeting
          </Button>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={{ fontWeight: 500, fontSize: 16 }}>
            Live Via Youtube BPKD Official
          </Text>

          <Button
            onPress={() =>
              Linking.openURL(
                `https://www.youtube.com/watch?v=${data.watch_id}`
              )
            }
            icon={"youtube"}
            mode="contained"
            textColor="white"
            style={{
              backgroundColor: "red",
              borderRadius: 7,
              paddingVertical: 10,
            }}
          >
            Ikut Melalui Youtube
          </Button>
        </View>

        <View>
          <View>
            <Text style={{ fontWeight: 500, fontSize: 16 }}>Deskripsi</Text>

            <HTMLRenderer html={data?.keterangan} />
          </View>

          {!data.isRegisterd && (
            <Button
              onPress={() => setIsOpen(true)}
              icon={"file-certificate"}
              mode="contained"
              style={{
                backgroundColor: Colors.button_primary,
                paddingVertical: 10,
                borderRadius: 7,
              }}
            >
              Daftar Sertifikat
            </Button>
          )}

          {isOpen && (
            <View style={{ marginTop: 20, gap: 20 }}>
              <TextInput
                onChangeText={(val) => setPasscode(val)}
                outlineColor={Colors.border_primary}
                activeOutlineColor={"black"}
                mode="outlined"
                label={"Masukan Passcode"}
                style={{ backgroundColor: "white", height: 55 }}
              />

              <View style={{ flexDirection: "row", gap: 25 }}>
                <Button
                  onPress={() => setIsOpen(false)}
                  icon={"close"}
                  textColor="black"
                  mode="outlined"
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: Colors.text_red,
                    paddingVertical: 7,
                  }}
                >
                  Tutup
                </Button>

                <Button
                  disabled={isPendingMutate}
                  loading={isPendingMutate}
                  onPress={handleRegister}
                  icon={"login"}
                  textColor="black"
                  mode="outlined"
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: Colors.text_green,
                    paddingVertical: 7,
                  }}
                >
                  Daftar
                </Button>
              </View>
            </View>
          )}
        </View>
      </View>
    </ContainerBackground>
  );
}
