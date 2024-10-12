import { View, Text, Image, Linking, FlatList } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import AppHeader from "@/components/AppHeader";
import SearchBar from "@/components/sections/SearchBar";
import { moderateScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { Button, Dialog as DL, Portal, RadioButton } from "react-native-paper";
import { router } from "expo-router";
import useDebounce from "@/hooks/useDebounce";
import Pagination from "@/components/sections/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import Error from "@/components/elements/Error";
import { IPodcast } from "@/type";
import { parseDateLong } from "@/lib/parseDate";
import { FlashList } from "@shopify/flash-list";
import Loading from "@/components/elements/Loading";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

type response = {
  status: string;
  message: string;
  data: {
    data: IPodcast[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export default function PodcastPerangkatDaerahList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [searchBy, setSearchBy] = React.useState("");
  const [showFilter, setShowFilter] = React.useState(false);
  const [terapkan, setTerapkan] = React.useState<any>({
    searchBy: "",
  });
  const [dataShow, setDataShow] = React.useState<IPodcast | null>(null);

  const debouncedSearch = useDebounce(search, 1000);

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { data, isPending, error } = useQuery<response>({
    queryKey: [
      "podcastPerangkatDaerah",
      debouncedSearch,
      page,
      limit,
      terapkan.searchBy,
    ],
    queryFn: async () => {
      const res = await axiosService.get(
        `/api/podcast?page=${page}&limit=${limit}&search=${debouncedSearch}&orderBy=${terapkan.searchBy}`
      );

      return res.data;
    },
  });

  const { mutate, isPending: isPendingMutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosService.post("/api/podcast/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: `Berhasil Mendaftar Podcast ${dataShow?.title}`,
        button: "Tutup",
      });
      queryClient.invalidateQueries({
        queryKey: ["podcastPerangkatDaerah"],
      });
      queryClient.invalidateQueries({
        queryKey: ["podcast-newest"],
      });
    },

    onError: (e) => {
      console.error(e);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Gagal Mengikuti Podcast Rabu Belajar",
        button: "Tutup",
      });
    },
  });

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

  const ListFooter = React.useMemo(
    () => (
      <Pagination
        loading={isPending}
        page={page}
        setPage={setPage}
        totalPage={data?.data.meta.totalPages || 1}
      />
    ),
    [isPending, page, setPage, data?.data.meta.totalPages]
  );

  const handleRegisterDiklat = async (item: IPodcast) => {
    const formData = new FormData();
    formData.append("jadwal_diklat_id", item.jadwal_diklat.id as any);
    formData.append("diklat_id", item.jadwal_diklat.diklat_id as any);

    mutate(formData);

    setDataShow(item);
  };

  if (error) return <Error />;

  return (
    <ContainerBackground>
      <SearchBar
        handleSearchChange={handleSearchChange}
        showDialog={() => setShowFilter(true)}
        search={search}
        showSort
      />

      {isPending ? (
        <Loading />
      ) : data.data.data.length === 0 ? (
        <NotFoundSearch />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data?.data.data}
          renderItem={({ item }) => (
            <View
              style={{
                marginHorizontal: moderateScale(15),
                marginVertical: moderateScale(15),
                backgroundColor: "white",
                padding: moderateScale(15),
                borderWidth: 1,
                borderColor: Colors.border_primary,
                borderRadius: 7,
                gap: moderateScale(15),
              }}
            >
              <View style={{ gap: moderateScale(3) }}>
                <Text style={{ color: Colors.text_secondary }}>Episode</Text>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: Colors.text_primary,
                  }}
                >
                  {item.jadwal_diklat.name}
                </Text>
              </View>

              <View style={{ gap: moderateScale(3) }}>
                <Text style={{ color: Colors.text_secondary }}>Tema</Text>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: Colors.text_primary,
                  }}
                >
                  {item.title}
                </Text>
              </View>

              <View style={{ gap: moderateScale(3) }}>
                <Text style={{ color: Colors.text_secondary }}>Jadwal</Text>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: Colors.text_primary,
                  }}
                >
                  {parseDateLong(item.jadwal_diklat.jadwal_mulai)}{" "}
                  {parseDateString(item.jadwal_diklat.jadwal_mulai).waktu} -{" "}
                  {parseDateString(item.jadwal_diklat.jadwal_selesai).waktu}
                </Text>
              </View>

              <View style={{ gap: moderateScale(20) }}>
                <Text style={{ color: Colors.text_secondary }}>Thumbnail</Text>

                <Image
                  source={{ uri: item.thumbnail }}
                  style={{
                    height: 180,
                    width: "100%",
                    borderRadius: 7,
                    backgroundColor: Colors.border_primary,
                    borderWidth: 0.5,
                    borderColor: Colors.border_primary,
                  }}
                  resizeMode="cover"
                />
              </View>

              <View style={{ flexDirection: "row", gap: moderateScale(10) }}>
                {item.isRegisterd ? (
                  <Button
                    onPress={() =>
                      router.navigate({
                        pathname: "/podcast-perangkat-daerah.detail",
                        params: { id: item.watch_id },
                      })
                    }
                    icon={"play"}
                    textColor="black"
                    mode="contained"
                    style={{
                      flex: 1,
                      backgroundColor: Colors.button_secondary,
                      borderRadius: 7,
                      paddingVertical: 6,
                    }}
                  >
                    Lihat
                  </Button>
                ) : (
                  <Button
                    onPress={() => handleRegisterDiklat(item)}
                    disabled={isPendingMutate}
                    loading={isPendingMutate}
                    icon={"login"}
                    textColor="white"
                    mode="contained"
                    style={{
                      flex: 1,
                      backgroundColor: Colors.button_primary,
                      borderRadius: 7,
                      paddingVertical: 6,
                    }}
                  >
                    Ikuti
                  </Button>
                )}

                {item.sertifikat && (
                  <Button
                    onPress={() => Linking.openURL(item.sertifikat)}
                    icon={"download"}
                    mode="contained"
                    textColor="white"
                    style={{
                      flex: 1,
                      backgroundColor: Colors.primary,
                      borderRadius: 7,
                      paddingVertical: 6,
                    }}
                  >
                    Sertifikat
                  </Button>
                )}
              </View>
            </View>
          )}
          ListFooterComponent={ListFooter}
        />
      )}

      <Portal>
        {showFilter && (
          <DL
            visible={showFilter}
            onDismiss={hideShowFilter}
            style={{ backgroundColor: "white" }}
          >
            <DL.Title style={{ color: Colors.text_primary }}>
              Filter Berdasarkan
            </DL.Title>

            <DL.Content>
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
                  <Text>Tema</Text>
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
                  <Text>Episode</Text>
                </View>
              </RadioButton.Group>
            </DL.Content>

            <DL.Actions>
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
            </DL.Actions>
          </DL>
        )}
      </Portal>
    </ContainerBackground>
  );
}

export function parseDateString(dateString: any) {
  // Buat objek Date dari string input
  const date = new Date(dateString);

  // Format tanggal dalam bahasa Indonesia (DD MMMM YYYY)
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  // Format waktu dalam bahasa Indonesia (HH.MM)
  const formattedTime = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return {
    tanggal: formattedDate,
    waktu: formattedTime,
  };
}
