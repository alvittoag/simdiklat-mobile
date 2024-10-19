import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { moderateScale } from "react-native-size-matters";
import {
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Portal,
  TextInput,
} from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import { ISimpeg, IUsers } from "@/type";
import { parseDateLong } from "@/lib/parseDate";
import { ALERT_TYPE, Dialog as D } from "react-native-alert-notification";
import { router } from "expo-router";
import axios from "axios";

type response = {
  status: string;
  message: string;
  data: {
    simpeg_data: ISimpeg;
    user: IUsers;
  };
};

export default function BiodataSimpeg() {
  const queryClient = useQueryClient();
  const [dataCheck, setDataCheck] = React.useState<Record<string, string>>({});
  const [allChecked, setAllChecked] = React.useState(false);
  const [dialog, setDialog] = React.useState(false);

  const { data, isPending, isError, isSuccess, status, refetch } = useQuery({
    queryKey: ["biodata-simpeg"],
    queryFn: async () => {
      const res = await axiosService.get<response>("/api/simpeg/get");
      return res.data;
    },
  });

  const { mutate, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (formdata: any) => {
      const res = await axiosService.put("/api/simpeg/put", {
        data: formdata,
      });
      return res.data;
    },

    onSuccess: () => {
      refetch();

      D.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Biodata Simpeg Berhasil Disimpan",
        button: "Tutup",
        onPressButton() {
          router.push("/halaman-utama");

          D.hide();
        },
      });
    },
    onError: (error) => {
      console.log(error);
      D.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Biodata Simpeg Gagal ",
        button: "Tutup",
      });
    },
  });

  const handleCheckboxChange = (key: string, value: string) => {
    setDataCheck((prev) => {
      const newDataCheck = { ...prev };
      if (newDataCheck[key]) {
        delete newDataCheck[key];
      } else {
        newDataCheck[key] = value;
      }
      return newDataCheck;
    });
  };

  const dataAll = {
    agama: data?.data.simpeg_data.AGAMA,
    eselon: data?.data.simpeg_data.ESELON,
    full_name: data?.data.simpeg_data.NAMA,
    gelar_belakang: data?.data.simpeg_data["GELAR BELAKANG"],
    gelar_depan: data?.data.simpeg_data["GELAR DEPAN"] || " ",
    gender: data?.data.simpeg_data.JENKEL === "P" ? "PEREMPUAN" : "LAKI-LAKI",
    golongan: data?.data.simpeg_data.KOPANG,
    jabatan: {
      code: data?.data.simpeg_data.KOJAB,
      name: data?.data.simpeg_data.JABATAN,
      jenis: data?.data.simpeg_data.KD,
    },
    nip: data?.data.simpeg_data.NIP18,
    npwp: data?.data.simpeg_data.NPWP,
    nrk: data?.data.simpeg_data.NRK,
    pangkat: data?.data.simpeg_data.KOPANG,
    pendidikan: {
      jenis: data?.data.simpeg_data.PENDIDIKAN,
      nama_sekolah: data?.data.simpeg_data.UNIVERSITAS,
      jurusan: data?.data.simpeg_data["NAMA JURUSAN"],
      tempat: data?.data.simpeg_data["LOKASI UNIVERSITAS"],
      tahun_lulus: data?.data.simpeg_data["TGL.IJAZAH"].split("-")[2],
      ijazah: 0,
      nomor_ijazah: data?.data.simpeg_data["NO.IJAZAH"],
      tgl_ijazah: data?.data.simpeg_data["TGL.IJAZAH"],
    },
    rekening: data?.data.simpeg_data["NO.REKENING"],
    rumah_alamat: data?.data.simpeg_data.ALAMAT,
    rumah_kota: data?.data.simpeg_data.WILAYAH,
    rumah_telp: data?.data.simpeg_data.NOTELP,
    status_pegawai: data?.data.simpeg_data["STATUS PEGAWAI"],
    tempat_lahir: data?.data.simpeg_data["TEMPAT LAHIR"],
    tmt_cpns: data?.data.simpeg_data["TMT CPNS"],
    tmt_eselon: data?.data.simpeg_data["TMT ESELON"],
    tmt_pangkat: data?.data.simpeg_data["TMT PANGKAT"],
    tmt_pns: data?.data.simpeg_data["TMT PNS"],
    uke: data?.data.simpeg_data["KODE UKPD"],
  };

  const handleUpdate = async () => {
    const modifiedDataCheck = Object.entries(dataCheck).reduce(
      (acc: any, [key, value]) => {
        let newKey = key;
        switch (key) {
          case "jabatan":
            newKey = "jabatan_id";
            break;
          case "uke":
            newKey = "uke_id";
            break;
          case "pangkat":
            newKey = "pangkat_id";
            break;
          case "golongan":
            newKey = "golongan_id";
            break;
          case "eselon":
            newKey = "eselon_id";
            break;
          case "pendidikan":
            newKey = "pendidikan_id";
            break;
        }
        acc[newKey] = value;
        return acc;
      },
      {}
    );

    mutate(modifiedDataCheck);
  };

  const handleAllCheckboxChange = () => {
    if (isSuccess) {
      setAllChecked(!allChecked);
      setDataCheck((prev) => {
        return !allChecked ? { ...dataAll } : {};
      });
    }
  };

  React.useEffect(() => {
    handleAllCheckboxChange();
  }, [status]);

  console.log(dataCheck);

  const renderField = (
    key: string,
    simdiklatValue: string,
    simpegValue: string,
    otherValue?: any
  ) => (
    <View style={{ gap: moderateScale(10) }}>
      <View style={{ gap: 5 }}>
        <Text style={{ fontWeight: 500, fontSize: 16 }}>
          {key.toUpperCase().replace("_", " ")}
        </Text>
        <TextInput
          value={simdiklatValue}
          disabled
          multiline={simdiklatValue?.length >= 40}
          mode="outlined"
          textColor="black"
          style={[
            styles.textInput,
            {
              maxHeight: 100,
              paddingVertical: simdiklatValue?.length >= 40 ? 10 : 0,
            },
          ]}
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Checkbox.Android
          status={dataCheck[key] ? "checked" : "unchecked"}
          onPress={() => handleCheckboxChange(key, otherValue ?? simpegValue)}
          uncheckedColor={Colors.text_primary}
          color={Colors.text_primary}
        />
        <Text style={{ fontSize: 16, paddingRight: 50 }}>{simpegValue}</Text>
      </View>
    </View>
  );

  if (isError) return <Error />;

  if (isPending) return <Loading />;

  return (
    <ContainerBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingVertical: moderateScale(15),
            borderBottomWidth: 1,
            borderBottomColor: Colors.border_primary,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: moderateScale(15),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: moderateScale(10),
              }}
            >
              <MaterialIcons name="people-outline" size={32} />

              <Text
                style={{
                  fontWeight: "bold",
                  color: Colors.text_primary,
                  fontSize: 17,
                }}
              >
                Di SIMDIKLAT
              </Text>
            </View>

            <IconButton
              onPress={() => setDialog(true)}
              icon={"information"}
              iconColor={Colors.text_primary}
              size={30}
            />
          </View>

          <View
            style={{
              paddingHorizontal: moderateScale(10),
              flexDirection: "row",
              alignItems: "center",
              gap: moderateScale(5),
            }}
          >
            <Checkbox
              status={allChecked ? "checked" : "unchecked"}
              onPress={handleAllCheckboxChange}
              uncheckedColor={Colors.text_primary}
              color={Colors.text_primary}
            />
            <Text style={{ fontSize: 16 }}>Di SIMPEG</Text>
          </View>
        </View>

        <View
          style={{
            paddingTop: moderateScale(20),
            paddingBottom: moderateScale(40),
            paddingHorizontal: moderateScale(15),
            gap: moderateScale(20),
          }}
        >
          {renderField(
            "nrk",
            data?.data?.user?.nrk,
            data?.data?.simpeg_data?.NRK
          )}
          {renderField(
            "nip",
            data?.data?.user?.nip,
            data?.data?.simpeg_data?.NIP18
          )}
          {renderField(
            "gelar_depan",
            (data?.data?.user?.gelar_depan === "" && "-") || "-",
            data?.data?.simpeg_data?.["GELAR DEPAN"] || "-",
            data?.data?.simpeg_data?.["GELAR DEPAN"] || " "
          )}
          {renderField(
            "full_name",
            data?.data?.user?.full_name,
            data?.data?.simpeg_data?.NAMA
          )}
          {renderField(
            "gelar_belakang",
            data?.data?.user?.gelar_belakang,
            data?.data?.simpeg_data?.["GELAR BELAKANG"]
          )}
          {renderField(
            "gender",
            data?.data?.user?.gender,
            data?.data?.simpeg_data?.JENKEL === "L" ? "LAKI-LAKI" : "PEREMPUAN"
          )}
          {renderField(
            "agama",
            data?.data?.user?.agama,
            data?.data?.simpeg_data?.AGAMA
          )}
          {renderField(
            "status_pegawai",
            data?.data?.user?.status_pegawai,
            data?.data?.simpeg_data?.["STATUS PEGAWAI"]
          )}
          {renderField(
            "tempat_lahir",
            data?.data?.user?.tempat_lahir,
            data?.data?.simpeg_data?.["TEMPAT LAHIR"]
          )}
          {renderField(
            "rumah_alamat",
            data?.data?.user?.rumah_alamat,
            data?.data?.simpeg_data?.ALAMAT
          )}
          {renderField(
            "rumah_kota",
            data?.data?.user?.rumah_kota,
            data?.data?.simpeg_data?.WILAYAH
          )}
          {renderField(
            "rumah_telp",
            data?.data?.user?.rumah_telp,
            data?.data?.simpeg_data?.NOTELP
          )}
          {renderField(
            "npwp",
            data?.data?.user?.npwp,
            data?.data?.simpeg_data?.NPWP
          )}
          {renderField(
            "rekening",
            data?.data?.user?.rekening,
            data?.data?.simpeg_data?.["NO.REKENING"]
          )}
          {renderField(
            "pendidikan",
            `${data?.data?.user?.pendidikan?.jenis}, ${data?.data?.user?.pendidikan?.nama_sekolah}`,
            `${data?.data?.simpeg_data?.PENDIDIKAN}, ${data?.data?.simpeg_data?.UNIVERSITAS}`,
            {
              jenis: data?.data?.simpeg_data?.PENDIDIKAN,
              nama_sekolah: data?.data?.simpeg_data?.UNIVERSITAS,
              jurusan: data?.data?.simpeg_data?.["NAMA JURUSAN"],
              tempat: data?.data?.simpeg_data?.["LOKASI UNIVERSITAS"],
              tahun_lulus:
                data?.data?.simpeg_data?.["TGL.IJAZAH"]?.split("-")[2],
              ijazah: 0,
              nomor_ijazah: data?.data?.simpeg_data?.["NO.IJAZAH"],
              tgl_ijazah: data?.data?.simpeg_data?.["TGL.IJAZAH"],
            }
          )}
          {renderField(
            "tmt_cpns",
            parseDate(data?.data?.user?.tmt_cpns),
            data?.data?.simpeg_data?.["TMT CPNS"]
          )}
          {renderField(
            "tmt_pns",
            parseDate(data?.data?.user?.tmt_pns),
            data?.data?.simpeg_data?.["TMT PNS"]
          )}
          {renderField(
            "uke",
            data?.data?.user?.uke?.full_name,
            data?.data?.simpeg_data?.["NAMA UKPD"],
            data?.data?.simpeg_data?.["KODE UKPD"]
          )}
          {renderField(
            "pangkat",
            data?.data?.user?.pangkat?.full_name,
            data?.data?.simpeg_data?.PANGKAT,
            data?.data?.simpeg_data?.KOPANG
          )}
          {renderField(
            "golongan",
            data?.data?.user?.pangkat?.name,
            data?.data?.simpeg_data?.GOL,
            data?.data?.simpeg_data?.PANGKAT
          )}
          {renderField(
            "tmt_pangkat",
            parseDate(data?.data?.user?.tmt_pangkat),
            data?.data?.simpeg_data?.["TMT PANGKAT"]
          )}
          {renderField(
            "eselon",
            data?.data?.user?.eselon?.name,
            data?.data?.simpeg_data?.["NAMA ESELON"],
            data?.data?.simpeg_data?.ESELON
          )}
          {renderField(
            "tmt_eselon",
            parseDate(data?.data?.user?.tmt_eselon),
            data?.data?.simpeg_data?.["TMT ESELON"]
          )}
          {renderField(
            "jabatan",
            data?.data?.user?.jabatan?.full_name,
            data?.data?.simpeg_data?.JABATAN,
            {
              code: data?.data?.simpeg_data?.KOJAB,
              name: data?.data?.simpeg_data?.JABATAN,
              jenis: data?.data?.simpeg_data?.KD,
            }
          )}

          {/* Submit button */}
          <View style={{ flexDirection: "row", gap: moderateScale(25) }}>
            <Button
              icon={"content-save-outline"}
              disabled={isPendingUpdate}
              loading={isPendingUpdate}
              labelStyle={{ color: "black" }}
              style={{
                backgroundColor: Colors.button_secondary,
                paddingVertical: moderateScale(8),
                flex: 1,
                borderRadius: 7,
              }}
              textColor="black"
              onPress={() => handleUpdate()}
            >
              Simpan
            </Button>
          </View>
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          style={{
            backgroundColor: "white",
            padding: moderateScale(10),
          }}
          visible={dialog}
          onDismiss={() => setDialog(false)}
        >
          <Dialog.Title
            style={{
              fontWeight: "bold",
              color: Colors.text_primary,
              fontSize: 19,
            }}
          >
            Peringatan
          </Dialog.Title>

          <Dialog.Content>
            <Text style={{ fontSize: 16 }}>
              Silahkan perbaharui Biodata pegawai pada SIMDIKLAT dengan biodata
              yang sudah tersimpan pada data SIMPEG
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              mode="elevated"
              style={{
                backgroundColor: Colors.button_primary,
                paddingVertical: moderateScale(8),
                flex: 1,
              }}
              textColor="white"
              onPress={() => setDialog(false)}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ContainerBackground>
  );
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.border_primary,
    borderRadius: 5,
  },
});

const parseDate = (d: Date) => {
  const date = new Date(d);
  return date
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .split("/")
    .join("-");
};
