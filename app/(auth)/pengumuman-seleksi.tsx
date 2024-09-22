import { View, Text, Linking } from "react-native";
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
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { IPengumuman } from "@/type";

type response = {
  status: string;
  message: string;
  data: {
    data: IPengumuman[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export default function PengumumanSeleksi() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { data, isPending, isError } = useQuery<response>({
    queryKey: ["seleksiWidyaiswaras", page, limit],
    queryFn: async () => {
      const { data } = await axiosService.get(
        `/api/pengumuman/get?page=${page}&limit=${limit}`
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
                {item.seleksi_widyaiswara.tahun}
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
                {item.seleksi_widyaiswara.title}
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
                {parseDateLong(item.seleksi_widyaiswara.registrasi_mulai)} s/d{" "}
                {parseDateLong(item.seleksi_widyaiswara.registrasi_selesai)}
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
                    item.seleksi_widyaiswara.status_registrasi === "open"
                      ? Colors.text_green
                      : Colors.text_red,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                {item.seleksi_widyaiswara.status_registrasi === "open"
                  ? "Dibuka"
                  : "Ditutup"}
              </Text>
            </View>

            <View style={{ gap: moderateScale(8) }}>
              <ButtonOpacity
                onPress={() =>
                  router.push({
                    pathname: `/pengumuman-seleksi.detail`,
                    params: { item: JSON.stringify(item.seleksi_widyaiswara) },
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

              {item.lampiran && (
                <>
                  <ButtonOpacity
                    onPress={() =>
                      Linking.openURL(
                        `https://simdiklat-bpsdm.jakarta.go.id/sim-diklat/widyaiswara/cetak-kartu/${item.user_id}/${item.seleksi_id}`
                      )
                    }
                    icon={assets.cetak}
                    bgcolor={Colors.button_primary}
                    textcolor="white"
                    textsize={15}
                    vertical={18}
                    textweight="600"
                  >
                    Cetak Kartu Peserta
                  </ButtonOpacity>

                  <ButtonOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/pengumuman-seleksi.lampiran",
                        params: { item: JSON.stringify(item) },
                      })
                    }
                    icon={assets.download}
                    bgcolor={Colors.button_primary}
                    textcolor="white"
                    textsize={15}
                    vertical={18}
                    textweight="600"
                  >
                    Download Lampiran
                  </ButtonOpacity>
                </>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={ListFooter}
      />
    </ContainerBackground>
  );
}
