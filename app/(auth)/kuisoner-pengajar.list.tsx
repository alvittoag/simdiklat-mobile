import { RefreshControl, Text, View } from "react-native";
import React from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import ContainerBackground from "@/components/container/ContainerBackground";
import AppHeader from "@/components/AppHeader";
import { IKuisionerPengajar, IKuisonerPenyelenggarList } from "@/type";
import { useQuery } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import { FlashList } from "@shopify/flash-list";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { Button, Portal, Dialog as DL, RadioButton } from "react-native-paper";
import Pagination from "@/components/sections/pagination";
import useDebounce from "@/hooks/useDebounce";
import SearchBar from "@/components/sections/SearchBar";
import AppHeaderNav from "@/components/AppHeaderNav";

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export interface KuisonerResponse {
  status: "success" | "error";
  message: string;
  data: { data: IKuisonerPenyelenggarList[]; meta: Meta };
}

export default function KuisonerPengajarList() {
  const params = useLocalSearchParams<any>();

  const dataParams: IKuisionerPengajar = React.useMemo(() => {
    try {
      return JSON.parse(params?.data as string);
    } catch (error) {
      console.error("Error parsing params data:", error);
      return {} as IKuisionerPengajar;
    }
  }, [params]);

  const navigation = useNavigation();

  const [search, setSearch] = React.useState("");
  const [filter, setfilter] = React.useState("DESC");
  const [terapkan, setTerapkan] = React.useState<any>({
    sortDirection: filter,
  });

  const debouncedSearch = useDebounce(search, 1000);

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [
      "getKuisonerPengajar",
      debouncedSearch,
      page,
      limit,
      params,
      terapkan.sortDirection,
    ],
    queryFn: async () => {
      const res = await axiosService.get<KuisonerResponse>(
        `/api/kuisoner/pengajar/${dataParams.jadwal_diklat.id}?page=${page}&limit=${limit}&order=${terapkan.sortDirection}&search=${debouncedSearch}`
      );

      return res.data;
    },
  });

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
        totalPage={data?.data?.meta.totalPages as number}
      />
    ),
    [isPending, page, setPage, dataParams?.jadwal_diklat.id]
  );

  if (isError) return <Error />;
  return (
    <ContainerBackground>
      <AppHeaderNav title={dataParams?.jadwal_diklat?.diklat?.name} />

      <View style={{ paddingHorizontal: 15, paddingTop: 20 }}>
        <View
          style={{
            backgroundColor: "white",
            paddingHorizontal: 30,
            paddingVertical: 20,
            borderWidth: 1,
            borderColor: Colors.border_primary,
            borderRadius: 7,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 17, fontWeight: 500 }}>
            Daftar Pengajar
          </Text>
        </View>
      </View>

      <SearchBar
        handleSearchChange={setSearch}
        search={search}
        showSortDialog={showDialog}
        showFilter
      />

      {isPending ? (
        <Loading />
      ) : data?.data?.data.length === 0 ? (
        <NotFoundSearch />
      ) : (
        <FlashList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={data.data.data}
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
                  Tanggal
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {new Date(item.tanggal).toLocaleDateString("id-ID")}
                </Text>
              </View>

              <View>
                <Text style={{ color: Colors.text_secondary, fontSize: 15 }}>
                  Jam
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {new Date(item.tanggal).toLocaleTimeString("id-ID")}
                </Text>
              </View>

              <View>
                <Text style={{ color: Colors.text_secondary, fontSize: 15 }}>
                  Materi
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {item.mata_diklat.name}
                </Text>
              </View>

              <View>
                <Text style={{ color: Colors.text_secondary, fontSize: 15 }}>
                  Pengajar
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {item.user.full_name}
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
                    color: item.status !== 0 ? "green" : "red",
                  }}
                >
                  {item.status !== 0 ? "Sudah Input" : "Belum Input"}
                </Text>
              </View>

              {item.status === 0 && (
                <Button
                  onPress={() =>
                    router.push({
                      pathname: "/kuisoner-pengajar.detail",
                      params: {
                        data: JSON.stringify(item),
                        peserta_id: dataParams.id,
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
              )}
            </View>
          )}
          ListFooterComponent={ListFooter}
        />
      )}

      <Portal>
        <DL
          visible={visible}
          onDismiss={hideDialog}
          style={{ backgroundColor: "white" }}
        >
          <DL.Title style={{ color: Colors.text_primary }}>
            Filter Berdasarkan
          </DL.Title>
          <DL.Content>
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
          </DL.Content>
          <DL.Actions>
            <Button
              onPress={hideDialog}
              textColor="black"
              mode="contained"
              style={{ backgroundColor: Colors.button_secondary, flexGrow: 1 }}
            >
              Terapkan
            </Button>
          </DL.Actions>
        </DL>
      </Portal>
    </ContainerBackground>
  );
}
