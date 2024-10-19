import {
  View,
  Text,
  Linking,
  Alert,
  Platform,
  ImageBackground,
  Image,
  RefreshControl,
} from "react-native";
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
import { IPengumuman, ISession } from "@/type";
import { Button, Dialog } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { ALERT_TYPE, Dialog as D } from "react-native-alert-notification";
import { useQuery as useQ } from "@tanstack/react-query";

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

type responsePhoto = {
  message: string;
  status: string;
  data: string;
};

export default function PengumumanSeleksi() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const [showCard, setShowCard] = React.useState(false);
  const [dataCard, setDataCard] = React.useState<IPengumuman | null>(null);
  const [loadingDownload, setLoadingDownload] = React.useState(false);

  const { data, isPending, isError, refetch } = useQuery<response>({
    queryKey: ["seleksiWidyaiswaras", page, limit],
    queryFn: async () => {
      const { data } = await axiosService.get(
        `/api/pengumuman/get?page=${page}&limit=${limit}`
      );
      return data;
    },
  });

  const { data: photo, isLoading: loadingPhoto } = useQ({
    queryKey: ["poto-profile", dataCard],
    queryFn: async () => {
      const { data } = await axiosService.get<responsePhoto>(
        "/api/change-profile/photo"
      );
      return data;
    },
  });

  const showShowCard = (item: IPengumuman) => {
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
        await MediaLibrary.createAlbumAsync("Download", asset, true);
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
  }, [dataCard, assets, Colors, parseDateLong]);

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
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => refetch()} />
        }
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
                    onPress={() => showShowCard(item)}
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
                <View style={{ position: "absolute", top: 113, width: "100%" }}>
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
                    {dataCard?.user.full_name}
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
                    {dataCard?.seleksi_widyaiswara.title}
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    {dataCard?.nomor_ujian}
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    {dataCard?.seleksi_widyaiswara.tahun}
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
            labelStyle={{ color: "black" }}
            style={{
              backgroundColor: Colors.button_secondary,
              flexGrow: 1,
            }}
          >
            Download
          </Button>
        </Dialog.Actions>
      </Dialog>
    </ContainerBackground>
  );
}
