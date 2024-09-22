import React, { useMemo, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {
  ActivityIndicator,
  Image,
  Platform,
  SectionList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { useQuery } from "@apollo/client";
import { Avatar, Button, Dialog, Portal } from "react-native-paper";
import { moderateScale } from "react-native-size-matters";
import { DrawerContentComponentProps } from "@react-navigation/drawer";

import ContainerBackground from "@/components/container/ContainerBackground";
import AppHeaderNav from "@/components/AppHeaderNav";
import AppHeaderAuth from "@/components/AppHeaderAuth";
import AppHeader from "@/components/AppHeader";
import { routers } from "@/constants/routers";
import { Colors } from "@/constants/Colors";
import { getProfilePeserta } from "@/services/query/getProfilePeserta";
import { IProfilePeserta } from "@/type";
import { Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import assets from "@/assets";
import useSession from "@/hooks/useSession";
import Loading from "@/components/elements/Loading";

interface RouteItem {
  name: string;
  path: string;
  icon: ImageSourcePropType;
  title?: string;
  other_routes?: RouteItem[];
}

interface RouteSection {
  title: string | null;
  data: RouteItem[];
}

const DrawerContent: React.FC<DrawerContentComponentProps> = React.memo(
  ({ state, navigation }) => {
    const { data, loading } = useQuery<{
      profilPesertaDiklat: IProfilePeserta;
    }>(getProfilePeserta);

    const [visible, setVisible] = React.useState(false);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    const activeScreen = state.routes[state.index].name;

    const profileSection = useMemo(
      () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("profile")}
          style={styles.profileContainer}
        >
          <Avatar.Text
            size={104}
            label={data?.profilPesertaDiklat.full_name.charAt(0) ?? ""}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.fullName}>
              {data?.profilPesertaDiklat.full_name}
            </Text>
            <Text style={styles.nrk}>
              NRK : {data?.profilPesertaDiklat.nrk}
            </Text>
          </View>
        </TouchableOpacity>
      ),
      [data, navigation]
    );

    const renderRouteItem = useCallback(
      ({ item }: { item: RouteItem }) => {
        const isActive = activeScreen === item.path.replace("/", "");
        return (
          <View style={{ paddingHorizontal: moderateScale(8) }}>
            <TouchableOpacity
              onPress={() => navigation.navigate(item.path.replace("/", ""))}
              style={[styles.routeItem, isActive && styles.activeRouteItem]}
            >
              <Image
                resizeMode="contain"
                source={item.icon}
                style={styles.routeIcon}
              />
              <Text style={styles.routeText}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        );
      },
      [activeScreen, navigation]
    );

    const renderSectionHeader = useCallback(
      ({ section: { title } }: { section: RouteSection }) =>
        title ? <Text style={styles.routeTitle}>{title}</Text> : null,
      []
    );

    const routeSections: any = useMemo(
      () =>
        routers.map((route, index) => ({
          title: index !== 0 ? route.title : null,
          data: route.route,
        })),
      []
    );

    const renderSectionSeparator = useCallback(
      ({ leadingItem }: { leadingItem: any }) =>
        leadingItem ? <View style={styles.sectionSeparator} /> : null,
      []
    );

    const keyExtractor = useCallback((item: RouteItem) => item.path, []);

    const handleLogout = () => {
      hideDialog();
      AsyncStorage.removeItem("session");
      router.replace("/login");
    };

    return (
      <ContainerBackground>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <SectionList
            sections={routeSections}
            renderItem={renderRouteItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={keyExtractor}
            ListHeaderComponent={profileSection}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            SectionSeparatorComponent={renderSectionSeparator}
            ListFooterComponent={() => (
              <>
                <View
                  style={{
                    marginTop: 0,
                    borderBottomWidth: 0.5,
                    borderColor: "#9F9F9F",
                    paddingBottom: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text style={styles.routeTitle}>SETTING</Text>
                  <View style={{ paddingHorizontal: moderateScale(8) }}>
                    <TouchableOpacity
                      onPress={showDialog}
                      style={[styles.routeItem]}
                    >
                      <Image
                        resizeMode="contain"
                        source={assets.tutorial}
                        style={styles.routeIcon}
                      />
                      <Text style={styles.routeText}>
                        Tutorial & Dokumentasi
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{
                    paddingHorizontal: moderateScale(8),
                    marginBottom: 0,
                  }}
                >
                  <TouchableOpacity
                    onPress={showDialog}
                    style={[styles.routeItem]}
                  >
                    <Image
                      resizeMode="contain"
                      source={assets.logout}
                      style={styles.routeIcon}
                    />
                    <Text style={styles.routeText}>Logout</Text>
                  </TouchableOpacity>
                </View>

                <Portal>
                  <Dialog
                    style={{ backgroundColor: "white" }}
                    visible={visible}
                    onDismiss={hideDialog}
                  >
                    <Dialog.Title style={{ color: Colors.text_primary }}>
                      Apakah anda ingin Logout
                    </Dialog.Title>
                    <Dialog.Content style={{ gap: moderateScale(30) }}>
                      <Text>Anda akan keluar penuh terkait Applikasi ini</Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          gap: moderateScale(20),
                        }}
                      >
                        <Button
                          onPress={hideDialog}
                          mode="outlined"
                          textColor="black"
                          style={{
                            flex: 1,
                            paddingVertical: moderateScale(5),
                            borderRadius: 7,
                          }}
                        >
                          Batal
                        </Button>

                        <Button
                          onPress={handleLogout}
                          icon={"logout"}
                          mode="contained"
                          textColor="white"
                          style={{
                            flex: 1,
                            paddingVertical: moderateScale(5),
                            borderRadius: 7,
                            backgroundColor: Colors.text_red,
                          }}
                        >
                          Logout
                        </Button>
                      </View>
                    </Dialog.Content>
                  </Dialog>
                </Portal>
              </>
            )}
          />
        )}
      </ContainerBackground>
    );
  }
);

