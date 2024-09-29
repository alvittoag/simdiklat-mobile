import { View, Text, FlatList } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import SearchBar from "@/components/sections/SearchBar";
import { Colors } from "@/constants/Colors";
import { Button, Dialog, Portal, RadioButton } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { IDiklat, IKurikulum, ITubel, ITubelLaporan } from "@/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import Loading from "@/components/elements/Loading";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import Error from "@/components/elements/Error";
import Pagination from "@/components/sections/pagination";
import { FlashList } from "@shopify/flash-list";
import useDebounce from "@/hooks/useDebounce";
import { parseDateLong } from "@/lib/parseDate";
import { moderateScale } from "react-native-size-matters";
import { ALERT_TYPE, Dialog as D } from "react-native-alert-notification";

type response = {
  status: string;
  message: string;
  data: {
    manipulate: ITubelLaporan[];
    meta: {
      total: number;
      limit: number;
      page: number;
      totalPages: number;
    };
  };
};

export default function TubelLaporan() {
  const { id, item } = useLocalSearchParams();

  const dataTubel: ITubel = JSON.parse(item as string);

  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [filter, setfilter] = React.useState("DESC");
  const [terapkan, setTerapkan] = React.useState<any>({
    sortDirection: filter,
  });

  const debouncedSearch = useDebounce(search, 1000);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["tubel-laporan", page, limit, debouncedSearch, terapkan],

    queryFn: async () => {
      const { data } = await axiosService.get<response>(
        `/api/tubel/laporan/get/${id}?page=${page}&limit=${limit}&order=${terapkan.sortDirection}&search=${debouncedSearch}`
      );

      return data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async ({
      tubel_laporan_id,
      tubel_file_laporan_id,
    }: {
      tubel_file_laporan_id: number;
      tubel_laporan_id: number;
    }) => {
      return await axiosService.delete("api/tubel/laporan/delete", {
        data: {
          tubel_laporan_id,
          tubel_file_laporan_id,
        },
      });
    },
    onSuccess: () => {
      D.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Laporan Tubel Berhasil Dihapus",
        button: "Tutup",
      });

      refetch();
    },
    onError: () => {
      D.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal ",
        textBody: "Laporan Tubel Gagal Dihapus",
        button: "Tutup",
      });
    },
  });

  const handleDelete = async ({
    tubel_laporan_id,
    tubel_file_laporan_id,
  }: {
    tubel_laporan_id: number;
    tubel_file_laporan_id: number;
  }) => {
    mutate({ tubel_file_laporan_id, tubel_laporan_id });
  };

  const handleSearchChange = React.useCallback((text: string) => {
    setSearch(text);
  }, []);

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setTerapkan((prev: any) => ({
      ...prev,
      sortDirection: filter,
    }));
    setSearch("");
    setPage(1);
    setVisible(false);
  };

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

  if (isError) return <Error />;
  return (
    <ContainerBackground>
      {isPending ? (
        <Loading />
      ) : data.data.manipulate?.length === 0 ? (
        <NotFoundSearch />
      ) : (
        <FlashList
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
          data={data?.data.manipulate}
          ListHeaderComponent={() => (
            <>
              <View
                style={{
                  marginHorizontal: 15,
                  marginVertical: 15,
                  marginBottom: 25,
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: Colors.border_primary,
                  borderRadius: 7,
                  gap: 20,
                }}
              >
                <View style={{ gap: 3 }}>
                  <Text>Pendidikan Tubel</Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {dataTubel.prodi.jenjang.jenjang} (
                    {dataTubel.prodi.jenjang.nama}),{" "}
                    {dataTubel.prodi.universitas.nama}
                  </Text>
                </View>

                <View style={{ gap: 3 }}>
                  <Text>Angkatan</Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {dataTubel.tahun}
                  </Text>
                </View>

                <View style={{ gap: 3 }}>
                  <Text>Tanggal Mulai</Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {parseDateLong(dataTubel.mulai)}
                  </Text>
                </View>

                <View style={{ gap: 3 }}>
                  <Text>Tanggal Selesai</Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {parseDateLong(dataTubel.selesai)}
                  </Text>
                </View>

                <View style={{ gap: 3 }}>
                  <Text>Total Semester</Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {dataTubel.total_semester}
                  </Text>
                </View>

                <View style={{ gap: 3 }}>
                  <Text>Total Bulan</Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {dataTubel.total_bulan}
                  </Text>
                </View>

                <View style={{ gap: 3 }}>
                  <Text>Nomor SK</Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {dataTubel.no_sk}
                  </Text>
                </View>

                <View style={{ gap: 3 }}>
                  <Text>Tanggal SK</Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {parseDateLong(dataTubel.tgl_sk)}
                  </Text>
                </View>

                <View style={{ gap: 3 }}>
                  <Text>Total Bantuan Biaya</Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      maximumSignificantDigits: 10,
                      currency: "IDR",
                    }).format(dataTubel.biaya.qty)}
                  </Text>
                </View>

                <View style={{ gap: 3 }}>
                  <Text>Jenis Pembiayaan</Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {dataTubel.jenis_biaya.nama}
                  </Text>
                </View>
              </View>

              <Button
                onPress={() =>
                  router.push({
                    pathname: "/tubel.add",
                    params: {
                      peserta_id: dataTubel.id,
                      voucher_id: dataTubel.voucher.id,
                      semester: dataTubel.total_semester,
                    },
                  })
                }
                icon={"plus"}
                mode="contained"
                textColor="black"
                style={{
                  backgroundColor: Colors.button_secondary,
                  borderRadius: 7,
                  paddingVertical: 7,
                  marginHorizontal: 15,
                  marginBottom: 25,
                }}
              >
                Tambah Laporan
              </Button>
            </>
          )}
          renderItem={({ item, index }) => (
            <View
              style={{
                marginHorizontal: 15,
                marginBottom: moderateScale(25),
                paddingHorizontal: 15,
                paddingVertical: 20,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: Colors.border_primary,
                borderRadius: 7,
                gap: 20,
              }}
            >
              <View style={{ gap: 3 }}>
                <Text>Judul/Nama File</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item.laporan.nama}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Jenis File</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item.laporan.jenis_file.nama}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Semester</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item.semester}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Tanggal Upload</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {parseDateLong(item.tubel_file.created_at)}
                </Text>
              </View>

              <View style={{ gap: 6 }}>
                <Button
                  onPress={() =>
                    router.push({
                      pathname: "/tubel.edit",
                      params: {
                        item: JSON.stringify(item),
                        semester: dataTubel.total_semester,
                      },
                    })
                  }
                  icon={"file-edit-outline"}
                  mode="contained"
                  textColor="white"
                  style={{
                    backgroundColor: Colors.button_primary,
                    borderRadius: 7,
                    paddingVertical: 5,
                  }}
                >
                  Edit
                </Button>

                <Button
                  onPress={() =>
                    handleDelete({
                      tubel_laporan_id: item.id,
                      tubel_file_laporan_id: item.laporan.id,
                    })
                  }
                  icon={"delete"}
                  mode="contained"
                  textColor="white"
                  style={{
                    backgroundColor: Colors.text_red,
                    borderRadius: 7,
                    paddingVertical: 5,
                  }}
                >
                  Hapus
                </Button>
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
