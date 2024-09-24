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

export default function KalenderDiklat() {
  const [search, setSearch] = React.useState("");
  const [yearFilter, setYearFilter] = React.useState("2024");
  const [filter, setfilter] = React.useState("DESC");
  const [terapkan, setTerapkan] = React.useState<any>({
    tahun: Number(yearFilter),
    sortDirection: filter,
  });

  const debouncedSearch = useDebounce(search, 1000);

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
      page: page,
      limit: limit,
      q: debouncedSearch,
      sortBy: "kd.registrasi_mulai",
      ...terapkan,
    },
  });

  const totalPage = data ? Math.ceil(data?.kalenderDiklats.total / limit) : 1;

  const handleSearchChange = React.useCallback((text: string) => {
    setSearch(text);
  }, []);

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setTerapkan((prev: any) => ({
      ...prev,
      tahun: Number(yearFilter),
      sortDirection: filter,
    }));
    setSearch("");
    setPage(1);
    setVisible(false);
  };

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
      <SearchBar
        handleSearchChange={handleSearchChange}
        showDialog={showDialog}
        search={search}
        showFilter
      />

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
                  <Text style={{ fontSize: 16 }}>Status</Text>
                  <Text
                    style={{
                      color:
                        item.status_registrasi === "open"
                          ? Colors.text_green
                          : Colors.text_red,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {item.status_registrasi === "open" ? "Dibuka" : "Ditutup"}
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
                    icon={"eye"}
                    onPress={() =>
                      router.navigate({
                        params: { id: item.id },
                        pathname: `/kalender-diklat.detail`,
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
                  {item.approval === null &&
                    item.status_registrasi === "open" && (
                      <Button
                        onPress={() => registerDiklat(item.id)}
                        mode="contained"
                        icon={"account"}
                        textColor="white"
                        style={{
                          backgroundColor: Colors.button_primary,
                          paddingVertical: 6,
                          flex: 1,
                          borderRadius: 7,
                        }}
                      >
                        Daftar
                      </Button>
                    )}
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

            <Dropdown
              value={yearFilter}
              onChange={({ value }) => setYearFilter(value)}
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderRadius: 7,
                borderColor: Colors.border_primary,
                paddingVertical: 10,
                paddingHorizontal: 15,
                marginTop: 10,
              }}
              placeholder="Pilih Tahun"
              labelField="label"
              valueField="value"
              data={dataYear}
            />
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
