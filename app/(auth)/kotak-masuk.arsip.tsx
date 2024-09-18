import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { moderateScale } from "react-native-size-matters";
import ContainerBackground from "@/components/container/ContainerBackground";
import Pagination from "@/components/sections/pagination";
import { getKotakMasuk } from "@/services/query/get-kotak-masuk";
import useDebounce from "@/hooks/useDebounce";
import { IKotakMasuk } from "@/type";
import { useQuery } from "@apollo/client";
import Error from "@/components/elements/Error";
import { Avatar, Menu, TextInput } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { parseDateLong } from "@/lib/parseDate";
import Loading from "@/components/elements/Loading";
import NotFoundSearch from "@/components/sections/NotFoundSearch";
import { Colors } from "@/constants/Colors";
import { router, useNavigation } from "expo-router";
import assets from "@/assets";
import AppHeaderNav from "@/components/AppHeaderNav";

export default function KotakMasukArsip() {
  const [search, setSearch] = React.useState("");

  const debouncedSearch = useDebounce(search, 1000);

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const { data, loading, error } = useQuery<{
    messageInbox: { items: IKotakMasuk[]; total: number; hasMore: boolean };
  }>(getKotakMasuk, {
    variables: {
      page: page,
      limit: limit,
      search: debouncedSearch,
      isArchive: true,
    },
  });

  const totalPage = data ? Math.ceil(data?.messageInbox.total / limit) : 1;

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

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

  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (error) return <Error />;
  return (
    <ContainerBackground>
      <AppHeaderNav title="Arsip" />
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

          <TouchableOpacity onPress={() => router.push("/kotak-masuk.keluar")}>
            <Image
              source={assets.share_kotak_masuk}
              style={{ width: 55, height: 55 }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
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
              renderItem={({ item, index }) => (
                <View
                  style={{
                    backgroundColor: "#F3F3F3",
                    padding: moderateScale(20),
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
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: moderateScale(15),
                      }}
                    >
                      <Avatar.Text size={50} label="AG" />

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
                  </View>

                  <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchorPosition="bottom"
                    contentStyle={{ backgroundColor: "white" }}
                    anchor={
                      <TouchableOpacity onPress={openMenu}>
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
                      onPress={() => {}}
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
