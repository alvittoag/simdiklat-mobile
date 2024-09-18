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
import { useQuery } from "@apollo/client";
import { getKuisonerPenyelenggara } from "@/services/query/get-kuisoner";
import useDebounce from "@/hooks/useDebounce";
import Pagination from "@/components/sections/pagination";
import Error from "@/components/elements/Error";
import SearchBar from "@/components/sections/SearchBar";
import Loading from "@/components/elements/Loading";
import { IKuisonerPenyelenggara } from "@/type";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import { FlashList } from "@shopify/flash-list";
import { parseDateLong } from "@/lib/parseDate";
import { Dropdown } from "react-native-element-dropdown";
import { router } from "expo-router";

export default function KuisionerPenyelenggara() {
  const [search, setSearch] = React.useState("");
  const [filter, setFilterValue] = React.useState("terbaru");
  const [status, setStatus] = React.useState("");

  const [terapkan, setTerapkan] = React.useState({
    filterDate: { sortBy: "a.jadwal_mulai", sortDirection: "DESC" },
    status: "",
  });

  const debouncedSearch = useDebounce(search, 1000);

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { data, loading, error, refetch } = useQuery<{
    pesertaDiklats: {
      items: IKuisonerPenyelenggara[];
      total: number;
      hasMore: boolean;
    };
  }>(getKuisonerPenyelenggara, {
    variables: {
      page: page,
      limit: limit,
      q: debouncedSearch,
      status: terapkan.status,
      ...terapkan.filterDate,
    },
  });

  const totalPage = data ? Math.ceil(data?.pesertaDiklats.total / limit) : 1;

  const handleSearchChange = React.useCallback((text: string) => {
    setSearch(text);
  }, []);

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const handleFilter = () => {
    setTerapkan(() => ({
      filterDate:
        filter === "terbaru"
          ? { sortBy: "a.jadwal_mulai", sortDirection: "DESC" }
          : { sortBy: "a.jadwal_mulai", sortDirection: "ASC" },
      status,
    }));
    setSearch("");
    setPage(1);
    setVisible(false);
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
        showDialog={showDialog}
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

              <View>
                <Text style={{ color: Colors.text_secondary, fontSize: 15 }}>
                  Sudah Input
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: item.status === "accept" ? "green" : "red",
                  }}
                >
                  {item.status === "accept" ? "Sudah Input" : "Belum Input"}
                </Text>
              </View>

              <Button
                onPress={() =>
                  router.navigate({
                    pathname: "/kuisoner-penyelenggara.detail",
                    params: {
                      id: item.jadwal_diklat.diklat.id,
                      name: item.jadwal_diklat.diklat.name,
                      jadwal_diklat: item.jadwal_diklat.id,
                      peserta_id: item.id,
                      angkatan: item.jadwal_diklat.name,
                    },
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
                Input Kuisoner
              </Button>
            </View>
          )}
          ListFooterComponent={ListFooter}
        />
      )}

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={{ backgroundColor: "white" }}
        >
          <Dialog.Title style={{ color: Colors.text_primary }}>
            Filter Berdasarkan
          </Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(newValue) => setFilterValue(newValue)}
              value={filter}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="terbaru"
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
                  value="terlama"
                  color={Colors.border_input_active}
                  uncheckedColor="black"
                />
                <Text>Data Terlama</Text>
              </View>

              <Dropdown
                value={status}
                onChange={({ value }) => setStatus(value)}
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderRadius: 7,
                  borderColor: Colors.border_primary,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  marginTop: 10,
                }}
                placeholder="Berdasarkan Status"
                labelField="label"
                valueField="value"
                data={dataStatus}
              />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={handleFilter}
              mode="contained"
              textColor="black"
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

export const dataStatus = [
  { label: "Sudah Input", value: "accept" },
  { label: "Belum Input", value: "pending" },
];
