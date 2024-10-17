import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import { Avatar, IconButton, Menu, TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import assets from "@/assets";
import { useQuery } from "@apollo/client";
import { getKotakMasuk } from "@/services/query/get-kotak-masuk";
import { Feather } from "@expo/vector-icons";
import { IKotakMasuk } from "@/type";
import { parseDateLong } from "@/lib/parseDate";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import useDebounce from "@/hooks/useDebounce";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { useMutation } from "@tanstack/react-query";
import { useIsFocused } from "@react-navigation/native";

export default function KotakMasuk() {
  const isRefetch = useLocalSearchParams();
  const isFocused = useIsFocused();

  const [search, setSearch] = React.useState("");
  const [loadingDelete, setLoadingDelete] = React.useState(false);
  const debouncedSearch = useDebounce(search, 1000);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [visibleMenuIndex, setVisibleMenuIndex] = React.useState<number | null>(
    null
  );

  const { data, loading, error, refetch } = useQuery<{
    messageInbox: { items: IKotakMasuk[]; total: number; hasMore: boolean };
  }>(getKotakMasuk, {
    variables: {
      page: page,
      limit: limit,
      search: debouncedSearch,
      isArchive: false,
    },
  });

  const mutationArsip = useMutation({
    mutationFn: async (id: number) => {
      await axiosService.put("/api/message/archive", {
        message_id: id,
      });
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Pesan Berhasil Diarsipkan",
        button: "Tutup",
      });

      refetch();

      router.push("/kotak-masuk.arsip");

      closeMenu();
    },
    onError: (err) => {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal Mengarsipkan",
        textBody: "Pesan Gagal Diarsipkan",
        button: "Tutup",
      });

      console.log(err);
    },
  });

  const handleArsip = (id: number) => {
    mutationArsip.mutate(id);
  };

  const openMenu = (index: number) => {
    setVisibleMenuIndex(index);
  };

  const deletePesan = async (id: number) => {
    setLoadingDelete(true);
    try {
      await axiosService.delete("/api/message/delete-message", {
        data: {
          id,
        },
      });

      refetch();

      closeMenu();

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Pesan Berhasil Dihapus",
        button: "Tutup",
      });
    } catch (error) {
      console.log(error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal Menghapus",
        textBody: "Pesan Gagal Dihapus",
        button: "Tutup",
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  const closeMenu = () => {
    setVisibleMenuIndex(null);
  };

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [isRefetch])
  );

  const loadMore = () => {
    if (data?.messageInbox.hasMore && !loading) {
      setLimit(limit + 10);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  };

  console.log("kotak masuk");

  if (error) return <Error />;

  return (
    <ContainerBackground>
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingTop: moderateScale(20),
          gap: moderateScale(17),
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 15,
            alignItems: "center",
          }}
        >
          <TouchableOpacity>
            <Image
              source={assets.chat_kotak_masuk}
              style={{ width: 55, height: 55 }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/kotak-masuk.create")}>
            <Image
              source={assets.create_kotak_masuk}
              style={{ width: 55, height: 55 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/kotak-masuk.keluar")}
            style={{
              backgroundColor: "#00A5CB",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 100,
              height: 47,
              width: 47,
            }}
          >
            <IconButton icon="message-text-clock-outline" iconColor={"white"} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/kotak-masuk.arsip")}
            style={{
              backgroundColor: "#79BC33",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 100,
              height: 47,
              width: 47,
            }}
          >
            <IconButton icon="message-bookmark" iconColor={"white"} />
          </TouchableOpacity>
        </View>

        <View>
          <TextInput
            value={search}
            onChangeText={(e) => setSearch(e)}
            mode="outlined"
            style={{ backgroundColor: "transparent" }}
            activeOutlineColor={Colors.border_primary}
            outlineStyle={{ borderRadius: 30 }}
            contentStyle={{ color: Colors.text_primary }}
            placeholder="Cari Data..."
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
          ) : data?.messageInbox.items.length === 0 ? (
            <NotFoundSearch />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              data={data?.messageInbox.items}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => {
                    refetch();
                  }}
                />
              }
              onEndReached={loadMore}
              ListFooterComponent={renderFooter}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    closeMenu();
                    router.navigate({
                      pathname: "/kotak-masuk.pesan",
                      params: {
                        id: item.id,
                        user_id: item.sender.id,
                        dari: item.sender.full_name,
                        subjek: item.subject,
                        pesan: item.message,
                        read: item.read_notify,
                      },
                    });
                  }}
                  style={{
                    backgroundColor:
                      item.read_notify === "1" ? "#f5f5f5" : "#B7B7B7",
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
                      flexDirection: "row",
                      gap: moderateScale(15),
                      alignItems: "center",
                    }}
                  >
                    <Avatar.Text
                      size={50}
                      label={item.sender.full_name.at(0) as string}
                    />

                    <View style={{ gap: 5 }}>
                      <View>
                        <Text
                          numberOfLines={1}
                          style={{ fontWeight: "bold", fontSize: 15 }}
                        >
                          {item.sender.full_name}
                        </Text>
                        <Text numberOfLines={1}>{item.subject}</Text>
                      </View>

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
                    visible={visibleMenuIndex === item.id}
                    onDismiss={closeMenu}
                    anchorPosition="bottom"
                    contentStyle={{ backgroundColor: "white" }}
                    anchor={
                      <TouchableOpacity onPress={() => openMenu(item.id)}>
                        <Feather name="more-vertical" size={25} />
                      </TouchableOpacity>
                    }
                  >
                    <Menu.Item
                      titleStyle={{
                        fontWeight: 500,
                        color: Colors.text_primary,
                      }}
                      onPress={() => {
                        closeMenu();
                        router.push({
                          pathname: "/kotak-masuk.pesan",
                          params: {
                            id: item.id,
                            user_id: item.sender.id,
                            dari: item.sender.full_name,
                            subjek: item.subject,
                            pesan: item.message,
                            read: item.read_notify,
                          },
                        });
                      }}
                      title="Buka Pesan"
                    />

                    <Menu.Item
                      titleStyle={{
                        fontWeight: 500,
                        color: Colors.text_primary,
                      }}
                      onPress={() => handleArsip(item.id)}
                      title={
                        mutationArsip.isPending ? "Loading..." : "Arsipkan"
                      }
                    />

                    <Menu.Item
                      titleStyle={{
                        fontWeight: 500,
                        color: Colors.text_primary,
                      }}
                      onPress={() => deletePesan(item.id)}
                      title={loadingDelete ? "Loading..." : "Hapus"}
                    />
                  </Menu>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </ContainerBackground>
  );
}
