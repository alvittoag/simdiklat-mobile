import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { Button, Checkbox } from "react-native-paper";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { useQuery } from "@apollo/client";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import {
  IKaryTulisUser,
  IPelatihanUser,
  IPengajaranUser,
  IPesertaDiklatList,
  IRiwayatPekerjaanUser,
  IRiwayatPendidikanUser,
} from "@/type";
import { FlashList } from "@shopify/flash-list";
import {
  getKaryaTulisUser,
  getPelatihanUser,
  getPengajaranUser,
  getPesertaDiklatList,
  getRiwayatPekerjaanUser,
  getRiwayatPendidikanUser,
} from "@/services/query/data-kompetensi";
import { parseDateLong } from "@/lib/parseDate";
import { router, useLocalSearchParams } from "expo-router";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { useMutation } from "@tanstack/react-query";
import Pagination from "../pagination";

export default function DataKompetensi() {
  const isRefetch = useLocalSearchParams();

  const [checked, setChecked] = React.useState(false);
  const [pagePendidikan, setPagePendidikan] = React.useState(1);
  const [pagePeserta, setPagePeserta] = React.useState(1);
  const [pagePelatihan, setPagePelatihan] = React.useState(1);
  const [pagePekerjaan, setpagePekerjaan] = React.useState(1);
  const [pagePengajaran, setPagePengajaran] = React.useState(1);
  const [pageKarya, setPageKarya] = React.useState(1);

  const {
    data: pendidiakn,
    loading: loadingPendidikan,
    error: errorPendidiakn,
    refetch: refetchPendidikan,
  } = useQuery<{
    riwayatPendidikanUser: {
      items: IRiwayatPendidikanUser[];
      total: number;
      hasMore: boolean;
    };
  }>(getRiwayatPendidikanUser, {
    variables: {
      limit: 3,
      page: pagePendidikan,
    },
  });

  const totalPagePendidikan = pendidiakn
    ? Math.ceil(pendidiakn?.riwayatPendidikanUser.total / 3)
    : 1;

  const {
    data: peserta,
    loading: loadingPeserta,
    error: errorPeserta,
  } = useQuery<{
    pesertaDiklats: {
      items: IPesertaDiklatList[];
      total: number;
      hasMore: boolean;
    };
  }>(getPesertaDiklatList, {
    variables: {
      limit: 5,
      page: pagePeserta,
    },
  });

  const totalPagePeserta = peserta
    ? Math.ceil(peserta?.pesertaDiklats.total / 5)
    : 1;

  const {
    data: pelatihan,
    loading: loadingPelatihan,
    error: errorPelatihan,
    refetch: refetchPelatihan,
  } = useQuery<{
    pelatihanUser: { items: IPelatihanUser[]; total: number; hasMore: boolean };
  }>(getPelatihanUser, {
    variables: {
      limit: 5,
      page: pagePelatihan,
    },
  });

  const totalPagePelatihan = pelatihan
    ? Math.ceil(pelatihan?.pelatihanUser.total / 5)
    : 1;

  const {
    data: pekerjaan,
    loading: loadingPekerjaan,
    error: errorPekerjaan,
    refetch: refetchPekerjaan,
  } = useQuery<{
    riwayatPekerjaanUser: {
      items: IRiwayatPekerjaanUser[];
      total: number;
      hasMore: boolean;
    };
  }>(getRiwayatPekerjaanUser, {
    variables: {
      limit: 3,
      page: pagePekerjaan,
    },
  });

  const totalPagePekerjaan = pekerjaan
    ? Math.ceil(pekerjaan.riwayatPekerjaanUser.total / 3)
    : 1;

  const {
    data: pengajaran,
    loading: loadingPengajaran,
    error: errorPengajaran,
    refetch: refetchPengajaran,
  } = useQuery<{
    pengajaranUser: {
      items: IPengajaranUser[];
      total: number;
      hasMore: boolean;
    };
  }>(getPengajaranUser, {
    variables: {
      limit: 3,
      page: pagePengajaran,
    },
  });

  const totalPagePengajaran = pengajaran
    ? Math.ceil(pengajaran.pengajaranUser.total / 3)
    : 1;

  const {
    data: karya,
    loading: loadingKarya,
    error: errorKarya,
    refetch: refetchKarya,
  } = useQuery<{
    karyaTulisUser: {
      items: IKaryTulisUser[];
      total: number;
      hasMore: boolean;
    };
  }>(getKaryaTulisUser, {
    variables: {
      limit: 3,
      page: pageKarya,
    },
  });

  const totalPageKarya = karya ? Math.ceil(karya.karyaTulisUser.total / 3) : 1;

  const mutationDeleteRiwayatPendidikan = useMutation({
    mutationFn: async (id: number) => {
      return await axiosService.delete(
        "/api/data-kompetensi/riwayat-pendidikan/delete",
        {
          data: {
            id,
          },
        }
      );
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Riwayat Pendidikan Berhasil Dihapus",
        button: "Tutup",
      });

      refetchPendidikan();
    },
    onError: () => {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal ",
        textBody: "Riwayat Pendidikan Gagal Dihapus",
        button: "Tutup",
      });
    },
  });

  const mutationDeleteKompetensiLainnya = useMutation({
    mutationFn: async (id: number) => {
      return await axiosService.delete(
        "/api/data-kompetensi/kompetensi-lainnya/delete",
        {
          data: {
            id,
          },
        }
      );
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Kompetensi Lainnya Berhasil Dihapus",
        button: "Tutup",
      });

      refetchPelatihan();
    },
    onError: () => {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal ",
        textBody: "Kompetensi Lainnya Gagal Dihapus",
        button: "Tutup",
      });
    },
  });

  const mutationDeleteRiwayatPekerjaan = useMutation({
    mutationFn: async (id: number) => {
      return await axiosService.delete(
        "/api/data-kompetensi/riwayat-pekerjaan/delete",
        {
          data: {
            id,
          },
        }
      );
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Riwayat Pekerjaan Berhasil Dihapus",
        button: "Tutup",
      });

      refetchPekerjaan();
    },
    onError: () => {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal ",
        textBody: "Riwayat Pekerjaan Gagal Dihapus",
        button: "Tutup",
      });
    },
  });

  const mutationDeleteKarya = useMutation({
    mutationFn: async (id: number) => {
      return await axiosService.delete(
        "/api/data-kompetensi/karya-tulis/delete",
        {
          data: {
            id,
          },
        }
      );
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Karya Tulis Berhasil Dihapus",
        button: "Tutup",
      });

      refetchPekerjaan();
    },
    onError: () => {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal ",
        textBody: "Karya Tulis Gagal Dihapus",
        button: "Tutup",
      });
    },
  });

  const mutationDeletePelatihan = useMutation({
    mutationFn: async (id: number) => {
      return await axiosService.delete(
        "/api/data-kompetensi/pengajaran/delete",
        {
          data: {
            id,
          },
        }
      );
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Pelatihan Berhasil Dihapus",
        button: "Tutup",
      });

      refetchPekerjaan();
    },
    onError: () => {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal ",
        textBody: "Pelatihan Gagal Dihapus",
        button: "Tutup",
      });
    },
  });

  const handleDeleteRiwayatPendidikan = (id: number) => {
    mutationDeleteRiwayatPendidikan.mutate(id);
  };

  const handleDeleteKompetensiLainnya = (id: number) => {
    mutationDeleteKompetensiLainnya.mutate(id);
  };

  const handleDeleteRiwayatPekerjaan = (id: number) => {
    mutationDeleteRiwayatPekerjaan.mutate(id);
  };

  const handleDeletePelatihan = (id: number) => {
    mutationDeletePelatihan.mutate(id);
  };

  const handleDeleteKarya = (id: number) => {
    mutationDeleteKarya.mutate(id);
  };

  React.useEffect(() => {
    refetchPendidikan();
    refetchPelatihan();
    refetchPekerjaan();
    refetchPengajaran();
    refetchKarya();
  }, [isRefetch]);

  if (
    errorPendidiakn ||
    errorPeserta ||
    errorPelatihan ||
    errorPekerjaan ||
    errorPengajaran ||
    errorKarya
  ) {
    return <Error />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: moderateScale(20),
      }}
    >
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(20),
          borderBottomWidth: 1,
          borderBottomColor: Colors.border_primary,
          flex: 1,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>
          I. Riwayat Pendidikan Formal
        </Text>

        <Button
          onPress={() => router.navigate("/riwayat-pendidikan.create")}
          icon="plus"
          mode="contained"
          textColor="black"
          style={{
            paddingVertical: moderateScale(5),
            backgroundColor: Colors.button_secondary,
          }}
        >
          Tambah Data
        </Button>

        <View style={{ flex: 1 }}>
          {loadingPendidikan ? (
            <Loading />
          ) : (
            <FlashList
              keyExtractor={(item) => item.id.toString()}
              data={pendidiakn?.riwayatPendidikanUser.items}
              estimatedItemSize={5}
              renderItem={({ item, index }) => {
                const length =
                  pendidiakn?.riwayatPendidikanUser.items.length ?? 0;
                return (
                  <View
                    key={item.id}
                    style={{
                      borderBottomWidth: length - 1 === index ? 0 : 1,
                      borderBottomColor: Colors.border_primary,
                      marginBottom:
                        length - 1 === index ? 0 : moderateScale(10),
                    }}
                  >
                    <View style={{ marginBottom: moderateScale(10) }}>
                      <Text style={{ fontSize: 15 }}>Jenjang</Text>
                      <Text style={{ fontWeight: "bold" }}>{item.jenis}</Text>
                    </View>

                    <View style={{ marginBottom: moderateScale(10) }}>
                      <Text style={{ fontSize: 15 }}>Nama Sekolah</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {item.nama_sekolah === " " ? "-" : item.nama_sekolah}
                      </Text>
                    </View>

                    <View style={{ marginBottom: moderateScale(10) }}>
                      <Text style={{ fontSize: 15 }}>Tempat Pendidikan</Text>
                      <Text style={{ fontWeight: "bold" }}>{item.tempat}</Text>
                    </View>

                    <View style={{ marginBottom: moderateScale(10) }}>
                      <Text style={{ fontSize: 15 }}>Tahun Lulus</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {item.tahun_lulus}
                      </Text>
                    </View>

                    <View style={{ marginBottom: moderateScale(10) }}>
                      <Text style={{ fontSize: 15 }}>Keterangan</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {item.keterangan === " " ? "-" : item.keterangan}
                      </Text>
                    </View>

                    <View style={{ marginBottom: moderateScale(10) }}>
                      <Text style={{ fontSize: 15 }}>Ijazah</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {item.ijazah_url}
                      </Text>
                    </View>

                    <View style={styles.actionButtonsContainer}>
                      <Button
                        onPress={() => handleDeleteRiwayatPendidikan(item.id)}
                        icon="delete"
                        mode="outlined"
                        textColor={Colors.text_primary}
                        style={styles.deleteButton}
                      >
                        Hapus
                      </Button>

                      <Button
                        onPress={() =>
                          router.push({
                            pathname: "/riwayat-pendidikan.edit",
                            params: { data: JSON.stringify(item) },
                          })
                        }
                        icon="content-save-edit-outline"
                        mode="outlined"
                        textColor={Colors.text_primary}
                        style={styles.editButton}
                      >
                        Edit
                      </Button>
                    </View>
                  </View>
                );
              }}
              ListFooterComponent={() => (
                <Pagination
                  loading={loadingPendidikan}
                  page={pagePendidikan}
                  setPage={setPagePendidikan}
                  totalPage={totalPagePendidikan}
                  horizontal={0}
                  bottom={0}
                />
              )}
            />
          )}
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(20),
          borderBottomWidth: 1,
          borderBottomColor: Colors.border_primary,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>
          II. Pengembangan Kompetensi oleh BPSDM
        </Text>

        <View style={{ flex: 1 }}>
          {loadingPeserta ? (
            <Loading />
          ) : (
            <FlashList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              data={peserta?.pesertaDiklats.items}
              estimatedItemSize={200}
              renderItem={({ item, index }) => {
                const length = peserta?.pesertaDiklats.items.length ?? 0;
                return (
                  <View
                    key={item.id}
                    style={{
                      borderBottomWidth: length - 1 === index ? 0 : 1,
                      borderBottomColor: Colors.border_primary,
                      marginBottom:
                        length - 1 === index ? 0 : moderateScale(10),
                    }}
                  >
                    <View style={{ marginBottom: moderateScale(10) }}>
                      <Text style={{ fontSize: 15 }}>Kelompok Diklat</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {item.jadwal_diklat.diklat.jenis_diklat.name}
                      </Text>
                    </View>

                    <View style={{ marginBottom: moderateScale(10) }}>
                      <Text style={{ fontSize: 15 }}>Nama Diklat</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {item.jadwal_diklat.diklat.name}
                      </Text>
                    </View>

                    <View style={{ marginBottom: moderateScale(10) }}>
                      <Text style={{ fontSize: 15 }}>Jadwal Pelaksanaan</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {parseDateLong(item.jadwal_diklat.jadwal_mulai)}
                      </Text>
                    </View>

                    <View style={{ marginBottom: moderateScale(10) }}>
                      <Text style={{ fontSize: 15 }}>Lokasi Diklat</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {item.jadwal_diklat.lokasi_diklat?.name ?? "-"}
                      </Text>
                    </View>

                    <View style={{ marginBottom: moderateScale(10) }}>
                      <Text style={{ fontSize: 15 }}>Status</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {item.jadwal_diklat.status_registrasi}
                      </Text>
                    </View>
                  </View>
                );
              }}
              ListFooterComponent={() => (
                <Pagination
                  loading={loadingPelatihan}
                  page={pagePeserta}
                  setPage={setPagePeserta}
                  totalPage={totalPagePeserta}
                  horizontal={0}
                  bottom={0}
                />
              )}
            />
          )}
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(20),
          borderBottomWidth: 1,
          borderBottomColor: Colors.border_primary,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>
          Pengembangan Kompetensi Lainnya
        </Text>

        <Button
          onPress={() => router.push("/kompetensi-lainnya.create")}
          icon="plus"
          mode="contained"
          textColor="black"
          style={{
            paddingVertical: moderateScale(5),
            backgroundColor: Colors.button_secondary,
          }}
        >
          Tambah Data
        </Button>

        <View style={{ flex: 1 }}>
          <FlashList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            data={pelatihan?.pelatihanUser.items}
            estimatedItemSize={200}
            renderItem={({ item, index }) => {
              const length = pelatihan?.pelatihanUser.items.length ?? 0;
              return (
                <View
                  key={item.id}
                  style={{
                    borderBottomWidth: length - 1 === index ? 0 : 1,
                    borderBottomColor: Colors.border_primary,
                    marginBottom: length - 1 === index ? 0 : moderateScale(10),
                  }}
                >
                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>
                      Nama Pengembangan Kompetensi
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {item.keterangan}
                    </Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>
                      Kategori Pengembangan Kompetensi
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {item.jenis === " " ? "-" : item.jenis}
                    </Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Penyelenggara</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {item.penyelenggara}
                    </Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Tahun</Text>
                    <Text style={{ fontWeight: "bold" }}>{item.tahun}</Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>
                      Sertifikat / Dokumen Bukti
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {item.sertifikat_url === " " ? "-" : item.sertifikat_url}
                    </Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Status</Text>
                    <Text style={{ fontWeight: "bold" }}>{item.status}</Text>
                  </View>

                  <View style={styles.actionButtonsContainer}>
                    <Button
                      onPress={() => handleDeleteKompetensiLainnya(item.id)}
                      icon="delete"
                      mode="outlined"
                      textColor={Colors.text_primary}
                      style={styles.deleteButton}
                    >
                      Hapus
                    </Button>

                    <Button
                      onPress={() =>
                        router.navigate({
                          pathname: "/kompetensi-lainnya.edit",
                          params: { data: JSON.stringify(item) },
                        })
                      }
                      icon="content-save-edit-outline"
                      mode="outlined"
                      textColor={Colors.text_primary}
                      style={styles.editButton}
                    >
                      Edit
                    </Button>
                  </View>
                </View>
              );
            }}
            ListFooterComponent={() => (
              <Pagination
                loading={loadingPelatihan}
                page={pagePelatihan}
                setPage={setPagePelatihan}
                totalPage={totalPagePelatihan}
                horizontal={0}
                bottom={0}
              />
            )}
          />
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(20),
          borderBottomWidth: 1,
          borderBottomColor: Colors.border_primary,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>
          I. Riwayat Pekerjaan / Jabatan Struktural Anda Selama ini
        </Text>

        <Button
          onPress={() => router.navigate("/riwayat-pekerjaan.create")}
          icon="plus"
          mode="contained"
          textColor="black"
          style={{
            paddingVertical: moderateScale(5),
            backgroundColor: Colors.button_secondary,
          }}
        >
          Tambah Data
        </Button>

        <View style={{ flex: 1 }}>
          <FlashList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            data={pekerjaan?.riwayatPekerjaanUser.items}
            estimatedItemSize={200}
            renderItem={({ item, index }) => {
              const length = pekerjaan?.riwayatPekerjaanUser.items.length ?? 0;
              return (
                <View
                  key={item.id}
                  style={{
                    borderBottomWidth: length - 1 === index ? 0 : 1,
                    borderBottomColor: Colors.border_primary,
                    marginBottom: length - 1 === index ? 0 : moderateScale(10),
                  }}
                >
                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Jabatan</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {item.jabatan_table.name}
                    </Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Unit Kerja</Text>
                    <Text style={{ fontWeight: "bold" }}>{item.uke.name}</Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>TMT Jabatan</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {new Date(item.tmt_jabatan).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Keterangan</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {item.keterangan === " " ? "-" : item.keterangan}
                    </Text>
                  </View>

                  <View style={styles.actionButtonsContainer}>
                    <Button
                      onPress={() => handleDeleteRiwayatPekerjaan(item.id)}
                      icon="delete"
                      mode="outlined"
                      textColor={Colors.text_primary}
                      style={styles.deleteButton}
                    >
                      Hapus
                    </Button>

                    <Button
                      onPress={() =>
                        router.navigate({
                          pathname: "/riwayat-pekerjaan.edit",
                          params: { data: JSON.stringify(item) },
                        })
                      }
                      icon="content-save-edit-outline"
                      mode="outlined"
                      textColor={Colors.text_primary}
                      style={styles.editButton}
                    >
                      Edit
                    </Button>
                  </View>
                </View>
              );
            }}
            ListFooterComponent={() => (
              <Pagination
                loading={loadingPekerjaan}
                page={pagePekerjaan}
                setPage={setpagePekerjaan}
                totalPage={totalPagePekerjaan}
                horizontal={0}
                bottom={0}
              />
            )}
          />
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(20),
          borderBottomWidth: 1,
          borderBottomColor: Colors.border_primary,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>
          II. Pengalaman saudara melaksanakan kegiatan pendidikan, pengajaran,
          dan pelatihan (Dikjartih/Sosialisasi/Penyuluhan*)
        </Text>

        <Button
          onPress={() => router.navigate("/pelatihan.create")}
          icon="plus"
          mode="contained"
          textColor="black"
          style={{
            paddingVertical: moderateScale(5),
            backgroundColor: Colors.button_secondary,
          }}
        >
          Tambah Data
        </Button>

        <View style={{ flex: 1 }}>
          <FlashList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            data={pengajaran?.pengajaranUser.items}
            estimatedItemSize={200}
            renderItem={({ item, index }) => {
              const length = pengajaran?.pengajaranUser.items.length ?? 0;
              return (
                <View
                  key={item.id}
                  style={{
                    borderBottomWidth: length - 1 === index ? 0 : 1,
                    borderBottomColor: Colors.border_primary,
                    marginBottom: length - 1 === index ? 0 : moderateScale(10),
                  }}
                >
                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Nama Kegiatan</Text>
                    <Text style={{ fontWeight: "bold" }}>{item.kegiatan}</Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Materi</Text>
                    <Text style={{ fontWeight: "bold" }}>{item.materi}</Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Instansi Penyeleggara</Text>
                    <Text style={{ fontWeight: "bold" }}>{item.instansi}</Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Tahun</Text>
                    <Text style={{ fontWeight: "bold" }}>{item.tahun}</Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Sertifikat</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {item.sertifikat_url}
                    </Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>
                      Masa Berlaku Sertifikat
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {parseDateLong(item.expired_sertifikat)}
                    </Text>
                  </View>

                  <View style={styles.actionButtonsContainer}>
                    <Button
                      onPress={() => handleDeletePelatihan(item.id)}
                      icon="delete"
                      mode="outlined"
                      textColor={Colors.text_primary}
                      style={styles.deleteButton}
                    >
                      Hapus
                    </Button>

                    <Button
                      onPress={() =>
                        router.navigate({
                          pathname: "/pelatihan.edit",
                          params: { data: JSON.stringify(item) },
                        })
                      }
                      icon="content-save-edit-outline"
                      mode="outlined"
                      textColor={Colors.text_primary}
                      style={styles.editButton}
                    >
                      Edit
                    </Button>
                  </View>
                </View>
              );
            }}
            ListFooterComponent={() => (
              <Pagination
                loading={loadingPengajaran}
                page={pagePengajaran}
                setPage={setPagePengajaran}
                totalPage={totalPagePengajaran}
                horizontal={0}
                bottom={0}
              />
            )}
          />
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(20),
          borderBottomWidth: 1,
          borderBottomColor: Colors.border_primary,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>
          III. Daftar karya tulis ilmiah/jurnal yang pernah Saudara
          buat/diterbitkan (apabila ada)
        </Text>

        <Button
          onPress={() => router.navigate("/karya.create")}
          icon="plus"
          mode="contained"
          textColor="black"
          style={{
            paddingVertical: moderateScale(5),
            backgroundColor: Colors.button_secondary,
          }}
        >
          Tambah Data
        </Button>

        <View style={{ flex: 1 }}>
          <FlashList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            data={karya?.karyaTulisUser.items}
            estimatedItemSize={200}
            renderItem={({ item, index }) => {
              const length = pengajaran?.pengajaranUser.items.length ?? 0;
              return (
                <View
                  key={item.id}
                  style={{
                    borderBottomWidth: length - 1 === index ? 0 : 1,
                    borderBottomColor: Colors.border_primary,
                    marginBottom: length - 1 === index ? 0 : moderateScale(10),
                  }}
                >
                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Judul Tulisan</Text>
                    <Text style={{ fontWeight: "bold" }}>{item.judul}</Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>
                      Disampaikan / Dipublikasin pada Seminar / Mahalah / Koran
                      / Website
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>{item.tempat}</Text>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <Text style={{ fontSize: 15 }}>Keterangan</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {item.keterangan}
                    </Text>
                  </View>

                  <View style={styles.actionButtonsContainer}>
                    <Button
                      onPress={() => handleDeleteKarya(item.id)}
                      icon="delete"
                      mode="outlined"
                      textColor={Colors.text_primary}
                      style={styles.deleteButton}
                    >
                      Hapus
                    </Button>

                    <Button
                      onPress={() =>
                        router.navigate({
                          pathname: "/karya.edit",
                          params: { data: JSON.stringify(item) },
                        })
                      }
                      icon="content-save-edit-outline"
                      mode="outlined"
                      textColor={Colors.text_primary}
                      style={styles.editButton}
                    >
                      Edit
                    </Button>
                  </View>
                </View>
              );
            }}
            ListFooterComponent={() => (
              <Pagination
                loading={loadingKarya}
                page={pageKarya}
                setPage={setPageKarya}
                totalPage={totalPageKarya}
                horizontal={0}
                bottom={0}
              />
            )}
          />
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: moderateScale(20),
          paddingVertical: moderateScale(20),
          gap: moderateScale(25),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: moderateScale(10),
            alignItems: "center",
          }}
        >
          <Checkbox.Android
            onPress={() => setChecked(!checked)}
            status={checked ? "checked" : "unchecked"}
            color={Colors.text_primary}
          />

          <Text style={{ paddingRight: moderateScale(40) }}>
            Dengan ini menyatakan bahwa data yang saya isikan adalah benar
            adanya. Jika kemudian ini diketemukan kesalahan yang disengaja/
            pemalsuan data maka saya bersedia menerima konsekuensinya
          </Text>
        </View>

        <Button
          onPress={() => {
            Dialog.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Berhasil",
              textBody: "Data Kompetensi Berhasil Disimpan",
              button: "Tutup",
            });
          }}
          icon={"content-save-outline"}
          mode="contained"
          textColor="black"
          style={{
            backgroundColor: Colors.button_secondary,
            paddingVertical: moderateScale(5),
          }}
        >
          Simpan
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: "row",
    gap: moderateScale(10),
    marginTop: moderateScale(12),
    marginBottom: moderateScale(20),
  },
  deleteButton: {
    flex: 1,
    borderColor: Colors.text_red,
  },
  editButton: {
    flex: 1,
    borderColor: "#2279C9",
  },
});
