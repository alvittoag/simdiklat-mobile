import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import YoutubePlayer from "react-native-youtube-iframe";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import { useLocalSearchParams } from "expo-router";

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
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
          gap: moderateScale(30),
        }}
      >
        <View
          style={{
            backgroundColor: "#74F469",
            paddingHorizontal: 15,
            paddingVertical: 15,
            borderRadius: 7,
          }}
        >
          <Text style={{ fontSize: 15, lineHeight: 20 }}>
            Success : Anda telah terdaftar di Podcast Rabu Belajar tersebut
          </Text>
        </View>

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
