import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Image,
  ImageBackground,
  Alert,
  Platform,
} from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import ContainerCard from "@/components/container/ContainerCard";
import { moderateScale } from "react-native-size-matters";
import { Octicons, SimpleLineIcons } from "@expo/vector-icons";
import { Button, Dialog, Portal, RadioButton } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useLazyQuery, useQuery } from "@apollo/client";
import { getDiklat } from "@/services/query/get-diklat";
import { ISedangDiikuti, ISession } from "@/type";
import { FlashList } from "@shopify/flash-list";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import Pagination from "@/components/sections/pagination";
import SearchBar from "@/components/sections/SearchBar";
import useDebounce from "@/hooks/useDebounce";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import { parseDateLong } from "@/lib/parseDate";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import auth from "@/services/api/auth";
import assets from "@/assets";
import { useQuery as useQ } from "@tanstack/react-query";

import { ALERT_TYPE, Dialog as D } from "react-native-alert-notification";
import { axiosService } from "@/services/axiosService";
import * as XLSX from "xlsx";

type response = {
  message: string;
  status: string;
  data: string;
};

export default function DiklatSedangDiikuti() {
  const [sessionUser, setSessionUser] = React.useState<ISession | null>(null);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const res = await auth.getSession();

        setSessionUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);
  const [loadingDownload, setLoadingDownload] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [searchBy, setSearchBy] = React.useState("");
  const [filter, setfilter] = React.useState("DESC");
  const [terapkan, setTerapkan] = React.useState<any>({
    sortDirection: filter,
    searchBy: "",
  });

  const [showFilter, setShowFilter] = React.useState(false);
  const [showSort, setShowSort] = React.useState(false);
  const [showCard, setShowCard] = React.useState(false);
  const [dataCard, setDataCard] = React.useState<ISedangDiikuti | null>(null);
  const debouncedSearch = useDebounce(search, 1000);

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const [searchValue, setSearchValue] = React.useState(debouncedSearch);

  React.useEffect(() => {
    const lowerCaseSearch = debouncedSearch.toLowerCase();
    if (lowerCaseSearch === "diterima") {
      setSearchValue("accept");
    } else {
      setSearchValue(lowerCaseSearch);
    }
  }, [debouncedSearch]);

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
      q: searchValue,
      tipe: "current",
      sortBy: "a.jadwal_mulai",
      ...terapkan,
    },
  });

  const { data: photo, isLoading: loadingPhoto } = useQ({
    queryKey: ["poto-profile", dataCard],
    queryFn: async () => {
      const { data } = await axiosService.get<response>(
        "/api/change-profile/photo"
      );
      return data;
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

  const showShowCard = (item: ISedangDiikuti) => {
    setShowCard(true);
    setDataCard(item);
  };

  const hideShowCard = () => {
    setShowCard(false);
  };

  const viewShotRef = React.useRef<any>();

  const captureAndSaveImage = React.useCallback(async () => {
    setLoadingDownload(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Izin diperlukan",
          "Mohon berikan izin untuk menyimpan gambar."
        );
        return;
      }

      // Tunggu sedikit sebelum mengambil screenshot
      await new Promise((resolve) => setTimeout(resolve, 100));

      const imageUri = await viewShotRef.current.capture({
        format: "jpg",
        quality: 0.8,
        result: "tmpfile",
      });

      if (Platform.OS === "android") {
        const asset = await MediaLibrary.createAssetAsync(imageUri);
        await MediaLibrary.createAlbumAsync("Download", asset, false);
      } else {
        await MediaLibrary.saveToLibraryAsync(imageUri);
      }

      // Hapus file sementara setelah disimpan
      await FileSystem.deleteAsync(imageUri, { idempotent: true });

      D.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Gambar Berhasil Disimpan Ke Galeri",
        button: "Tutup",
      });

      setShowCard(false);
    } catch (error) {
      console.error("Error saving image: ", error);
      D.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Gagal Menyimpan Gambar",
        button: "Tutup",
      });
    } finally {
      setLoadingDownload(false);
    }
  }, [sessionUser, dataCard, assets, Colors, parseDateLong]);

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
        Status: "STATUS",
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
        Status: item.status === "accept" ? "Diterima" : "Belum Diterima",
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
      { wch: 20 }, // Status
    ];

    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Diklat Sedang Diikuti");

    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    const fileName = `Diklat Sedang Diikuti_${Date.now()}.xlsx`;
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
          data={data?.pesertaDiklats.items}
          keyExtractor={(item) => item.id.toString()}
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
                title={item.jadwal_diklat.diklat.jenis_diklat?.name}
                textSize={20}
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
                      {item.jadwal_diklat.diklat?.name}
                    </Text>
                  </View>

                  <View style={{ gap: 5 }}>
                    <Text style={{ fontSize: 16 }}>Angkatan</Text>
                    <Text
                      style={{
                        color: Colors.text_primary,
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      {item.jadwal_diklat?.name}
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
                        color: "#595959",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {item.jadwal_diklat.lokasi_diklat?.name ?? "-"}
                    </Text>
                  </View>

                  <View style={{ gap: 5 }}>
                    <Text style={{ fontSize: 16 }}>Status</Text>
                    <Text
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {item.status === "accept" ? "Diterima" : "Ditolak"}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    gap: 15,
                    paddingTop: moderateScale(20),
                    paddingBottom: moderateScale(20),
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/diklat-sedang-diikuti.kurikulum",
                        params: {
                          id: item.jadwal_diklat.id,
                          diklat: JSON.stringify(item.jadwal_diklat.diklat),
                        },
                      })
                    }
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#7AC52E",
                      borderRadius: 7,
                      paddingVertical: 14,
                      paddingHorizontal: 18,
                    }}
                  >
                    <Octicons name="apps" size={25} color={"white"} />
                    <Text
                      style={{ fontSize: 15, color: "white", fontWeight: 600 }}
                    >
                      Lihat Mata Diklat
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      router.navigate({
                        pathname: "/diklat-sedang-diikuti.detail",
                        params: { id: item.jadwal_diklat.id },
                      })
                    }
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#0099FA",
                      borderRadius: 7,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Octicons name="eye" size={25} color={"white"} />
                    <Text
                      style={{ fontSize: 15, color: "white", fontWeight: 600 }}
                    >
                      Lihat Detail Diklat
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => showShowCard(item)}
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#FF9100",
                      borderRadius: 7,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      paddingLeft: 30,
                    }}
                  >
                    <SimpleLineIcons
                      name="printer"
                      size={25}
                      color={"white"}
                      sty
                    />

                    <Text
                      style={{
                        fontSize: 15,
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      Cetak Kartu Peserta
                    </Text>
                  </TouchableOpacity>
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
                    status={searchBy === "d.name" ? "checked" : "unchecked"}
                    value="a.name"
                    color={Colors.border_input_active}
                    uncheckedColor="black"
                  />
                  <Text>Angkatan</Text>
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

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    status={searchBy === "pd.status" ? "checked" : "unchecked"}
                    value="pd.status"
                    color={Colors.border_input_active}
                    uncheckedColor="black"
                  />
                  <Text>Status</Text>
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
                      tipe: "current",
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

            <Dialog.Actions style={{ flexDirection: "row" }}>
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

        {showCard && (
          <Dialog
            visible={showCard}
            onDismiss={hideShowCard}
            style={{ backgroundColor: "white" }}
          >
            <Dialog.Content>
              {loadingPhoto ? (
                <Loading />
              ) : (
                <ViewShot
                  ref={viewShotRef as any}
                  options={{ format: "jpg", quality: 0.8 }}
                >
                  <ImageBackground
                    source={assets.background_peserta}
                    resizeMode="contain"
                    style={{ height: 500, position: "relative" }}
                  >
                    <View
                      style={{ position: "absolute", top: 113, width: "100%" }}
                    >
                      <Image
                        resizeMode="cover"
                        source={{
                          uri: `http://10.15.43.236:8080/api/file/${photo?.data}`,
                        }}
                        style={{
                          height: 172.7,
                          width: 158.2,
                          margin: "auto",
                          marginLeft: 82,
                          borderRadius: 7,
                        }}
                      />
                    </View>

                    <View
                      style={{
                        position: "absolute",
                        bottom: 186,
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 17,
                          color: Colors.text_primary,
                          fontWeight: "bold",
                        }}
                      >
                        {sessionUser?.user.name}
                      </Text>
                    </View>

                    <View
                      style={{
                        position: "absolute",
                        bottom: 155,
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 15,
                          color: Colors.text_secondary,
                        }}
                      >
                        BPSDM
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        position: "absolute",
                        width: "100%",
                        maxHeight: 80,
                        bottom: 70,
                        gap: 5,
                        paddingHorizontal: 20,
                      }}
                    >
                      <Text
                        numberOfLines={2}
                        style={{
                          textAlign: "center",
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {dataCard?.jadwal_diklat.diklat.name}
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {dataCard?.jadwal_diklat.name}
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {parseDateLong(
                          dataCard?.jadwal_diklat.jadwal_mulai as any
                        )}
                      </Text>
                    </View>
                  </ImageBackground>
                </ViewShot>
              )}
            </Dialog.Content>

            <Dialog.Actions>
              <Button
                loading={loadingDownload}
                disabled={loadingDownload}
                onPress={captureAndSaveImage}
                icon={"download"}
                mode="contained"
                textColor="black"
                style={{
                  backgroundColor: Colors.button_secondary,
                  flexGrow: 1,
                }}
              >
                Download
              </Button>
            </Dialog.Actions>
          </Dialog>
        )}
      </Portal>
    </ContainerBackground>
  );
}
