import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Image,
  ImageBackground,
} from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import ContainerCard from "@/components/container/ContainerCard";
import { moderateScale } from "react-native-size-matters";
import { Octicons, SimpleLineIcons } from "@expo/vector-icons";
import { Button, Dialog, Portal, RadioButton } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useQuery } from "@apollo/client";
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
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";

import bg from "@/assets/images/temp/cetak-kartu.jpeg";
import auth from "@/services/api/auth";
import assets from "@/assets";

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
      q: debouncedSearch.toLowerCase(),
      tipe: "current",
      sortBy: "a.jadwal_mulai",
      ...terapkan,
    },
  });

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

  const imageUri = Image.resolveAssetSource(bg).uri;

  const downloadAndOpenPDF = async (item: ISedangDiikuti) => {
    const newDataPdf = {
      angkatan: item.jadwal_diklat.name,
      diklat: item.jadwal_diklat.diklat.name,
      jadwal: item.jadwal_diklat.jadwal_mulai,
    };

    const generateHtmlContent = (data: typeof newDataPdf) => `
      <html>
        <body>
        <div
  style=" background-image: url(${imageUri});background-size:cover;background-position:center;height:506px;width:319px;box-sizing:border-box;font-family:sans-serif;display:flex;flex-direction:column">
  <img
    style="border-radius:9px;object-fit:cover;margin-left:84px;margin-top:112px"
    src="https://asset.kompas.com/crops/GQUver5Id7jVYzbXgJveT7OJ0qg=/65x0:650x390/1200x800/data/photo/2015/10/27/1658302Mark-Jadi780x390.jpg"
    alt=""
    width="162"
    height="178" />
  <div
    style="text-align:center;color:black;margin-top:-4px;display:block;margin-left:auto;margin-right:auto;max-width:100%">

    <h1 style="font-weight:bold;margin-bottom:13px;font-size:1em">
      RIYAN ADI LESMANA
    </h1>
    <p style="font-size:13px;font-weight:300">BPSDM</p>

    <p style="font-size:14px;margin-top:20px;word-wrap:break-word">
    ${data.diklat}<span
        style="display:block;margin-top:5px;margin-bottom:5px"
        >${data.angkatan}</span
      ><span>${parseDateLong(data.jadwal)}</span>
    </p>
  </div>
</div>
        </body>
      </html>
    `;

    const pdfUri = await generatePDF(generateHtmlContent(newDataPdf));

    if (pdfUri) {
      const fileName = `${sessionUser?.user.name} - ${newDataPdf.diklat}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;
      try {
        await FileSystem.copyAsync({
          from: pdfUri,
          to: fileUri,
        });
        console.log("PDF saved to:", fileUri);
        await openPDF(fileUri);
      } catch (error) {
        console.error("Error saving or opening PDF:", error);
        alert("Failed to download or open PDF");
      }
    }
  };

  const generatePDF = async (htmlContent: string) => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      return uri;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    }
  };

  const openPDF = async (fileUri: string) => {
    try {
      const contentUri = await FileSystem.getContentUriAsync(fileUri);
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: contentUri,
        flags: 1,
        type: "application/pdf",
      });
    } catch (error) {
      console.error("Error opening PDF:", error);
      alert("Failed to open PDF");
    }
  };

  console.log(dataCard?.id);
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
                      {item.status === "accept" ? "Accept" : "Pending"}
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

        {showCard && (
          <Dialog
            visible={showCard}
            onDismiss={hideShowCard}
            style={{ backgroundColor: "white" }}
          >
            <Dialog.Content>
              <ImageBackground
                source={assets.background_peserta}
                resizeMode="contain"
                style={{ height: 500, position: "relative" }}
              >
                <View style={{ position: "absolute", top: 113, width: "100%" }}>
                  <Image
                    resizeMode="cover"
                    source={{
                      uri: `http://10.15.43.236:8080/api/file/${sessionUser?.user.image}`,
                    }}
                    style={{
                      height: 173,
                      width: 158.2,
                      margin: "auto",
                      marginLeft: 82,
                      borderRadius: 7,
                    }}
                  />
                </View>

                <View
                  style={{ position: "absolute", bottom: 186, width: "100%" }}
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
                  style={{ position: "absolute", bottom: 155, width: "100%" }}
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
                    bottom: 65,
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
                    {parseDateLong(dataCard?.jadwal_diklat.jadwal_mulai as any)}
                  </Text>
                </View>
              </ImageBackground>
            </Dialog.Content>

            <Dialog.Actions>
              <Button
                onPress={() => setShowCard(false)}
                icon={"close"}
                mode="contained"
                textColor="black"
                style={{
                  backgroundColor: Colors.button_secondary,
                  flexGrow: 1,
                }}
              >
                Tutup
              </Button>
            </Dialog.Actions>
          </Dialog>
        )}
      </Portal>
    </ContainerBackground>
  );
}
