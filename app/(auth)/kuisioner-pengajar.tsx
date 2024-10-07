import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import {
  Button,
  Dialog,
  Divider,
  Portal,
  RadioButton,
  Searchbar,
} from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@apollo/client";
import { IKuisionerPengajar } from "@/type";
import { getKuisonerPengajar } from "@/services/query/get-kuisoner";
import Pagination from "@/components/sections/pagination";
import Error from "@/components/elements/Error";
import { Dropdown } from "react-native-element-dropdown";
import SearchBar from "@/components/sections/SearchBar";
import Loading from "@/components/elements/Loading";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import { FlashList } from "@shopify/flash-list";
import { parseDateLong } from "@/lib/parseDate";
import { router } from "expo-router";

export default function KuisionerPengajar() {
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

  const { data, loading, error, refetch } = useQuery<{
    pesertaDiklats: {
      items: IKuisionerPengajar[];
      total: number;
      hasMore: boolean;
    };
  }>(getKuisonerPengajar, {
    variables: {
      page: page,
      limit: limit,
      q: debouncedSearch,
      sortBy: "a.jadwal_mulai",
      ...terapkan,
    },
  });

  const totalPage = data ? Math.ceil(data?.pesertaDiklats.total / limit) : 1;

  const handleSearchChange = React.useCallback((text: string) => {
    setSearch(text);
  }, []);

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
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => refetch()} />
          }
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: Colors.border_primary,
                borderRadius: 10,
                padding: moderateScale(20),
                gap: moderateScale(15),
                margin: moderateScale(15),
              }}
            >
              <View>
                <Text style={{ color: Colors.text_secondary, fontSize: 15 }}>
                  Kelompok Diklat
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {item.jadwal_diklat.diklat.jenis_diklat.name}
                </Text>
              </View>

              <View>
                <Text style={{ color: Colors.text_secondary, fontSize: 15 }}>
                  Nama Diklat
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {item.jadwal_diklat.diklat.name}
                </Text>
              </View>

              <View>
                <Text style={{ color: Colors.text_secondary, fontSize: 15 }}>
                  Jadwal Pelaksanaan
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Angkatan {item.jadwal_diklat.name}
                </Text>
              </View>

              <View>
                <Text style={{ color: Colors.text_secondary, fontSize: 15 }}>
                  Tanggal Pelaksanaan
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {parseDateLong(item.jadwal_diklat.jadwal_mulai)} s/d{" "}
                  {parseDateLong(item.jadwal_diklat.jadwal_selesai)}
                </Text>
              </View>

              <Button
                onPress={() =>
                  router.push({
                    pathname: "/kuisoner-pengajar.list",
                    params: { data: JSON.stringify(item) },
                  })
                }
                mode="contained"
                icon={"login"}
                textColor="black"
                style={{
                  backgroundColor: Colors.button_secondary,
                  borderRadius: 7,
                  paddingVertical: moderateScale(7),
                }}
              >
                Daftar Evaluasi Pengajar
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
                    status={searchBy === "jd.name" ? "checked" : "unchecked"}
                    value="jd.name"
                    color={Colors.border_input_active}
                    uncheckedColor="black"
                  />
                  <Text>Kelompok Diklat</Text>
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
                    value="a.name"
                    status={searchBy === "a.name" ? "checked" : "unchecked"}
                    color={Colors.border_input_active}
                    uncheckedColor="black"
                  />
                  <Text>Angkatan</Text>
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
