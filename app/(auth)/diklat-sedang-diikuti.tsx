import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { ScrollView } from "react-native-gesture-handler";
import ContainerCard from "@/components/container/ContainerCard";
import { moderateScale } from "react-native-size-matters";
import { Ionicons, Octicons, SimpleLineIcons } from "@expo/vector-icons";
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
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";

import bg from "@/assets/images/temp/cetak-kartu.jpeg";
import { axiosService } from "@/services/axiosService";
import auth from "@/services/api/auth";

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
  const [terapkan, setTerapkan] = React.useState<{ year: string | null }>({
    year: null,
  });

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
      q: debouncedSearch,
      tipe: "current",
    },
  });

  const totalPage = data ? Math.ceil(data?.pesertaDiklats.total / limit) : 1;

  const handleSearchChange = React.useCallback((text: string) => {
    setSearch(text);
  }, []);

  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = React.useState("status");

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

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

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
  return (
    <ContainerBackground>
      <SearchBar
        handleSearchChange={handleSearchChange}
        search={search}
        showDialog={showDialog}
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
                      {parseDateLong(item.jadwal_diklat.jadwal_mulai)}
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
                      {item.jadwal_diklat.status_registrasi}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 20,
                    paddingTop: moderateScale(20),
                    paddingBottom: moderateScale(20),
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#7AC52E",
                      borderRadius: 50,
                      paddingVertical: 14,
                      paddingHorizontal: 18,
                    }}
                  >
                    <Octicons name="apps" size={25} color={"white"} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      router.navigate({
                        pathname: "/diklat-sedang-diikuti.detail",
                        params: { id: item.jadwal_diklat.id },
                      })
                    }
                    style={{
                      backgroundColor: "#0099FA",
                      borderRadius: 50,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Octicons name="eye" size={25} color={"white"} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => downloadAndOpenPDF(item)}
                    style={{
                      backgroundColor: "#FF9100",
                      borderRadius: 50,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                    }}
                  >
                    <SimpleLineIcons name="printer" size={25} color={"white"} />
                  </TouchableOpacity>
                </View>
              </ContainerCard>
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
              onValueChange={(newValue) => setValue(newValue)}
              value={value}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="status"
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
                  value="jenis-diklat"
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
                  value="jadwal-pelaksanaan"
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
                  value="lokasi-diklat"
                  color={Colors.border_input_active}
                  uncheckedColor="black"
                />
                <Text>Lokasi Diklat</Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={hideDialog}
              textColor="black"
              mode="contained"
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
