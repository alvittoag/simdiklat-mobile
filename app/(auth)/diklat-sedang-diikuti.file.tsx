import { View, Text, FlatList } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import SearchBar from "@/components/sections/SearchBar";
import { Colors } from "@/constants/Colors";
import { Button, Dialog, Portal, RadioButton } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { IDiklat, IFileMateri, IKurikulum, IMataDiklat } from "@/type";
import { useQuery } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import Loading from "@/components/elements/Loading";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import Error from "@/components/elements/Error";
import Pagination from "@/components/sections/pagination";
import { FlashList } from "@shopify/flash-list";
import useDebounce from "@/hooks/useDebounce";

type response = {
  status: string;
  message: string;
  data: {
    file_materi_diklat: {
      file_materi: IFileMateri[];
    };
    meta: {
      total: number;
      limit: number;
      page: number;
      totalPages: number;
    };
  };
};

export default function Kurikulum() {
  const { id, mata_diklat } = useLocalSearchParams();

  const mataDiklat: IMataDiklat = JSON.parse(mata_diklat as string);

  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [filter, setfilter] = React.useState("DESC");
  const [terapkan, setTerapkan] = React.useState<any>({
    sortDirection: filter,
  });

  const debouncedSearch = useDebounce(search, 1000);

  const { data, isPending, isError } = useQuery({
    queryKey: ["file_materi", page, limit, debouncedSearch, terapkan],

    queryFn: async () => {
      const { data } = await axiosService.get<response>(
        `api/kurikulum/file-materi/300?page=${page}&limit=${limit}&order=${terapkan.sortDirection}&search=${debouncedSearch}`
      );

      return data;
    },
  });
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
      <SearchBar
        showFilter
        handleSearchChange={handleSearchChange}
        search={search}
        showDialog={showDialog}
      />

      {isPending ? (
        <Loading />
      ) : data?.data?.file_materi_diklat?.file_materi?.length === 0 ? (
        <NotFoundSearch />
      ) : (
        <FlashList
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
          data={data?.data?.file_materi_diklat?.file_materi}
          ListHeaderComponent={() => (
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
                <Text>Nama</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {mataDiklat.name ?? "-"}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Deskripsi</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {mataDiklat.deskripsi ?? "-"}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Kompetensi Dasar</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {mataDiklat.kompetensi_dasar ?? "-"}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Indikator Keberhasilan </Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {mataDiklat.indikator_keberhasilan ?? "-"}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Petunjuk Pengajar</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {mataDiklat.petunjuk_pengajar ?? "-"}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Keterangan Modul </Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {mataDiklat.keterangan_modul ?? "-"}
                </Text>
              </View>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View
              style={{
                marginHorizontal: 15,
                marginBottom: 5,
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
                <Text>Nama</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item.file_name}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Ukuran</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item.file_size}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Jenis</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item.file_extension}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Keterangan</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item.keterangan ?? "-"}
                </Text>
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
