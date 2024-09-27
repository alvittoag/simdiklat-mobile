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
import { Button } from "react-native-paper";
import Pagination from "@/components/sections/pagination";
import useDebounce from "@/hooks/useDebounce";
import SearchBar from "@/components/sections/SearchBar";

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
  }, [params?.data]);

  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [search, setSearch] = React.useState("");

  const debouncedSearch = useDebounce(search, 1000);

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["getKuisonerPengajar"],
    queryFn: async () => {
      const res = await axiosService.get<KuisonerResponse>(
        `/api/kuisoner/pengajar/3627?page=${page}&limit=${limit}&order=desc&search=${debouncedSearch}`
      );

      return res.data;
    },
  });

  React.useEffect(() => {
    refetch();
  }, [debouncedSearch, page]);

  const ListFooter = React.useMemo(
    () => (
      <Pagination
        loading={isPending}
        page={page}
        setPage={setPage}
        totalPage={data?.data?.meta.totalPages as number}
      />
    ),
    [isPending, page, setPage]
  );

  if (isError) return <Error />;
  return (
    <ContainerBackground>
      <AppHeader title={dataParams.jadwal_diklat.diklat.name} />

      <SearchBar
        handleSearchChange={setSearch}
        search={search}
        showDialog={() => {}}
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
                    color: item.status === "sudah" ? "green" : "red",
                  }}
                >
                  {item.status === "sudah" ? "Sudah Input" : "Belum Input"}
                </Text>
              </View>

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
            </View>
          )}
          ListFooterComponent={ListFooter}
        />
      )}
    </ContainerBackground>
  );
}
