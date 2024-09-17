import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React from "react";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@apollo/client";
import { getKontakKeluar } from "@/services/query/get-kotak-masuk";
import { IKontakKeluar } from "@/type";
import Pagination from "@/components/sections/pagination";
import Error from "@/components/elements/Error";
import { Avatar, Menu, TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import Loading from "@/components/elements/Loading";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import { moderateScale } from "react-native-size-matters";
import { parseDateLong } from "@/lib/parseDate";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import ContainerBackground from "@/components/container/ContainerBackground";
import { useMutation } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

export default function KotakKeluar() {
  const isRefetch = useLocalSearchParams();
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const { data, loading, error, refetch } = useQuery<{
    messageOutbox: { items: IKontakKeluar[]; total: number; hasMore: boolean };
  }>(getKontakKeluar, {
    variables: {
      page: page,
      limit: limit,
      search: debouncedSearch,
    },
  });

  const totalPage = data ? Math.ceil(data?.messageOutbox.total / limit) : 1;

  const [visibleIndex, setVisibleIndex] = React.useState<number | null>(null);

  const openMenu = (index: number) => setVisibleIndex(index);

  const closeMenu = () => setVisibleIndex(null);

  const ListFooter = React.useMemo(
    () => (
      <Pagination
        horizontal={0}
        loading={loading}
        page={page}
        setPage={setPage}
        totalPage={totalPage}
      />
    ),
    [loading, page, setPage, totalPage]
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: number) => {
      await axiosService.delete("/api/message/delete-message", {
        data: {
          id,
        },
      });
    },
    onSuccess: () => {
      refetch();
      closeMenu();
    },
    onError: (error) => {
      console.log(error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal Menghapus",
        textBody: "Pesan Gagal Dihapus",
        button: "Tutup",
      });
    },
  });

  const handleDelete = (id: number) => {
    mutate(id);
  };

  React.useEffect(() => {
    refetch();
  }, [isRefetch]);

  if (error) return <Error />;

  return (
    <ContainerBackground>
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          flex: 1,
          paddingTop: moderateScale(20),
          gap: moderateScale(10),
        }}
      >
        <View>
          <TextInput
            value={search}
            onChangeText={(e) => setSearch(e)}
            mode="outlined"
            style={{ backgroundColor: "transparent" }}
            activeOutlineColor={Colors.border_primary}
            outlineStyle={{ borderRadius: 30 }}
            contentStyle={{ color: Colors.text_primary }}
            placeholder="Search"
            placeholderTextColor={Colors.text_secondary}
            outlineColor={Colors.border_primary}
            left={
              <TextInput.Icon icon="magnify" color={Colors.text_secondary} />
            }
          />
        </View>

        <View style={{ flex: 1 }}>
          {loading ? (
            <Loading />
          ) : data?.messageOutbox.items.length === 0 ? (
            <NotFoundSearch />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              data={data?.messageOutbox.items}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => refetch()}
                />
              }
              renderItem={({ item, index }) => (
                <View
                  style={{
                    backgroundColor: "#F3F3F3",
                    paddingHorizontal: moderateScale(20),
                    paddingVertical: moderateScale(15),
                    borderRadius: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(158, 150, 150, .5)",
                    marginTop: index === 0 ? moderateScale(10) : 0,
                    marginBottom: moderateScale(25),
                  }}
                >
                  <View
                    style={{
                      gap: moderateScale(10),
                    }}
                  >
                    <Text style={{ fontWeight: "500", fontSize: 15 }}>
                      {item.receiver.map((i) => i.full_name).join(", ")}
                    </Text>

                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 15 }}>{item.subject}</Text>

                      <Text
                        style={{
                          color: Colors.text_secondary,
                          fontSize: 12,
                        }}
                      >
                        {parseDateLong(item.created_at)}
                      </Text>
                    </View>
                  </View>

                  <Menu
                    visible={visibleIndex === index}
                    onDismiss={closeMenu}
                    anchorPosition="bottom"
                    contentStyle={{ backgroundColor: "white" }}
                    anchor={
                      <TouchableOpacity onPress={() => openMenu(index)}>
                        <Feather name="more-vertical" size={25} />
                      </TouchableOpacity>
                    }
                  >
                    <Menu.Item
                      titleStyle={{
                        fontWeight: "500",
                        color: Colors.text_primary,
                      }}
                      onPress={() => {
                        closeMenu();
                        router.push({
                          pathname: "/kotak-masuk.keluar.detail",
                          params: {
                            kepada: item.receiver
                              .map((i) => i.full_name)
                              .join(", "),
                            subjek: item.subject,
                            pesan: item.message,
                          },
                        });
                      }}
                      title="Tampilkan"
                    />

                    <Menu.Item
                      disabled={isPending}
                      titleStyle={{
                        fontWeight: "500",
                        color: Colors.text_primary,
                      }}
                      onPress={() => handleDelete(item.id)}
                      title={isPending ? "Menghapus..." : "Hapus"}
                    />
                  </Menu>
                </View>
              )}
            />
          )}

          {ListFooter}
        </View>
      </View>
    </ContainerBackground>
  );
}
