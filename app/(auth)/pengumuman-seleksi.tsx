import { View, Text } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import ButtonOpacity from "@/components/elements/ButtonOpacity";
import assets from "@/assets";
import { Colors } from "@/constants/Colors";
import { moderateScale } from "react-native-size-matters";
import { useQuery } from "@apollo/client";
import { getPengumuman } from "@/services/query/get-pengumuman";
import { IPengumuman } from "@/type";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import { FlashList } from "@shopify/flash-list";
import Pagination from "@/components/sections/pagination";
import { parseDateLong } from "@/lib/parseDate";
import { router } from "expo-router";

export default function PengumumanSeleksi() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const { data, loading, error } = useQuery<{
    seleksiWidyaiswaras: {
      items: IPengumuman[];
      total: number;
      hasMore: boolean;
    };
  }>(getPengumuman, {
    variables: {
      page: page,
      limit: limit,
    },
  });

  const totalPage = data
    ? Math.ceil(data?.seleksiWidyaiswaras.total / limit)
    : 1;

  const ListFooter = React.useMemo(
    () => (
      <Pagination
        loading={loading}
        page={page}
        setPage={setPage}
        totalPage={totalPage}
      />
    ),
    [loading, page, setPage, totalPage]
  );

  if (error) {
    return <Error />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <ContainerBackground>
      <FlashList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={10}
        data={data?.seleksiWidyaiswaras.items}
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
                  color: item.isOpen ? Colors.text_green : Colors.text_red,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                {item.isOpen ? "Dibuka" : "Ditutup"}
              </Text>
            </View>

            <View style={{ gap: moderateScale(8) }}>
              <ButtonOpacity
                onPress={() =>
                  router.push({
                    pathname: `/pengumuman-seleksi.detail`,
                    params: { id: item.id },
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

              {item.isOpen && (
                <>
                  <ButtonOpacity
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
