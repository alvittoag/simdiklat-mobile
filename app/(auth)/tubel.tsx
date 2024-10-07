import { View, Text, FlatList } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import SearchBar from "@/components/sections/SearchBar";
import { Colors } from "@/constants/Colors";
import { Button, Dialog, Portal, RadioButton } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { IDiklat, IKurikulum, ITubel } from "@/type";
import { useQuery } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import Loading from "@/components/elements/Loading";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import Error from "@/components/elements/Error";
import Pagination from "@/components/sections/pagination";
import { FlashList } from "@shopify/flash-list";
import useDebounce from "@/hooks/useDebounce";
import { parseDateLong } from "@/lib/parseDate";
import { moderateScale } from "react-native-size-matters";

type response = {
  status: string;
  message: string;
  data: {
    filtered: ITubel[];
    meta: {
      total: number;
      limit: number;
      page: number;
      totalPages: number;
    };
  };
};

export default function Tubel() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

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

  const { data, isPending, isError } = useQuery({
    queryKey: ["tubel", page, limit, debouncedSearch, terapkan],

    queryFn: async () => {
      const { data } = await axiosService.get<response>(
        `/api/tubel/list?page=${page}&limit=${limit}&order=${terapkan.sortDirection}&search=${debouncedSearch}`
      );

      return data;
    },
  });

  const handleSearchChange = React.useCallback((text: string) => {
    setSearch(text);
  }, []);

  const hideShowFilter = () => {
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
        handleSearchChange={handleSearchChange}
        search={search}
        showDialog={() => setShowFilter(true)}
        showSortDialog={() => setShowSort(true)}
        showSort
        showFilter
      />

      {isPending ? (
        <Loading />
      ) : data.data.filtered?.length === 0 ? (
        <NotFoundSearch />
      ) : (
        <FlashList
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
          data={data?.data.filtered}
          renderItem={({ item, index }) => (
            <View
              style={{
                marginHorizontal: 15,
                marginTop: index === 0 ? moderateScale(20) : 0,
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
                <Text>Pendidikan Tubel</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item.prodi.jenjang.jenjang} ({item.prodi.jenjang.nama}),{" "}
                  {item.prodi.universitas.nama}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Angkatan</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item.tahun}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Tanggal Mulai</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {parseDateLong(item.mulai)}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Tanggal Selesai</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {parseDateLong(item.selesai)}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Total Bantuan Biaya</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    maximumSignificantDigits: 10,
                    currency: "IDR",
                  }).format(item.biaya.qty)}
                </Text>
              </View>

              <View style={{ gap: 3 }}>
                <Text>Jenis Pembiayaan</Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {item.jenis_biaya.nama}
                </Text>
              </View>

              <Button
                onPress={() =>
                  router.push({
                    pathname: "/tubel.laporan",
                    params: { id: item.id, item: JSON.stringify(item) },
                  })
                }
                icon={"eye"}
                mode="contained"
                textColor="white"
                style={{
                  backgroundColor: Colors.button_primary,
                  borderRadius: 7,
                  paddingVertical: 5,
                }}
              >
                Lihat
              </Button>
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
                    status={searchBy === "un.name" ? "checked" : "unchecked"}
                    value="un.name"
                    color={Colors.border_input_active}
                    uncheckedColor="black"
                  />
                  <Text>Nama Universitas</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    status={
                      searchBy === "tubel.tahun" ? "checked" : "unchecked"
                    }
                    value="tubel.tahun"
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
                    value="j.nama"
                    status={searchBy === "j.nama" ? "checked" : "unchecked"}
                    color={Colors.border_input_active}
                    uncheckedColor="black"
                  />
                  <Text>Jenis Pembiayaaan</Text>
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
      </Portal>
    </ContainerBackground>
  );
}
