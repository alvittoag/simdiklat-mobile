import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useCallback } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@apollo/client";
import { getKontakKeluar } from "@/services/query/get-kotak-masuk";
import { IKontakKeluar } from "@/type";
import Error from "@/components/elements/Error";
import { Avatar, Menu, TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import Loading from "@/components/elements/Loading";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import { moderateScale } from "react-native-size-matters";
import { parseDateLong } from "@/lib/parseDate";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import ContainerBackground from "@/components/container/ContainerBackground";
import { useMutation } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import assets from "@/assets";
import AppHeader from "@/components/AppHeader";
import AppHeaderNav from "@/components/AppHeaderNav";

export default function KotakKeluar() {
  const isRefetch = useLocalSearchParams();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);

  const { data, loading, error, refetch, previousData } = useQuery<{
    messageOutbox: {
      items: IKontakKeluar[];
      total: number;
      hasMore: boolean;
    };
  }>(getKontakKeluar, {
    variables: {
      page: page,
      limit: limit,
      search: debouncedSearch,
    },
  });

  console.log(previousData?.messageOutbox.items.length);

  const openMenu = (index: number) => setVisibleIndex(index);
  const closeMenu = () => setVisibleIndex(null);

  const loadMore = () => {
    if (data?.messageOutbox.hasMore && !loading) {
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

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: number) => {
      await axiosService.delete("/api/message/delete-message", {
        data: { id },
      });
    },
    onSuccess: () => {
      refetch();
      closeMenu();

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Pesan Berhasil Dihapus",
        button: "Tutup",
      });
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

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  React.useEffect(() => {
    refetch();
  }, [isRefetch, refetch]);

  if (error) return <Error />;

  const renderItem = useCallback(
    ({ item, index }: { item: IKontakKeluar; index: number }) => (
      <TouchableOpacity
        onPress={() => {
          closeMenu();
          router.push({
            pathname: "/kotak-masuk.keluar.detail",
            params: {
              kepada: item.receiver.map((i) => i.full_name).join(", "),
              subjek: item.subject,
              pesan: item.message,
            },
          });
        }}
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
            flexDirection: "row",
            gap: moderateScale(15),
            alignItems: "center",
          }}
        >
          <Avatar.Text
            size={50}
            label={item.receiver[0].full_name.at(0) as string}
          />
          <View style={{ gap: moderateScale(5) }}>
            <Text style={{ fontWeight: "500", fontSize: 15 }}>
              {item.receiver.map((i) => i.full_name).join(", ")}
            </Text>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 15 }}>{item.subject}</Text>
              <Text style={{ color: Colors.text_secondary, fontSize: 12 }}>
                {parseDateLong(item.created_at)}
              </Text>
            </View>
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
            titleStyle={{ fontWeight: "500", color: Colors.text_primary }}
            onPress={() => {
              closeMenu();
              router.push({
                pathname: "/kotak-masuk.keluar.detail",
                params: {
                  kepada: item.receiver.map((i) => i.full_name).join(", "),
                  subjek: item.subject,
                  pesan: item.message,
                },
              });
            }}
            title="Tampilkan"
          />
          <Menu.Item
            disabled={isPending}
            titleStyle={{ fontWeight: "500", color: Colors.text_primary }}
            onPress={() => handleDelete(item.id)}
            title={isPending ? "Menghapus..." : "Hapus"}
          />
        </Menu>
      </TouchableOpacity>
    ),
    [visibleIndex, isPending]
  );

  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ContainerBackground>
      <AppHeaderNav title="Kotak keluar" />
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          flex: 1,
          paddingTop: moderateScale(20),
          gap: moderateScale(10),
        }}
      >
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 15 }}
        >
          <TouchableOpacity onPress={() => router.push("/kotak-masuk")}>
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

          <TouchableOpacity>
            <Image
              source={assets.share_kotak_masuk}
              style={{ width: 55, height: 55 }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/kotak-masuk.arsip")}>
            <Image
              source={assets.hamburger_kotak_masuk}
              style={{ width: 55, height: 55 }}
            />
          </TouchableOpacity>
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          mode="outlined"
          style={{ backgroundColor: "transparent" }}
          activeOutlineColor={Colors.border_primary}
          outlineStyle={{ borderRadius: 30 }}
          contentStyle={{ color: Colors.text_primary }}
          placeholder="Search"
          placeholderTextColor={Colors.text_secondary}
          outlineColor={Colors.border_primary}
          left={<TextInput.Icon icon="magnify" color={Colors.text_secondary} />}
        />
        <View style={{ flex: 1 }}>
          {loading && page === 1 ? (
            <Loading />
          ) : data?.messageOutbox.items.length === 0 ? (
            <NotFoundSearch />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              data={data?.messageOutbox.items}
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={handleRefresh} />
              }
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              renderItem={renderItem}
            />
          )}
        </View>
      </View>
    </ContainerBackground>
  );
}
