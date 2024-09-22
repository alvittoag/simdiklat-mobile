import { View, Text } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import ButtonOpacity from "@/components/elements/ButtonOpacity";
import assets from "@/assets";
import { Colors } from "@/constants/Colors";
import { moderateScale } from "react-native-size-matters";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import { FlashList } from "@shopify/flash-list";
import Pagination from "@/components/sections/pagination";
import { parseDateLong } from "@/lib/parseDate";
import AppHeader from "@/components/AppHeader";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { IPengumumanPublic } from "@/type";

type response = {
  status: string;
  message: string;
  data: {
    data: IPengumumanPublic[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export default function Pengumuman() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { data, isPending, isError } = useQuery({
    queryKey: ["pengumuman", page, limit],
    queryFn: async () => {
      const { data } = await axiosService.get<response>(
        `/api/pengumuman/public?page=${page}&limit=${limit}`
      );
      return data;
    },
  });

  const ListFooter = React.useMemo(
    () => (
      <Pagination
        loading={isPending}
        page={page}
        setPage={setPage}
        totalPage={data?.data.meta.totalPages as number}
      />
    ),
    [isPending, page, setPage]
  );

  if (isError) {
    return <Error />;
  }

  if (isPending) {
    return <Loading />;
  }

  return (
    <ContainerBackground>
      <AppHeader title="Pengumuman Seleksi" />
      <FlashList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={10}
        data={data.data.data}
        renderItem={({ item }) => (
          <View
            style={{
              paddingHorizontal: moderateScale(15),
              paddingVertical: moderateScale(30),
              gap: moderateScale(15),
              borderBottomColor: "#000000",
              borderBottomWidth: 0.5,
            }}
          >
            <View style={{ gap: moderateScale(2) }}>
              <Text
                style={{
                  color: Colors.text_secondary,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                Tahun
              </Text>
              <Text
                style={{
                  color: Colors.text_primary,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                {item.tahun}
              </Text>
            </View>

            <View style={{ gap: moderateScale(2) }}>
              <Text
                style={{
                  color: Colors.text_secondary,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                Judul Seleksi
              </Text>

              <Text
                style={{
                  color: Colors.text_primary,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                {item.title}
              </Text>
            </View>

            <View style={{ gap: moderateScale(2) }}>
              <Text
                style={{
                  color: Colors.text_secondary,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                Jadwal Registrasi
              </Text>

              <Text
                style={{
                  color: Colors.text_primary,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                {parseDateLong(item.registrasi_mulai)} s/d{" "}
                {parseDateLong(item.registrasi_selesai)}
              </Text>
            </View>

            <View style={{ gap: moderateScale(1) }}>
              <Text
                style={{
                  color: Colors.text_secondary,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                Status
              </Text>

              <Text
                style={{
                  color:
                    item.status_registrasi === "open"
                      ? Colors.text_green
                      : Colors.text_red,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                {item.status_registrasi === "open" ? "Dibuka" : "Ditutup"}
              </Text>
            </View>

            <View style={{ gap: moderateScale(8) }}>
              <ButtonOpacity
                onPress={() =>
                  router.push({
                    pathname: "/pengumuman-detail",
                    params: { item: JSON.stringify(item) },
                  })
                }
                icon={assets.folder_plus}
                bgcolor={Colors.button_secondary}
                textcolor="black"
                textsize={15}
                vertical={18}
                textweight="600"
              >
                Tampilkan
              </ButtonOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={ListFooter}
      />
    </ContainerBackground>
  );
}
