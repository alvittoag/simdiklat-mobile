import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import YoutubePlayer from "react-native-youtube-iframe";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function PodcastPerangkatDaerahDetail() {
  const params = useLocalSearchParams<any>();

  console.log(params.id);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const onReady = () => setLoading(false);
  const onError = (e: any) => setError("Terjadi kesalahan saat memuat video");

  return (
    <ContainerBackground>
      <View
        style={{
          backgroundColor: "#DFEFD8",
          paddingHorizontal: 15,
          paddingVertical: 20,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.border_primary,
        }}
      >
        <Text style={{ fontWeight: 400, fontSize: 15 }}>
          Success : Anda telah terdaftar di Podcast Rabu Belajar tersebut
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(30),
        }}
      >
        {loading && <Loading />}

        <YoutubePlayer
          height={300}
          play={true}
          videoId={params.id}
          onReady={onReady}
          onError={onError}
          mute={false}
        />
      </View>
    </ContainerBackground>
  );
}
