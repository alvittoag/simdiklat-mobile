import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, RadioButton, TextInput } from "react-native-paper";
import { moderateScale } from "react-native-size-matters";

import ContainerBackground from "@/components/container/ContainerBackground";
import { Colors } from "@/constants/Colors";
import { axiosService } from "@/services/axiosService";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { IKuisonerPenyelenggarList } from "@/type";

interface MenuItem {
  label: string;
  value: string;
}

interface IKuisPenyelenggara {
  id: number;
  pertanyaan: string;
  menu: MenuItem[];
}

interface KuisResponse {
  status: string;
  message: string;
  data: IKuisPenyelenggara[];
}

interface Selection {
  pertanyaan_id: number;
  nilai: string;
  peserta_id: string;
  jadwal_diklat_id: number;
  pengajar_id: number;
  tanggal: Date;
  mata_diklat_id: number;
  jadwal_pengajar_id: number;
}

export default function KuisonerPengajarDetail() {
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<any>();

  const dataParams: IKuisonerPenyelenggarList = useMemo(() => {
    try {
      return JSON.parse(params?.data as string);
    } catch (error) {
      console.error("Error parsing params data:", error);
      return {} as IKuisonerPenyelenggarList;
    }
  }, [params?.data]);

  const [selections, setSelections] = useState<Selection[]>([]);
  const [saran, setSaran] = useState("");

  const { data, isPending, error } = useQuery<KuisResponse>({
    queryKey: ["kuisoner-pengajar", dataParams.jadwal_diklat.diklat_id],
    queryFn: async () => {
      const res = await axiosService.get<KuisResponse>(
        `/api/kuisoner/pengajar/lembar/${dataParams.jadwal_diklat.diklat_id}`
      );
      return res.data;
    },
  });

  const mutationAdd = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosService.post("/api/kuisoner/pengajar/post", {
        data: data,
      });
      return res.data;
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Kuisoner Pengajar Berhasil Ditambahkan",
        button: "Tutup",
      });

      setSelections([]);
      setSaran("");

      queryClient.invalidateQueries({
        queryKey: ["getKuisonerPengajar"],
      });

      router.back();
    },
    onError: (err) => {
      console.log(err);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Kuisoner Pengajar Gagal Ditambahkan",
        button: "Tutup",
      });
    },
  });

  const handleRadioSelect = (questionId: number, value: string) => {
    setSelections((prev) => {
      const newSelection: Selection = {
        pertanyaan_id: questionId,
        nilai: value,
        peserta_id: params?.peserta_id,
        jadwal_diklat_id: dataParams.jadwal_diklat.id,
        pengajar_id: dataParams.pengajar_id,
        tanggal: dataParams.tanggal,
        mata_diklat_id: dataParams.materi_id,
        jadwal_pengajar_id: dataParams.id,
      };

      const existingIndex = prev.findIndex(
        (s) => s.pertanyaan_id === questionId
      );
      if (existingIndex !== -1) {
        // Replace existing selection
        return prev.map((s) =>
          s.pertanyaan_id === questionId ? newSelection : s
        );
      } else {
        // Add new selection
        return [...prev, newSelection];
      }
    });
  };

  const handleSumbit = () => {
    if (selections.length !== data?.data.length) {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Perhatian",
        textBody: "Kuisoner Pengajar Harus Diisi Semua",
        button: "Tutup",
      });
    }
    const mergedData = selections.map((s) => ({
      ...s,
      saran: saran === "" ? " " : saran,
    }));

    console.log(mergedData);

    mutationAdd.mutate(mergedData);
  };

  const getSelectionForQuestion = (questionId: number) => {
    return selections.find((s) => s.pertanyaan_id === questionId)?.nilai || "";
  };

  if (isPending) return <Loading />;
  if (error) return <Error />;

  const renderItem = ({
    item,
    index,
  }: ListRenderItemInfo<IKuisPenyelenggara>) => (
    <View style={{ gap: 2, marginBottom: 30 }}>
      <View style={{ gap: 10, flex: 1 }}>
        <Text
          style={{
            fontWeight: "bold",
            color: Colors.text_primary,
            fontSize: 15,
          }}
        >
          {index + 1}. {item.pertanyaan}
        </Text>

        <View style={{ gap: 15 }}>
          {item.menu.map((menu) => (
            <View
              key={menu.value}
              style={{
                backgroundColor: Colors.border_primary,
                paddingVertical: 13,
                paddingHorizontal: 10,
                borderRadius: 7,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                {menu.label}
              </Text>

              <RadioButton.Android
                value={menu.value}
                status={
                  getSelectionForQuestion(item.id) === menu.value
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => handleRadioSelect(item.id, menu.value)}
                color={Colors.text_primary}
                uncheckedColor={Colors.text_primary}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <ContainerBackground>
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(20),
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            scrollEnabled={false}
            ListHeaderComponent={() => (
              <View
                style={{
                  backgroundColor: Colors.button_primary,
                  padding: moderateScale(15),
                  borderRadius: 8,
                  elevation: 3,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    color: Colors.text_white,
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  {dataParams.mata_diklat?.name} Angkatan{" "}
                  {dataParams.jadwal_diklat?.name}
                </Text>
              </View>
            )}
            data={data?.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />

          <View style={{ gap: 10 }}>
            <TextInput
              value={saran}
              onChangeText={(e) => setSaran(e)}
              placeholder="Isi Saran Untuk Pengajar"
              placeholderTextColor={Colors.text_secondary}
              multiline
              mode="outlined"
              textColor="black"
              style={{
                backgroundColor: Colors.white,
                borderColor: Colors.border_primary,
                borderRadius: 7,
                minHeight: 100,
                paddingVertical: 10,
              }}
            />

            <Button
              loading={mutationAdd.isPending}
              disabled={mutationAdd.isPending}
              icon={"send"}
              mode="contained"
              labelStyle={{ color: "black" }}
              style={{
                borderRadius: 7,
                backgroundColor: Colors.button_secondary,
                paddingVertical: 7,
                paddingHorizontal: 15,
              }}
              onPress={handleSumbit}
            >
              Kirim
            </Button>
          </View>
        </ScrollView>
      </View>
    </ContainerBackground>
  );
}
