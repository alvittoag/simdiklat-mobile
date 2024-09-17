import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import {
  Button,
  Chip,
  Dialog,
  Divider,
  Portal,
  RadioButton,
  Searchbar,
} from "react-native-paper";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { gql, useQuery } from "@apollo/client";
import { IKalenderDiklatList } from "@/type";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import ChipKalenderDiklat from "@/components/elements/ChipKalenderDiklat";
import useDebounce from "@/hooks/useDebounce";

import { Dropdown } from "react-native-element-dropdown";
import Pagination from "@/components/sections/pagination";
import SearchBar from "@/components/sections/SearchBar";
import { FlashList } from "@shopify/flash-list";
import { getKalenderDiklatList } from "@/services/query/get-kalender";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import parseLongText from "@/lib/parseLongText";
import { useMutation } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog as DNote } from "react-native-alert-notification";
import AppHeader from "@/components/AppHeader";

export default function KalenderDiklatPublic() {
  const [yearFilter, setYearFilter] = React.useState("2024");
  const [terapkan, setTerapkan] = React.useState<{ year: string | null }>({
    year: null,
  });

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { loading, error, data, refetch } = useQuery<{
    kalenderDiklats: {
      items: IKalenderDiklatList[];
      total: number;
      hasMore: boolean;
    };
  }>(getKalenderDiklatList, {
    variables: {
      tahun: Number(terapkan.year ?? 2024),
      page: page,
      limit: limit,
    },
  });

  const totalPage = data ? Math.ceil(data?.kalenderDiklats.total / limit) : 1;

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

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

  const mutationRegister = useMutation({
    mutationFn: async (id: number) => {
      return await axiosService.post("/api/diklat/registrasi", {
        kalender_id: id,
      });
    },
    onSuccess: () => {
      refetch();
      DNote.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Berhasil Registrasi Diklat",
        button: "Tutup",
      });
    },
    onError: (error) => {
      console.error("Error Register Diklat:", error);
      DNote.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Gagal Registrasi Diklat",
        button: "Tutup",
      });
    },
  });

  const registerDiklat = (id: number) => {
    mutationRegister.mutate(id);
  };

  if (error) {
    return <Error />;
  }

  return (
    <ContainerBackground>
      <AppHeader title="Kalender Diklat" />
      {loading ? (
        <Loading />
      ) : data?.kalenderDiklats.items.length === 0 ? (
        <NotFoundSearch />
      ) : (
        <FlashList
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => refetch()} />
          }
          keyExtractor={(item) => item.id.toString()}
          data={data?.kalenderDiklats.items}
          estimatedItemSize={10}
          renderItem={({ item, index }) => (
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                elevation: 3,
                borderRadius: 10,
                gap: 15,
                marginHorizontal: moderateScale(15),
                marginTop: index === 0 ? moderateScale(20) : 0,
                marginBottom: moderateScale(25),
              }}
            >
              <View style={{ gap: 15 }}>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {item.diklat?.name}
                </Text>
                <Divider />
              </View>

              <View style={{ gap: 20 }}>
                <View style={{ gap: 5 }}>
                  <Text style={{ fontSize: 16 }}>Jadwal Pelaksanaan</Text>
                  <Text
                    style={{
                      color: Colors.text_primary,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {item?.waktu_pelaksanaan}
                  </Text>
                </View>

                <View style={{ gap: 5 }}>
                  <Text style={{ fontSize: 16 }}>Lokasi Diklat</Text>
                  <Text
                    style={{
                      color: Colors.text_primary,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {item.lokasi_diklat?.name}
                  </Text>
                </View>

                <View style={{ gap: 5 }}>
                  <Text style={{ fontSize: 16 }}>Persayaratan</Text>

                  <View>
                    {item?.persyaratan === " " ? (
                      <Text>-</Text>
                    ) : (
                      parseLongText({
                        data: item?.persyaratan,
                        fontSize: 15,
                        fontWeight: 700,
                      })
                    )}
                  </View>
                </View>
              </View>

              <View style={{ gap: 8 }}>
                <ChipKalenderDiklat aproval={item?.approval} />

                <View style={{ flexDirection: "row", gap: 20 }}>
                  <Button
                    onPress={() =>
                      router.navigate({
                        params: { id: item.id },
                        pathname: `/kalender-diklat-public-detail`,
                      })
                    }
                    textColor="black"
                    style={{
                      backgroundColor: Colors.button_secondary,
                      paddingVertical: 6,
                      flex: 1,
                      borderRadius: 7,
                    }}
                  >
                    Tampilkan
                  </Button>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={ListFooter}
        />
      )}
    </ContainerBackground>
  );
}

export const dataYear = [
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
  { label: "2021", value: "2021" },
  { label: "2020", value: "2020" },
  { label: "2019", value: "2019" },
  { label: "2018", value: "2018" },
  { label: "2017", value: "2017" },
  { label: "2016", value: "2016" },
];
