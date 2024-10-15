import { View, Text, RefreshControl, Linking, Alert } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import {
  Button,
  Dialog,
  Portal,
  RadioButton,
  Searchbar,
} from "react-native-paper";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import ContainerCard from "@/components/container/ContainerCard";
import { useLazyQuery, useQuery } from "@apollo/client";
import { getDiklat } from "@/services/query/get-diklat";
import { ISedangDiikuti } from "@/type";
import useDebounce from "@/hooks/useDebounce";
import SearchBar from "@/components/sections/SearchBar";
import Pagination from "@/components/sections/pagination";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { parseDateLong } from "@/lib/parseDate";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import { ALERT_TYPE, Dialog as D } from "react-native-alert-notification";

export default function DiklatSudahDiikuti() {
  const [search, setSearch] = React.useState("");
  const [searchBy, setSearchBy] = React.useState("");
  const [filter, setfilter] = React.useState("DESC");
  const [terapkan, setTerapkan] = React.useState<any>({
    sortDirection: filter,
    searchBy: "",
  });

  const [showFilter, setShowFilter] = React.useState(false);
  const [showSort, setShowSort] = React.useState(false);

  const debouncedSearch = useDebounce(search, 1000);

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { data, error, loading, refetch } = useQuery<{
    pesertaDiklats: {
      items: ISedangDiikuti[];
      total: number;
      hasMore: boolean;
    };
  }>(getDiklat, {
    variables: {
      page: page,
      limit: limit,
      q: debouncedSearch.toLocaleLowerCase(),
      tipe: "history",
      sortBy: "a.jadwal_mulai",
      ...terapkan,
    },
  });

  const [getAllDiklat, { loading: loadingALlDiklat }] = useLazyQuery<{
    pesertaDiklats: {
      items: ISedangDiikuti[];
      total: number;
      hasMore: boolean;
    };
  }>(getDiklat);

  const totalPage = data ? Math.ceil(data?.pesertaDiklats.total / limit) : 1;

  const handleSearchChange = React.useCallback((text: string) => {
    setSearch(text);
  }, []);

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

  const hideShowFilter = () => {
    setTerapkan((prev: any) => ({
      ...prev,
      searchBy: searchBy,
    }));
    setSearch("");
    setPage(1);
    setShowFilter(false);
  };

  const hideShowSort = () => {
    setTerapkan((prev: any) => ({
      ...prev,
      sortDirection: filter,
    }));
    setSearch("");
    setPage(1);
    setShowSort(false);
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
            D.show({
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

  const exportToExcel = async (items: ISedangDiikuti[]) => {
    // Tambahkan baris kosong di awal untuk membuat "header" terlihat berbeda
    const d = [
      {
        "Jenis Diklat": "JENIS DIKLAT",
        "Nama Diklat": "NAMA DIKLAT",
        Angkatan: "ANGKATAN",
        "Jadwal Pelaksanaan": "JADWAL PELAKSANAAN",
        Lokasi: "LOKASI",
        "Link Sertifikat": "LINK SERTIFIKAT",
      },
      {}, // Baris kosong untuk memisahkan header
      ...items.map((item) => ({
        "Jenis Diklat": item.jadwal_diklat.diklat.jenis_diklat.name,
        "Nama Diklat": item.jadwal_diklat.diklat.name,
        Angkatan: item.jadwal_diklat.name,
        "Jadwal Pelaksanaan": `${parseDateLong(
          item.jadwal_diklat.jadwal_mulai
        )} - ${parseDateLong(item.jadwal_diklat.jadwal_selesai)}`,
        Lokasi: item.jadwal_diklat.lokasi_diklat.name,
        "Link Sertifikat":
          item.sertifikat_signed === 0
            ? "-"
            : `https://simdiklat-bpsdm.jakarta.go.id/sim-diklat/sertifikat/peserta-download-tte/${item.id}`,
      })),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(d as any, { skipHeader: true });

    // Mengatur lebar kolom
    const colWidths = [
      { wch: 40 }, // Jenis Diklat
      { wch: 55 }, // Nama Diklat
      { wch: 10 }, // Angkatan
      { wch: 40 }, // Jadwal Pelaksanaan
      { wch: 50 }, // Lokasi
      { wch: 70 }, // Link Sertifikat
    ];

    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Diklat Sudah Diikuti");

    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    const fileName = `Diklat Sudah Diikuti_${Date.now()}.xlsx`;
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
      D.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Gagal Menyimpan File Excel",
        button: "Tutup",
      });

      console.error(error);
    }
  };

  return (
    <ContainerBackground>
      <SearchBar
        handleSearchChange={handleSearchChange}
        search={search}
        showDialog={() => setShowFilter(true)}
        showSortDialog={() => setShowSort(true)}
        showSort
        showFilter
      />

      {loading ? (
        <Loading />
      ) : data?.pesertaDiklats.items.length === 0 ? (
        <NotFoundSearch />
      ) : (
        <FlashList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={data?.pesertaDiklats.items}
          estimatedItemSize={10}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => refetch()} />
          }
          renderItem={({ item, index }) => (
            <View
              style={{
                paddingHorizontal: moderateScale(15),
                marginTop: index === 0 ? moderateScale(20) : 0,
                marginBottom: moderateScale(25),
              }}
            >
              <ContainerCard
                title={item.jadwal_diklat.diklat.jenis_diklat.name}
              >
                <View style={{ gap: 20 }}>
                  <View style={{ gap: 5 }}>
                    <Text style={{ fontSize: 16 }}>Nama Diklat</Text>
                    <Text
                      style={{
                        color: Colors.text_primary,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {item.jadwal_diklat.diklat.name}
                    </Text>
                  </View>

                  <View style={{ gap: 5 }}>
                    <Text style={{ fontSize: 16 }}>Jadwal Pelaksanaan</Text>
                    <Text
                      style={{
                        color: Colors.text_primary,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {parseDateLong(item.jadwal_diklat.jadwal_mulai)} s/d{" "}
                      {parseDateLong(item.jadwal_diklat.jadwal_selesai)}
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
                      {item.jadwal_diklat.lokasi_diklat?.name ?? "-"}
                    </Text>
                  </View>
                </View>

                <View style={{ gap: 12, flexDirection: "row" }}>
                  <Button
                    onPress={() =>
                      router.navigate({
                        pathname: "/diklat-sudah-diikuti.detail",
                        params: { id: item.jadwal_diklat.id },
                      })
                    }
                    icon={"eye"}
                    mode="contained"
                    textColor="white"
                    style={{
                      backgroundColor: Colors.button_primary,
                      paddingVertical: 6,
                      flex: 1,
                      borderRadius: 7,
                    }}
                  >
                    Detail
                  </Button>

                  {item.sertifikat_signed !== 0 && (
                    <Button
                      onPress={() =>
                        Linking.openURL(
                          `https://simdiklat-bpsdm.jakarta.go.id/sim-diklat/sertifikat/peserta-download-tte/${item.id}`
                        )
                      }
                      mode="contained"
                      icon={"download"}
                      textColor="white"
                      style={{
                        backgroundColor: Colors.primary,
                        paddingVertical: 6,
                        flex: 1,
                        borderRadius: 7,
                      }}
                    >
                      Sertifikat
                    </Button>
                  )}
                </View>
              </ContainerCard>
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
                    status={searchBy === "jd.name" ? "checked" : "unchecked"}
                    value="jd.name"
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
                    status={searchBy === "d.name" ? "checked" : "unchecked"}
                    value="d.name"
                    color={Colors.border_input_active}
                    uncheckedColor="black"
                  />
                  <Text>Nama Diklat</Text>
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
                  getAllDiklat({
                    variables: {
                      limit: 999999,
                      page: 1,
                      tipe: "history",
                      sortBy: "a.jadwal_mulai",
                      sortDirection: "DESC",
                    },
                  }).then((res) => {
                    exportToExcel(res.data?.pesertaDiklats.items as any);
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
