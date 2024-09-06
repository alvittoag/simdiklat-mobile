import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
  RefreshControl,
} from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import { Avatar, Menu, TextInput } from "react-native-paper";
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
import Pagination from "@/components/sections/pagination";
import { router } from "expo-router";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

export default function KotakMasuk() {
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
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
    },
  });

  const totalPage = data ? Math.ceil(data?.messageInbox.total / limit) : 1;

  const openMenu = (index: number) => {
    setVisibleMenuIndex(index);
  };

  const deletePesan = async (id: number) => {
    console.log(id);
    try {
      await axiosService.delete("/api/message/delete-message", {
        data: {
          id,
        },
      });

      refetch();
    } catch (error) {
      console.log(error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal Menghapus",
        textBody: "Pesan Gagal Dihapus",
        button: "Tutup",
      });
    }
  };

  const closeMenu = () => {
    setVisibleMenuIndex(null);
  };

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
          style={{ flexDirection: "row", justifyContent: "center", gap: 15 }}
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

          <TouchableOpacity onPress={() => router.push("/kotak-masuk.keluar")}>
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
                    visible={visibleMenuIndex === index}
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
                        fontWeight: 500,
                        color: Colors.text_primary,
                      }}
                      onPress={() => {
                        closeMenu();
                        router.push({
                          pathname: "/kotak-masuk.pesan",
                          params: {
                            dari: item.sender.full_name,
                            subjek: item.subject,
                            pesan: item.message,
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
                      onPress={() => {}}
                      title="Pindahkan Ke Arsip"
                    />

                    <Menu.Item
                      titleStyle={{
                        fontWeight: 500,
                        color: Colors.text_primary,
                      }}
                      onPress={() => deletePesan(item.id)}
                      title="Hapus"
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
