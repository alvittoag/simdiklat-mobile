import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale, scale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { homeRouters } from "@/constants/routers";
import ButtonOpacity from "@/components/elements/ButtonOpacity";
import assets from "@/assets";
import { Href, router } from "expo-router";
import { useQuery } from "@apollo/client";
import { IProfilePeserta } from "@/type";
import { getProfilePeserta } from "@/services/query/getProfilePeserta";
import useSession from "@/hooks/useSession";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HalamanUtama() {
  const { data, loading } = useQuery<{
    profilPesertaDiklat: IProfilePeserta;
  }>(getProfilePeserta);

  return (
    <ContainerBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: moderateScale(30),
          gap: moderateScale(20),
        }}
      >
        <View style={{ paddingHorizontal: moderateScale(15) }}>
          <View
            style={{
              backgroundColor: "#F8F8F8",
              paddingVertical: moderateScale(10),
              paddingHorizontal: moderateScale(10),
              height: scale(120),
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              borderRadius: 20,
              elevation: 3,
              borderWidth: Platform.OS === "ios" ? 1 : 0,
              borderColor: "rgba(158, 150, 150, .5)",
            }}
          >
            {loading ? (
              <ActivityIndicator size={"large"} color={Colors.primary} />
            ) : (
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 17,
                  }}
                >
                  Total JP Anda
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 17,
                    color: Colors.text_red,
                  }}
                >
                  {data?.profilPesertaDiklat.jp}
                </Text>
              </TouchableOpacity>
            )}

            <View
              style={{
                backgroundColor: "rgba(158, 150, 150, .5)",
                width: 1,
                height: 115,
              }}
            />

            {loading ? (
              <ActivityIndicator size={"large"} color={Colors.primary} />
            ) : (
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 17,
                  }}
                >
                  Total IP ASN
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 17,
                    color: Colors.text_red,
                  }}
                >
                  {data?.profilPesertaDiklat.skor_ipasn} / 40
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ paddingHorizontal: moderateScale(9) }}>
          <View
            style={{
              gap: moderateScale(25),
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                paddingHorizontal: moderateScale(10),
              }}
            >
              MENU
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: moderateScale(10),
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {homeRouters.map((route) => (
                <TouchableOpacity
                  key={route.name}
                  onPress={() => router.push(route.path as Href<string>)}
                  style={{
                    borderWidth: 1.5,
                    paddingHorizontal: moderateScale(15),
                    paddingVertical: moderateScale(20),
                    borderRadius: 20,
                    borderColor: Colors.button_primary,
                    width: "30%",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    gap: moderateScale(5),
                  }}
                >
                  <Image
                    resizeMode="center"
                    source={route.icon}
                    style={{ height: 20, width: 20 }}
                  />

                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: 400,
                      fontSize: 12,
                    }}
                  >
                    {route.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={{ gap: moderateScale(25) }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              paddingHorizontal: moderateScale(15),
            }}
          >
            Podcast Yang Akan Datang
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: moderateScale(20),
              paddingHorizontal: moderateScale(15),
            }}
          >
            <View
              style={{
                padding: moderateScale(20),
                backgroundColor: "#F8F8F8",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "rgba(158, 150, 150, .5)",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                Podcast Rabu Belajar
              </Text>

              <Image
                source={assets.podasct}
                resizeMode="contain"
                style={{ height: 110, width: 200 }}
              />
              <ButtonOpacity
                bgcolor={Colors.button_primary}
                textcolor={Colors.text_white}
                textweight="bold"
                vertical={15}
                textsize={15}
              >
                Tonton Di Sini
              </ButtonOpacity>
            </View>

            <View
              style={{
                padding: moderateScale(20),
                backgroundColor: "#F8F8F8",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "rgba(158, 150, 150, .5)",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                Podcast Rabu Belajar
              </Text>

              <Image
                source={assets.podasct}
                resizeMode="contain"
                style={{ height: 110, width: 200 }}
              />
              <ButtonOpacity
                bgcolor={Colors.button_primary}
                textcolor={Colors.text_white}
                textweight="bold"
                vertical={15}
                textsize={15}
              >
                Tonton Di Sini
              </ButtonOpacity>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </ContainerBackground>
  );
}
