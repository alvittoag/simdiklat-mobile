import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  Platform,
  Alert,
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
import { gql, useLazyQuery, useQuery } from "@apollo/client";
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
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import { parseDateLong } from "@/lib/parseDate";
export default function KalenderDiklat() {
  const [search, setSearch] = React.useState("");
  const [yearFilter, setYearFilter] = React.useState("2024");
  const [filter, setfilter] = React.useState("DESC");
  const [searchBy, setSearchBy] = React.useState("");

  const [terapkan, setTerapkan] = React.useState<any>({
    tahun: Number(yearFilter),
    sortDirection: filter,
    qb: "",
  });
  const [showFilter, setShowFilter] = React.useState(false);
  const [showSort, setShowSort] = React.useState(false);
  const [diklatSaved, setDiklatSaved] = React.useState("");

  const debouncedSearch = useDebounce(search, 1000);

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const [searchValue, setSearchValue] = React.useState(debouncedSearch);

  React.useEffect(() => {
    const lowerCaseSearch = debouncedSearch.toLowerCase();
    if (lowerCaseSearch === "buka") {
      setSearchValue("open");
    } else if (lowerCaseSearch === "tutup") {
      setSearchValue("close");
    } else {
      setSearchValue(lowerCaseSearch);
    }
  }, [debouncedSearch]);

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
      q: searchValue,
      sortBy: "kd.created_at",
      ...terapkan,
    },
  });

  const [getAllKalender, { loading: loadingALlDiklat }] = useLazyQuery<{
    kalenderDiklats: {
      items: IKalenderDiklatList[];
      total: number;
      hasMore: boolean;
    };
  }>(getKalenderDiklatList);

  const totalPage = data ? Math.ceil(data?.kalenderDiklats.total / limit) : 1;

  const handleSearchChange = React.useCallback((text: string) => {
    setSearch(text);
  }, []);

  const hideShowFilter = () => {
    setTerapkan((prev: any) => ({
      ...prev,
      qb: searchBy,
    }));
    setSearch("");
    setPage(1);
    setShowFilter(false);
  };

  const hideShowSort = () => {
    setTerapkan((prev: any) => ({
      ...prev,
      tahun: Number(yearFilter),
      sortDirection: filter,
    }));
    setSearch("");
    setPage(1);
    setShowSort(false);
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
        textBody: `Berhasil Mendaftar ${diklatSaved}`,
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

  const registerDiklat = (id: number, diklat: string) => {
    mutationRegister.mutate(id);
    setDiklatSaved(diklat);
  };

  const saveFile = async (fileUri: string, fileName: string) => {
    try {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
            DNote.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Berhasil",
              textBody: "Berhasil Menyimpan File Excel",
              button: "Tutup",
            });
          })
          .catch((e) => {
            console.error(e);
          });
      } else {
        Alert.alert(
          "Permission needed",
          "Please grant permission to save the file"
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportToExcel = async (items: IKalenderDiklatList[]) => {
    // Tambahkan baris kosong di awal untuk membuat "header" terlihat berbeda
    const d = [
      {
        "Nama Diklat": "NAMA DIKLAT",
        "Jadwal Pelaksanaan": "JADWAL PELAKSANAAN",
        "Lokasi Diklat": "LOKASI DIKLAT",
        Status: "STATUS",
      },
      {}, // Baris kosong untuk memisahkan header
      ...items.map((item) => ({
        "Nama Diklat": item.diklat.name,
        "Jadwal Pelaksanaan": item.waktu_pelaksanaan,
        "Lokasi Diklat": item.lokasi_diklat.name,
        Status: item.status_registrasi === "open" ? "Buka" : "Tutup",
      })),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(d as any, { skipHeader: true });

    // Mengatur lebar kolom
    const colWidths = [
      { wch: 55 }, // Nama Diklat
      { wch: 40 }, // Jadwal Pelaksanaan
      { wch: 50 }, // Lokasi Diklat
      { wch: 20 }, // Status
    ];

    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Kalender Diklat");

    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    const fileName = `Kalender Diklat_${Date.now()}.xlsx`;
    const fileUri = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      saveFile(fileUri, fileName);

      setSearch("");
      setPage(1);
      setShowFilter(false);

      // Check if sharing is available and share the file
    } catch (error) {
      DNote.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Gagal Menyimpan File Excel",
        button: "Tutup",
      });

      console.error(error);
    }
  };

  if (error) {
    return <Error />;
  }

  return (
    <ContainerBackground>
      <SearchBar
        handleSearchChange={handleSearchChange}
        showDialog={() => setShowFilter(true)}
        showSortDialog={() => setShowSort(true)}
        search={search}
        showFilter
        showSort
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
                borderWidth: Platform.OS === "android" ? 0 : 0.5,
                borderColor: Colors.border_primary,
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
                    {item.status_registrasi === "open" ? "Buka" : "Tutup"}
                  </Text>
                </View>

                <View style={{ gap: 5 }}>
                  <Text style={{ fontSize: 16 }}>Persayaratan</Text>

                  <View>
                    {item.persyaratan === " " ? (
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
                        onPress={() =>
                          registerDiklat(item.id, item.diklat.name)
                        }
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
        {showFilter && (
          <Dialog
            visible={showFilter}
            onDismiss={hideShowFilter}
            style={{ backgroundColor: "white" }}
          >
            <Dialog.Title style={{ color: Colors.text_primary }}>
              Filter Berdasarkan
            </Dialog.Title>

            <Dialog.Content>
              <RadioButton.Group
                onValueChange={(newValue) => setSearchBy(newValue)}
                value={searchBy}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    status={
                      searchBy === "kd.status_registrasi"
                        ? "checked"
                        : "unchecked"
                    }
                    value="kd.status_registrasi"
                    color={Colors.border_input_active}
                    uncheckedColor="black"
                  />
                  <Text>Status</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    status={searchBy === "d.name" ? "checked" : "unchecked"}
                    value="d.name"
                    color={Colors.border_input_active}
                    uncheckedColor="black"
                  />
                  <Text>Jenis Diklat</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    status={
                      searchBy === "kd.waktu_pelaksanaan"
                        ? "checked"
                        : "unchecked"
                    }
                    value="kd.waktu_pelaksanaan"
                    color={Colors.border_input_active}
                    uncheckedColor="black"
                  />
                  <Text>Jadwal Pelaksanaan</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value="ld.name"
                    status={searchBy === "ld.name" ? "checked" : "unchecked"}
                    color={Colors.border_input_active}
                    uncheckedColor="black"
                  />
                  <Text>Lokasi Diklat</Text>
                </View>
              </RadioButton.Group>

              <Button
                disabled={loadingALlDiklat}
                loading={loadingALlDiklat}
                onPress={() =>
                  getAllKalender({
                    variables: {
                      limit: 999999,
                      page: 1,
                      sortBy: "kd.created_at",
                      sortDirection: "DESC",
                    },
                  }).then((res) => {
                    exportToExcel(res.data?.kalenderDiklats.items as any);
                  })
                }
                icon={"download"}
                mode="contained"
                textColor="white"
                labelStyle={{ color: "white" }}
                style={{
                  backgroundColor: Colors.button_primary,
                  marginTop: 15,
                  marginBottom: -10,
                }}
              >
                Download Excel
              </Button>
            </Dialog.Content>

            <Dialog.Actions>
              <Button
                onPress={hideShowFilter}
                mode="contained"
                textColor="black"
                style={{
                  backgroundColor: Colors.button_secondary,
                  flexGrow: 1,
                }}
              >
                Terapkan
              </Button>
            </Dialog.Actions>
          </Dialog>
        )}

        {showSort && (
          <Dialog
            visible={showSort}
            onDismiss={hideShowSort}
            style={{ backgroundColor: "white" }}
          >
            <Dialog.Title style={{ color: Colors.text_primary }}>
              Urutkan Berdasarkan
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
                onPress={hideShowSort}
                mode="contained"
                textColor="black"
                style={{
                  backgroundColor: Colors.button_secondary,
                  flexGrow: 1,
                }}
              >
                Terapkan
              </Button>
            </Dialog.Actions>
          </Dialog>
        )}
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
