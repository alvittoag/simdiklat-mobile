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
import { IKalenderDiklatList, IKalenderPublic } from "@/type";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog as DNote } from "react-native-alert-notification";
import AppHeader from "@/components/AppHeader";

type response = {
  status: string;
  message: string;
  data: {
    data: IKalenderPublic[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export default function KalenderDiklatPublic() {
  const [search, setsearch] = React.useState("");
  const [yearFilter, setYearFilter] = React.useState("2024");
  const [filter, setfilter] = React.useState("DESC");
  const [terapkan, setTerapkan] = React.useState<any>({
    sortDirection: filter,
  });
  const debouncedSearch = useDebounce(search, 1000);

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["getKalenderDiklatList", page, limit, debouncedSearch, terapkan],
    queryFn: async () => {
      const res = await axiosService.get<response>(
        `/api/diklat/kalender?page=${page}&limit=${limit}&order=${terapkan.sortDirection}&search=${debouncedSearch}`
      );
      return res.data;
    },
  });

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setTerapkan((prev: any) => ({
      ...prev,
      tahun: Number(yearFilter),
      sortDirection: filter,
    }));
    setsearch("");
    setPage(1);
    setVisible(false);
  };

  const handleSearchChange = React.useCallback((text: string) => {
    setsearch(text);
  }, []);

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

  return (
    <ContainerBackground>
      <AppHeader title="Kalender Diklat" />

      <SearchBar
        handleSearchChange={handleSearchChange}
        search={search}
        showDialog={showDialog}
        showFilter
      />
      {isPending ? (
        <Loading />
      ) : data?.data.data.length === 0 ? (
        <NotFoundSearch />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => refetch()} />
          }
          keyExtractor={(item) => item.id.toString()}
          data={data?.data.data}
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
                  <Text style={{ fontSize: 16 }}>Status</Text>
                  <Text
                    style={{
                      color:
                        item.status_registrasi === "open" ? "green" : "red",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {item.status_registrasi === "open" ? "Buka" : "Tutup"}
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
                <View style={{ flexDirection: "row", gap: 20 }}>
                  <Button
                    icon={"eye"}
                    onPress={() =>
                      router.navigate({
                        params: { data: JSON.stringify(item) },
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

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{ backgroundColor: "white" }}
        >
          <Dialog.Title style={{ color: Colors.text_primary }}>
            Filter Berdasarkan
          </Dialog.Title>

          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(newValue) => setfilter(newValue)}
              value={filter}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  status={filter === "DESC" ? "checked" : "unchecked"}
                  value="DESC"
                  color={Colors.border_input_active}
                  uncheckedColor="black"
                />
                <Text>Data Paling Terbaru</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="ASC"
                  status={filter === "ASC" ? "checked" : "unchecked"}
                  color={Colors.border_input_active}
                  uncheckedColor="black"
                />
                <Text>Data Terlama</Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              onPress={hideDialog}
              mode="contained"
              textColor="black"
              style={{ backgroundColor: Colors.button_secondary, flexGrow: 1 }}
            >
              Terapkan
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
