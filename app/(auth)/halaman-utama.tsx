import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale, scale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { homeRouters } from "@/constants/routers";
import ButtonOpacity from "@/components/elements/ButtonOpacity";
import assets from "@/assets";
import { Href, router } from "expo-router";
import { useQuery } from "@apollo/client";
import { IJP, IProfilePeserta } from "@/type";
import { getProfilePeserta } from "@/services/query/getProfilePeserta";
import { Button, Dialog, Portal } from "react-native-paper";
import { useQuery as useQ } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import Loading from "@/components/elements/Loading";

type response = {
  status: "success" | "error";
  message: string;
  data: IJP[];
};

export default function HalamanUtama() {
  const { data, loading } = useQuery<{
    profilPesertaDiklat: IProfilePeserta;
  }>(getProfilePeserta);

  const [showModal, setShowModal] = React.useState({
    jp: false,
    ip: false,
  });

  const { data: dataJp, isPending: loadingJp } = useQ({
    queryKey: ["jp"],
    queryFn: async () => {
      const res = await axiosService.get<response>("/api/jp");
      return res.data;
    },
  });

  return (
    <ContainerBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: moderateScale(30),
          gap: moderateScale(20),
        }}
      >
        <View style={{ paddingHorizontal: moderateScale(15) }}>
          <View
            style={{
              backgroundColor: "#F8F8F8",
              paddingVertical: moderateScale(10),
              paddingHorizontal: moderateScale(10),
              height: scale(120),
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              borderRadius: 20,
              elevation: 3,
              borderWidth: Platform.OS === "ios" ? 1 : 0,
              borderColor: "rgba(158, 150, 150, .5)",
            }}
          >
            {loading ? (
              <ActivityIndicator size={"large"} color={Colors.primary} />
            ) : (
              <TouchableOpacity
                onPress={() => setShowModal({ ...showModal, jp: true })}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 17,
                  }}
                >
                  Total JP Anda
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 17,
                    color: Colors.button_primary,
                  }}
                >
                  {data?.profilPesertaDiklat.jp}
                </Text>
              </TouchableOpacity>
            )}

            <View
              style={{
                backgroundColor: "rgba(158, 150, 150, .5)",
                width: 1,
                height: 115,
              }}
            />

            {loading ? (
              <ActivityIndicator size={"large"} color={Colors.primary} />
            ) : (
              <TouchableOpacity
                onPress={() => setShowModal({ ...showModal, ip: true })}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 17,
                  }}
                >
                  Total IP ASN
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 17,
                    color: Colors.button_primary,
                  }}
                >
                  {data?.profilPesertaDiklat.skor_ipasn} / 40
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ paddingHorizontal: moderateScale(9) }}>
          <View
            style={{
              gap: moderateScale(25),
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                paddingHorizontal: moderateScale(10),
              }}
            >
              MENU
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: moderateScale(10),
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {homeRouters.map((route) => (
                <TouchableOpacity
                  key={route.name}
                  onPress={() => router.push(route.path as Href<string>)}
                  style={{
                    borderWidth: 1.5,
                    paddingHorizontal: moderateScale(15),
                    paddingVertical: moderateScale(20),
                    borderRadius: 20,
                    borderColor: Colors.button_primary,
                    width: "30%",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    gap: moderateScale(5),
                  }}
                >
                  <Image
                    resizeMode="center"
                    source={route.icon}
                    style={{ height: 20, width: 20 }}
                  />

                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: 400,
                      fontSize: 12,
                    }}
                  >
                    {route.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={{ gap: moderateScale(25) }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              paddingHorizontal: moderateScale(15),
            }}
          >
            Podcast Yang Akan Datang
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: moderateScale(20),
              paddingHorizontal: moderateScale(15),
            }}
          >
            <View
              style={{
                padding: moderateScale(20),
                backgroundColor: "#F8F8F8",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "rgba(158, 150, 150, .5)",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                Podcast Rabu Belajar
              </Text>

              <Image
                source={assets.podasct}
                resizeMode="contain"
                style={{ height: 110, width: 200 }}
              />
              <ButtonOpacity
                bgcolor={Colors.button_primary}
                textcolor={Colors.text_white}
                textweight="bold"
                vertical={15}
                textsize={15}
              >
                Tonton Di Sini
              </ButtonOpacity>
            </View>

            <View
              style={{
                padding: moderateScale(20),
                backgroundColor: "#F8F8F8",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "rgba(158, 150, 150, .5)",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                Podcast Rabu Belajar
              </Text>

              <Image
                source={assets.podasct}
                resizeMode="contain"
                style={{ height: 110, width: 200 }}
              />
              <ButtonOpacity
                bgcolor={Colors.button_primary}
                textcolor={Colors.text_white}
                textweight="bold"
                vertical={15}
                textsize={15}
              >
                Tonton Di Sini
              </ButtonOpacity>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          visible={showModal.ip || showModal.jp}
          onDismiss={() => setShowModal({ ip: false, jp: false })}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            {showModal.jp ? "Info Detail JP Pegawai" : "Info Detail IP ASN"}
          </Dialog.Title>

          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            {}
            {showModal.jp &&
              (loadingJp ? (
                <Loading />
              ) : (
                <FlatList
                  data={dataJp?.data}
                  renderItem={({ item, index }) => (
                    <View
                      style={[
                        styles.tableRow,
                        {
                          backgroundColor:
                            index % 2 === 0 ? "#F0E9F5" : "white",
                        },
                      ]}
                    >
                      <Text style={[styles.cell, styles.nameCell]}>
                        {item.NAMA_DIKLAT}
                      </Text>
                      <Text style={[styles.cell, styles.typeCell]}>
                        {item.NAMA_KATEGORI}
                      </Text>
                      <Text style={[styles.cell, styles.jpCell]}>
                        {item.JP}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ListHeaderComponent={() => (
                    <View style={styles.tableHeader}>
                      <Text style={[styles.headerCell, styles.nameCell]}>
                        NAMA PELATIHAN
                      </Text>
                      <Text style={[styles.headerCell, styles.typeCell]}>
                        JENIS PELATIHAN
                      </Text>
                      <Text style={[styles.headerCell, styles.jpCell]}>JP</Text>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              ))}

            {showModal.ip && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.headerCell, styles.nameCell]}>
                      KETERANGAN
                    </Text>
                    <Text style={[styles.headerCell, styles.typeCell]}>
                      NILAI
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor: "#F0E9F5",
                      },
                    ]}
                  >
                    <Text style={[styles.cell, styles.nameCell]}>
                      Nilai IP ASN
                    </Text>
                    <Text style={[styles.cell, styles.typeCell]}>
                      {data?.profilPesertaDiklat.skor_ipasn}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor: "white",
                      },
                    ]}
                  >
                    <Text style={[styles.cell, styles.nameCell]}>
                      Diklat Manajerial (Nilai:0)
                    </Text>
                    <Text style={[styles.cell, styles.typeCell]}>
                      {data?.profilPesertaDiklat.kepemimpinan}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor: "#F0E9F5",
                      },
                    ]}
                  >
                    <Text style={[styles.cell, styles.nameCell]}>
                      Diklat Fungsional (Nilai Max:0)
                    </Text>
                    <Text style={[styles.cell, styles.typeCell]}>
                      {data?.profilPesertaDiklat.fungsional}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor: "white",
                      },
                    ]}
                  >
                    <Text style={[styles.cell, styles.nameCell]}>
                      Diklat Teknis (Total 20 JP) (Nilai Max:22,5)
                    </Text>
                    <Text style={[styles.cell, styles.typeCell]}>
                      {data?.profilPesertaDiklat.teknis}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor: "#F0E9F5",
                      },
                    ]}
                  >
                    <Text style={[styles.cell, styles.nameCell]}>
                      Diklat Lainya (Nilai Max:17,5)
                    </Text>
                    <Text style={[styles.cell, styles.typeCell]}>
                      {data?.profilPesertaDiklat.lainnya}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}
          </Dialog.ScrollArea>

          <Dialog.Actions>
            <Button
              textColor="white"
              onPress={() => setShowModal({ ip: false, jp: false })}
              style={styles.button}
            >
              Tutup
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ContainerBackground>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: "white",
    borderRadius: 8,
    maxHeight: "80%",
  },
  dialogTitle: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.text_primary,
  },
  dialogScrollArea: {
    paddingHorizontal: moderateScale(10),
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.border_primary,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: moderateScale(10),
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: Colors.button_primary,
    alignItems: "center",
  },
  headerCell: {
    color: "white",
    fontWeight: "bold",
    padding: moderateScale(10),
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  cell: {
    padding: moderateScale(10),
  },
  nameCell: {
    flex: 3,
  },
  typeCell: {
    flex: 2,
    textAlign: "center",
  },
  jpCell: {
    flex: 1,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.button_primary,
    width: "100%",
    paddingVertical: 3,
  },
});

const tableData = [
  {
    name: "Character Building BPSDM Provinsi DKI Jakarta",
    type: "Teknis",
    jp: 20,
  },
  { name: "Podcast JPodcast", type: "Lainya", jp: 8 },
  { name: "Podcast Kopi Sedap", type: "Lainya", jp: 36 },
  { name: "Podcast Kopatik", type: "Lainya", jp: 2 },
  { name: "Podacst OKE SIP", type: "Lainya", jp: 4 },
  { name: "Podcast Rabu Belajar", type: "Lainya", jp: 36 },
  { name: "SiJule-ASN pengabdian Tiada Henti", type: "Teknis", jp: 1 },
  { name: "SiJule - Dasar Audio Visual", type: "Teknis", jp: 1 },
  { name: "SiJule - Jakarta Sadar Memilah Sampah", type: "Teknis", jp: 1 },
  { name: "SiJule - Melejitkan Prestasi", type: "Teknis", jp: 1 },
  { name: "Webinar Bicara Kota", type: "Lainnya", jp: 16 },
  { name: "Webinar Bina Konstruksi", type: "Lainnya", jp: 16 },
];
