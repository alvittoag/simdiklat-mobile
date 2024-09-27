import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Colors } from "@/constants/Colors";
import { Button, Checkbox, TextInput } from "react-native-paper";
import ContainerIndex from "@/components/container/ContainerIndex";
import { axiosService } from "@/services/axiosService";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";

interface DataPekerjaan {
  id: number;
  user_id: number;
  struktur_org: number;
  tanggung_jawab: string;
  motivasi: string;
  kunci_sukses: string;
  kompetensi: string;
  created_at: Date;
  updated_at: Date;
  file: {
    id: number;
    title: string;
    file_path: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    file_extension: string;
    keterangan: string;
    created_at: Date;
    updated_at: Date;
  };
}

export interface Lampiran {
  id: number;
  user_id: number;
  file_id: number;
  jenis_id: number;
  created_at: Date;
  updated_at: Date;
  file: {
    id: number;
    title: string;
    file_path: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    file_extension: string;
    keterangan: string;
    created_at: Date;
    updated_at: Date;
  };
  jenis: {
    id: number;
    name: string;
    active: number;
    keterangan: string;
    created_at: string;
    updated_at: string;
  };
}

interface DataPekerjaanResponse {
  status: "success" | "error";
  message: string;
  data: DataPekerjaan;
}

export interface LampiranResponse {
  status: "success" | "error";
  message: string;
  data: Lampiran[];
}

