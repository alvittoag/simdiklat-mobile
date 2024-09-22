import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { moderateScale, verticalScale } from "react-native-size-matters";
import {
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Portal,
  TextInput,
} from "react-native-paper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import { ISimpeg, IUsers } from "@/type";
import { parseDateLong } from "@/lib/parseDate";
import { ALERT_TYPE, Dialog as D } from "react-native-alert-notification";

type response = {
  status: string;
  message: string;
  data: {
    simpeg_data: ISimpeg;
    user: IUsers;
  };
};

export default function BiodataSimpeg() {
  const [dataCheck, setDataCheck] = React.useState<Record<string, string>>({});
  const [allChecked, setAllChecked] = React.useState(false);
  const [dialog, setDialog] = React.useState(false);

  const { data, isPending, isError, isSuccess } = useQuery({
    queryKey: ["biodata-simpeg"],
    queryFn: async () => {
      const res = await axiosService.get<response>("/api/simpeg/get");
      return res.data;
    },
  });

  const { mutate, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (formdata: FormData) => {
      const res = await axiosService.put("/api/simpeg/put", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },

    onSuccess: () => {
      D.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Biodata Simpeg Berhasil",
        button: "Tutup",
      });
      setDataCheck({});
    },
    onError: (error) => {
      console.log(error);
      D.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Biodata Simpeg Gagal",
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
    eselon_id: data?.data.simpeg_data.ESELON,
    full_name: data?.data.simpeg_data.NAMA,
    gelar_belakang: data?.data.simpeg_data["GELAR BELAKANG"],
    gelar_depan: data?.data.simpeg_data["GELAR DEPAN"] || " ",
    gender: data?.data.simpeg_data.JENKEL === "P" ? "Perempuan" : "Laki-laki",
    golongan_id: data?.data.simpeg_data.KOPANG,
    jabatan_id: data?.data.simpeg_data.KOJAB,
    nip: data?.data.simpeg_data.NIP18,
    npwp: data?.data.simpeg_data.NPWP,
    nrk: data?.data.simpeg_data.NRK,
    pangkat_id: data?.data.simpeg_data.KOPANG,
    pendidikan: "S1, INSTITUT PERTANIAN BOGOR",
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
    uke_id: data?.data.simpeg_data["KODE UKPD"],
  };

  const handleAllCheckboxChange = () => {
    if (isSuccess) {
      setAllChecked(!allChecked);
      setDataCheck((prev) => {
        return !allChecked ? { ...dataAll } : {};
      });
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    Object.entries(dataCheck).forEach(([key, value]) => {
      formData.append(key, value);
    });

    mutate(formData);
  };

  const renderField = (
    key: string,
    simdiklatValue: string,
    simpegValue: string,
    otherValue?: string
  ) => (
    <View style={{ gap: moderateScale(5) }}>
      <TextInput
        value={simdiklatValue}
        disabled
        mode="outlined"
        textColor="black"
        style={styles.textInput}
        outlineColor={Colors.border_primary}
        activeOutlineColor={Colors.border_input_active}
      />
      <View
        style={{
          paddingHorizontal: moderateScale(25),
          flexDirection: "row",
          alignItems: "center",
          gap: moderateScale(5),
        }}
      >
        <Checkbox.Android
          status={dataCheck[key] ? "checked" : "unchecked"}
          onPress={() => handleCheckboxChange(key, otherValue ?? simpegValue)}
          uncheckedColor={Colors.text_primary}
          color={Colors.text_primary}
        />
        <Text style={{ fontSize: 16 }}>{simpegValue}</Text>
      </View>
    </View>
  );

  React.useEffect(() => {
    handleAllCheckboxChange();
  }, [isSuccess]);

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
              paddingHorizontal: moderateScale(35),
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
            gap: moderateScale(30),
          }}
        >
          {renderField("nrk", data.data.user.nrk, data.data.simpeg_data.NRK)}
          {renderField("nip", data.data.user.nip, data.data.simpeg_data.NIP18)}
          {renderField(
            "gelar_depan",
            data.data.user.gelar_depan || "- (Gelar Depan)",
            data.data.simpeg_data["GELAR DEPAN"] || "- (Gelar Depan)",
            data.data.simpeg_data["GELAR DEPAN"] || " "
          )}
          {renderField(
            "full_name",
            data.data.user.full_name,
            data.data.simpeg_data.NAMA
          )}
          {renderField(
            "gelar_belakang",
            data.data.user.gelar_belakang,
            data.data.simpeg_data["GELAR BELAKANG"]
          )}
          {renderField(
            "gender",
            data.data.user.gender,
            data.data.simpeg_data.JENKEL === "L" ? "LAKI-LAKI" : "PEREMPUAN"
          )}
          {renderField(
            "agama",
            data.data.user.agama,
            data.data.simpeg_data.AGAMA
          )}
          {renderField(
            "status_pegawai",
            data.data.user.status_pegawai,
            data.data.simpeg_data["STATUS PEGAWAI"]
          )}
          {renderField(
            "tempat_lahir",
            data.data.user.tempat_lahir,
            data.data.simpeg_data["TEMPAT LAHIR"]
          )}
          {renderField(
            "rumah_alamat",
            data.data.user.rumah_alamat,
            data.data.simpeg_data.ALAMAT
          )}
          {renderField(
            "rumah_kota",
            data.data.user.rumah_kota,
            data.data.simpeg_data.WILAYAH
          )}
          {renderField(
            "rumah_telp",
            data.data.user.rumah_telp,
            data.data.simpeg_data.NOTELP
          )}
          {renderField("npwp", data.data.user.npwp, data.data.simpeg_data.NPWP)}
          {renderField(
            "rekening",
            data.data.user.rekening,
            data.data.simpeg_data["NO.REKENING"]
          )}
          {renderField(
            "pendidikan",
            `${data.data.user.pendidikan_id}, ${data.data.user.pendidikan_sk}`,
            `${data.data.simpeg_data.PENDIDIKAN}, ${data.data.simpeg_data.UNIVERSITAS}`
          )}
          {renderField(
            "tmt_cpns",
            parseDateLong(data.data.user.tmt_cpns as any),
            data.data.simpeg_data["TMT CPNS"]
          )}
          {renderField(
            "tmt_pns",
            parseDateLong(data.data.user.tmt_pns as any),
            data.data.simpeg_data["TMT PNS"]
          )}
          {renderField(
            "uke_id",
            data.data.user.uke.full_name,
            data.data.simpeg_data["NAMA UKPD"],
            data.data.simpeg_data["KODE UKPD"]
          )}
          {renderField(
            "pangkat_id",
            data.data.user.pangkat.full_name,
            data.data.simpeg_data.PANGKAT,
            data.data.simpeg_data.KOPANG
          )}
          {renderField(
            "golongan_id",
            data.data.user.pangkat.name,
            data.data.simpeg_data.GOL,
            data.data.simpeg_data.KOPANG
          )}
          {renderField(
            "tmt_pangkat",
            parseDateLong(data.data.user.tmt_pangkat as any),
            data.data.simpeg_data["TMT PANGKAT"]
          )}
          {renderField(
            "eselon_id",
            data.data.user.eselon.name,
            data.data.simpeg_data["NAMA ESELON"],
            data.data.simpeg_data.ESELON
          )}
          {renderField(
            "tmt_eselon",
            parseDateLong(data.data.user.tmt_pns as any),
            data.data.simpeg_data["TMT ESELON"]
          )}
          {renderField(
            "jabatan_id",
            data.data.user.jabatan?.full_name,
            data.data.simpeg_data.JABATAN,
            data.data.simpeg_data.KOJAB
          )}

          {/* Submit button */}
          <View style={{ flexDirection: "row", gap: moderateScale(25) }}>
            <Button
              icon={"send"}
              disabled={isPendingUpdate}
              loading={isPendingUpdate}
              labelStyle={{ color: "black" }}
              mode="elevated"
              style={{
                backgroundColor: Colors.button_secondary,
                paddingVertical: moderateScale(8),
                flex: 1,
              }}
              textColor="black"
              onPress={() => handleUpdate()}
            >
              Kirim
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
    height: verticalScale(45),
    borderWidth: 1,
    borderColor: Colors.border_primary,
    borderRadius: 5,
  },
});