const DrawerLayout: React.FC = () => {
  const screenOptions = useMemo(
    () => ({
      drawerStyle: {
        borderTopRightRadius: Platform.OS === "android" ? 20 : 0,
        overflow: "hidden",
        width: "80%",
      },
    }),
    []
  );

  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Drawer
        backBehavior="history"
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={screenOptions as any}
      >
        {routers.flatMap((route) =>
          route.route.map((item: any) => (
            <Drawer.Screen
              key={item.path}
              name={item.path.replace("/", "")}
              options={{
                header: () => {
                  const title = item.title ?? item.name;
                  const HeaderComponent =
                    title === "Halaman Utama" ? AppHeaderAuth : AppHeaderNav;
                  return <HeaderComponent title={title} />;
                },
              }}
            />
          ))
        )}
        {routers.flatMap((route) =>
          route.route.flatMap((item: any) =>
            item.other_routes
              ? item.other_routes.map((r: RouteItem) => (
                  <Drawer.Screen
                    key={r.path}
                    name={r.path.replace("/", "")}
                    options={{
                      header: () => <AppHeaderNav title={r.title ?? r.name} />,
                    }}
                  />
                ))
              : []
          )
        )}
      </Drawer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    gap: moderateScale(20),
    paddingTop: moderateScale(60),
    paddingVertical: moderateScale(20),
    borderBottomEndRadius: 20,
    marginBottom: moderateScale(15),
  },
  avatar: { backgroundColor: Colors.white },
  fullName: {
    textAlign: "center",
    color: Colors.text_white,
    fontSize: 17,
    fontWeight: "bold",
  },
  nrk: {
    textAlign: "center",
    color: Colors.white,
    fontSize: 15,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: "rgba(158, 150, 150, .5)",
    marginVertical: moderateScale(10),
    marginBottom: 20,
  },
  routeTitle: {
    fontSize: 17,
    fontWeight: "bold",
    paddingHorizontal: moderateScale(15),
    paddingBottom: moderateScale(10),
  },
  routeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(15),
    padding: moderateScale(15),
    borderRadius: 10,
  },
  activeRouteItem: {
    backgroundColor: "#EEEEEE",
    borderWidth: 1,
    borderColor: "rgba(158, 150, 150, .5)",
  },
  routeIcon: { height: 23, width: 23 },
  routeText: {
    fontSize: 15,
    fontWeight: "500",
  },
});

export default DrawerLayout;