export default function IsianKhusus() {
  const queryClient = useQueryClient();
  const [isChecked, setIsChecked] = React.useState(false);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["isian-khusus"],
    queryFn: async () => {
      const [response1, response2] = await Promise.all([
        axiosService.get<DataPekerjaanResponse>(
          "/api/isian-khusus/data-pekerjaan/get"
        ),
        axiosService.get<LampiranResponse>("/api/isian-khusus/lampiran/get"),
      ]);

      return {
        pekerjaanData: response1.data,
        lampiran: response2.data,
      };
    },
  });

  const mutationDeleteLampiran = useMutation({
    mutationFn: async (id: number) => {
      return await axiosService.delete("/api/isian-khusus/lampiran/delete", {
        data: {
          id,
        },
      });
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Lampiran Berhasil Dihapus",
        button: "Tutup",
      });
      queryClient.invalidateQueries({ queryKey: ["isian-khusus"] });
    },
    onError: () => {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal ",
        textBody: "Lampiran Gagal Dihapus",
        button: "Tutup",
      });
    },
  });

  const mutationEditPekerjaan = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosService.put(
        "/api/isian-khusus/data-pekerjaan/put",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    onSuccess: () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Pekerjaan Berhasil Di Edit",
        button: "Tutup",
      });
      setIsChecked(false);
      queryClient.invalidateQueries({ queryKey: ["isian-khusus"] });
    },
    onError: (error) => {
      console.error("Error adding pekerjaan:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Pekerjaan Gagal Di Edit",
        button: "Tutup",
      });
    },
  });

  const [dataInput, setDataInput] = React.useState({
    tanggung_jawab: "",
    motivasi: "",
    kunci_sukses: "",
    kompetensi: "",
  });

  const [file, setFile] = React.useState<any>(null);

  const onRefresh = () => {
    refetch();
    setDataInput({
      tanggung_jawab: data?.pekerjaanData?.data.tanggung_jawab as string,
      motivasi: data?.pekerjaanData?.data.motivasi as string,
      kunci_sukses: data?.pekerjaanData?.data.kunci_sukses as string,
      kompetensi: data?.pekerjaanData?.data.kompetensi as string,
    });
  };

  React.useEffect(() => {
    if (data?.pekerjaanData) {
      setDataInput({
        tanggung_jawab: data?.pekerjaanData?.data.tanggung_jawab,
        motivasi: data?.pekerjaanData?.data.motivasi,
        kunci_sukses: data?.pekerjaanData?.data.kunci_sukses,
        kompetensi: data?.pekerjaanData?.data.kompetensi,
      });
    }
  }, [data?.pekerjaanData]);

  const handleEditLampiran = async () => {
    const formData = new FormData();

    if (file) {
      const fileToUpload = {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      };
      formData.append("image_struktur", fileToUpload as any);
      formData.append(
        "struktur_org",
        data?.pekerjaanData.data.struktur_org as any
      );
    }
    formData.append("id", data?.pekerjaanData.data.id as any);
    formData.append("tanggung_jawab", dataInput.tanggung_jawab as string);
    formData.append("motivasi", dataInput.motivasi as string);
    formData.append("kunci_sukses", dataInput.kunci_sukses as string);
    formData.append("kompetensi", dataInput.kompetensi as string);

    mutationEditPekerjaan.mutate(formData);
  };

  const handleDeleteLampiran = async (id: number) => {
    mutationDeleteLampiran.mutate(id);
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setFile(result.assets[0] as any);
      }
    } catch (err) {
      console.log("Unknown error: ", err);
    }
  };

  function formatBytes(a: any, b = 2) {
    if (!+a) return "0 Bytes";
    const c = 0 > b ? 0 : b,
      d = Math.floor(Math.log(a) / Math.log(1024));
    return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${
      ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"][d]
    }`;
  }

  console.log("isian khussu");

  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

  return (
    <ContainerBackground>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: moderateScale(20) }}
      >
        <View style={{ gap: moderateScale(20) }}>
          <View style={{ paddingHorizontal: moderateScale(15) }}>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              I. Data Pekerjaan Saat Ini{" "}
            </Text>

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                paddingLeft: moderateScale(10),
              }}
            >
              (Khusus Peserta seleksi wajib di isi!) :
            </Text>
          </View>

          <ContainerIndex
            num={1}
            title="Gambarkan Struktur Organisasi tempat Saudara bekerja, dan dimana posisi jabatan saudara saat ini
     Upload File"
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#F0E9F5",
                height: verticalScale(100),
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: Colors.border_primary,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {data.pekerjaanData.data.file.title}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: moderateScale(20),
              }}
            >
              <Button
                mode="outlined"
                icon={"eye"}
                style={{
                  flex: 1,
                  borderColor: "#1C922F",
                  paddingVertical: moderateScale(5),
                }}
                labelStyle={{ color: Colors.text_primary }}
              >
                Tampilkan
              </Button>

              <Button
                onPress={handleDocumentPick}
                mode="outlined"
                icon={"file"}
                style={{
                  flex: 1,
                  borderColor: "#CD1C1C",
                  paddingVertical: moderateScale(5),
                }}
                labelStyle={{ color: Colors.text_primary }}
              >
                Ganti File
              </Button>
            </View>
          </ContainerIndex>

          <ContainerIndex
            num={2}
            title="Apa saja tanggungjawab Saudara pada pekerjaan/ jabatan Saudara saat ini?"
          >
            <TextInput
              value={dataInput.tanggung_jawab}
              onChangeText={(text) =>
                setDataInput({ ...dataInput, tanggung_jawab: text })
              }
              mode="outlined"
              multiline
              style={{
                backgroundColor: "transparent",
                paddingTop: moderateScale(10),
              }}
              activeOutlineColor={Colors.border_input_active}
              textColor={Colors.text_primary}
            />
          </ContainerIndex>

          <ContainerIndex
            num={3}
            title="Apa yang mendorong Saudara mengikuti seleksi ?"
          >
            <TextInput
              value={dataInput.motivasi}
              onChangeText={(text) =>
                setDataInput({ ...dataInput, motivasi: text })
              }
              mode="outlined"
              multiline
              style={{
                backgroundColor: "transparent",
                paddingTop: moderateScale(10),
              }}
              activeOutlineColor={Colors.text_primary}
              textColor={Colors.text_primary}
            />
          </ContainerIndex>

          <ContainerIndex
            num={4}
            title="Apabila Saudara lulus dalam seleksi, apa saja yang 
            akan Saudara lakukan agar sukses menjalankan tugas
            nanti ?"
          >
            <TextInput
              value={dataInput.kunci_sukses}
              onChangeText={(text) =>
                setDataInput({ ...dataInput, kunci_sukses: text })
              }
              mode="outlined"
              multiline
              style={{
                backgroundColor: "transparent",
                paddingTop: moderateScale(10),
              }}
              activeOutlineColor={Colors.border_input_active}
              textColor={Colors.text_primary}
            />
          </ContainerIndex>

          <ContainerIndex
            num={5}
            title="Menurut pendapat Saudara, kompetensi apa saja yang perlu dimiliki"
          >
            <TextInput
              value={dataInput.kompetensi}
              onChangeText={(text) =>
                setDataInput({ ...dataInput, kompetensi: text })
              }
              mode="outlined"
              multiline
              style={{
                backgroundColor: "transparent",
                paddingTop: moderateScale(10),
              }}
              activeOutlineColor={Colors.border_input_active}
              textColor={Colors.text_primary}
            />
          </ContainerIndex>
        </View>

        <View
          style={{
            gap: moderateScale(20),
            paddingTop: moderateScale(20),
            borderBottomWidth: 1,
            paddingBottom: moderateScale(20),
            borderColor: Colors.border_primary,
          }}
        >
          <View style={{ paddingHorizontal: moderateScale(15) }}>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              II. Dokumen Lampiran
            </Text>
          </View>

          <View style={{ paddingHorizontal: moderateScale(15) }}>
            <Button
              onPress={() => router.push("/isian-khusus.add")}
              icon={"plus"}
              mode="contained"
              textColor="black"
              style={{
                paddingVertical: moderateScale(5),
                backgroundColor: Colors.button_secondary,
              }}
            >
              Tambah Data
            </Button>
          </View>

          <View style={{ paddingHorizontal: moderateScale(15), gap: 20 }}>
            {data.lampiran?.data.map((item) => (
              <View
                key={item.id}
                style={{
                  gap: moderateScale(10),
                  paddingBottom: moderateScale(5),
                }}
              >
                <View>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Jenis :{" "}
                  </Text>
                  <Text>{item.jenis.name}</Text>
                </View>

                <View>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Judul :{" "}
                  </Text>
                  <Text>{item.file.title}</Text>
                </View>

                <View>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Size :{" "}
                  </Text>
                  <Text>{formatBytes(item.file.file_size)}</Text>
                </View>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Button
                    onPress={() => handleDeleteLampiran(item.id)}
                    icon={"delete"}
                    mode="outlined"
                    textColor={Colors.text_primary}
                    style={{ flex: 1, borderColor: Colors.text_red }}
                  >
                    Hapus
                  </Button>

                  <Button
                    onPress={() =>
                      router.navigate({
                        pathname: "/isian-khusus.edit",
                        params: { id: item.id },
                      })
                    }
                    icon={"content-save-edit-outline"}
                    mode="outlined"
                    textColor={Colors.text_primary}
                    style={{ flex: 1, borderColor: "#2279C9" }}
                  >
                    Edit
                  </Button>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingVertical: moderateScale(20),
            gap: moderateScale(25),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: moderateScale(10),
              alignItems: "center",
            }}
          >
            <Checkbox
              status={isChecked ? "checked" : "unchecked"}
              onPress={() => setIsChecked(!isChecked)}
              color={Colors.text_primary}
            />

            <Text style={{ paddingRight: moderateScale(40) }}>
              Dengan ini menyatakan bahwa data yang saya isikan adalah benar
              adanya. Jika kemudian ini diketemukan kesalahan yang disengaja/
              pemalsuan data maka saya bersedia menerima konsekuensinya
            </Text>
          </View>

          <Button
            loading={mutationEditPekerjaan.isPending}
            onPress={handleEditLampiran}
            disabled={!isChecked || mutationEditPekerjaan.isPending}
            icon={"content-save-outline"}
            mode="contained"
            textColor="black"
            labelStyle={{ color: "black" }}
            style={{
              backgroundColor: isChecked ? Colors.button_secondary : "grey",
              paddingVertical: moderateScale(5),
            }}
          >
            Simpan
          </Button>
        </View>
      </ScrollView>
    </ContainerBackground>
  );
}
