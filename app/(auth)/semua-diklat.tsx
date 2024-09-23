import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Linking,
} from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { Button, Dialog, Portal, RadioButton } from "react-native-paper";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import ContainerCard from "@/components/container/ContainerCard";
import { getDiklat } from "@/services/query/get-diklat";
import { ISedangDiikuti } from "@/type";
import { useQuery } from "@apollo/client";
import Pagination from "@/components/sections/pagination";
import Error from "@/components/elements/Error";
import useDebounce from "@/hooks/useDebounce";
import SearchBar from "@/components/sections/SearchBar";
import Loading from "@/components/elements/Loading";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import { FlashList } from "@shopify/flash-list";
import { parseDateLong } from "@/lib/parseDate";
import { router } from "expo-router";

export default function SemuaDiklat() {
  const [search, setSearch] = React.useState("");
  const [filter, setfilter] = React.useState("DESC");
  const [terapkan, setTerapkan] = React.useState<any>({
    sortDirection: filter,
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
      tipe: "",
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

  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = React.useState("status");

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
  return (
    <ContainerBackground>
      <SearchBar
        handleSearchChange={handleSearchChange}
        search={search}
        showDialog={showDialog}
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
                title={item.jadwal_diklat?.diklat.jenis_diklat.name}
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
                      {item.jadwal_diklat?.diklat.name}
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
                      {parseDateLong(item.jadwal_diklat?.jadwal_mulai)} s/d{" "}
                      {parseDateLong(item.jadwal_diklat?.jadwal_selesai)}
                    </Text>
                  </View>

                  <View style={{ gap: 5 }}>
                    <Text style={{ fontSize: 16 }}>Lokasi Diklat</Text>
                    <Text
                      style={{
                        color: Colors.text_primary,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {item.jadwal_diklat?.lokasi_diklat?.name ?? "-"}
                    </Text>
                  </View>
                </View>

                <View style={{ gap: 12, flexDirection: "row" }}>
                  <Button
                    onPress={() =>
                      router.navigate({
                        pathname: "/semua-diklat.detail",
                        params: { id: item.jadwal_diklat.id },
                      })
                    }
                    icon={"eye"}
                    mode="contained"
                    textColor="white"
                    style={{
                      backgroundColor: Colors.button_primary,
                      paddingVertical: 6,
                      flex: 1,
                      borderRadius: 7,
                    }}
                  >
                    Detail
                  </Button>

                  {item.sertifikat_signed !== 0 && (
                    <Button
                      onPress={() =>
                        Linking.openURL(
                          `https://simdiklat-bpsdm.jakarta.go.id/sim-diklat/sertifikat/peserta-download-tte/${item.id}`
                        )
                      }
                      mode="contained"
                      icon={"download"}
                      textColor="white"
                      style={{
                        backgroundColor: Colors.primary,
                        paddingVertical: 6,
                        flex: 1,
                        borderRadius: 7,
                      }}
                    >
                      Sertifikat
                    </Button>
                  )}
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
