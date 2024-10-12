import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { moderateScale } from "react-native-size-matters";
import {
  Button,
  Icon,
  Modal,
  Portal,
  Searchbar,
  TextInput,
} from "react-native-paper";
import { Colors } from "@/constants/Colors";
import useDebounce from "@/hooks/useDebounce";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import Pagination from "@/components/sections/pagination";
import NotFoundSearch from "@/components/sections/NotFoundSearch";

type Uke = {
  code: string;
  uke_induk_id: string;
  skpd_code: string;
  skpd_code_old: string;
  name: string;
  full_name: string;
  nama_dki: string;
  is_active: number;
  created_at: string;
  updated_at: string;
};

type Jabatan = {
  code: string;
  name: string;
  full_name: string;
  urutan: number;
  jenis: string;
  jabatan_active: number;
  created_at: string;
  updated_at: string;
};

interface UkeResponse {
  status: "success" | "error";
  message: string;
  data: {
    data: Uke[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface JabatanResponse {
  status: "success" | "error";
  message: string;
  data: {
    data: Jabatan[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export default function RiwayaPekerjaanAdd() {
  const [dataInput, setDataInput] = React.useState({
    tmt_jabatan: "",
    keterangan: "",
  });

  const [selectValue, setSelectValue] = React.useState<any>({
    uke: null,
    jenis: null,
    jabatan: null,
  });
  const [date, setDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const [page, setPage] = React.useState(1);

  const [searchUke, setSearchUke] = React.useState("");
  const searchUkeVal = useDebounce(searchUke, 500);

  const [modal, setModal] = React.useState({
    uke: false,
    jenis: false,
    jabatan: false,
  });

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["fetching"],
    queryFn: async () => {
      const [resUke, resJabatan] = await Promise.all([
        axiosService.get<UkeResponse>(
          `/api/data-kompetensi/riwayat-pekerjaan/uke?page=${page}&limit=15&search=${searchUkeVal}`
        ),
        axiosService.get<JabatanResponse>(
          `/api/data-kompetensi/riwayat-pekerjaan/jabatan?page=1&limit=15&jenis=${
            selectValue?.jenis?.value ?? "F"
          }&search=${selectValue?.uke?.value}`
        ),
      ]);
      return {
        uke: resUke.data,
        jabatan: resJabatan.data,
      };
    },
  });

  console.log(data?.jabatan.data.data.length);

  React.useEffect(() => {
    refetch();
  }, [searchUkeVal, page, selectValue]);

  console.log(date);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setDataInput({
      ...dataInput,
      tmt_jabatan: currentDate
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .join("-"),
    });
  };

  const mutationAdd = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosService.post(
        "/api/data-kompetensi/riwayat-pekerjaan/post",
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
        textBody: "Riwayat Pekerjaan Berhasil Ditambahkan",
        button: "Tutup",
      });
      setDataInput({
        tmt_jabatan: "",
        keterangan: "",
      });
      setSelectValue({
        uke: null,
        jenis: null,
        jabatan: null,
      });
      router.navigate({
        pathname: "/biodata-kompetensi",
        params: { data: "success" },
      });
    },
    onError: (error) => {
      console.error("Error adding riwayat pekerjaan:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: error?.message || "Riwayat Pekerjaan Gagal Ditambahkan",
        button: "Tutup",
      });
    },
  });

  const handleAdd = async () => {
    if (!selectValue?.uke?.value) {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Peringatan",
        textBody: "Instansi harus dipilih",
        button: "Tutup",
      });
    }

    if (!selectValue?.jenis.value) {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Peringatan",
        textBody: "Jenis Jabatan harus dipilih",
        button: "Tutup",
      });
    }

    if (!selectValue?.jabatan?.value) {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Peringatan",
        textBody: "Jabatan harus dipilih",
        button: "Tutup",
      });
    }

    if (!dataInput.tmt_jabatan) {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Peringatan",
        textBody: "TMT Jabatan harus diisi",
        button: "Tutup",
      });
    }
    const formData = new FormData();
    formData.append("instansi", selectValue?.uke?.value as string);
    formData.append("jabatan", selectValue?.jabatan?.value as string);
    formData.append("tmt_jabatan", date.toISOString());
    formData.append(
      "keterangan",
      dataInput.keterangan === "" ? " " : dataInput.keterangan
    );

    mutationAdd.mutate(formData);
  };

  if (isPending) return <Loading />;

  if (error) return <Error />;

  console.log(dataInput);
  return (
    <View>
      <View
        style={{
          gap: moderateScale(20),
          paddingHorizontal: moderateScale(15),
          paddingVertical: moderateScale(20),
        }}
      >
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            onPress={() => setModal({ ...modal, uke: true })}
            style={{
              borderWidth: 1,
              borderColor: Colors.border_primary,
              paddingHorizontal: 10,
              paddingVertical: 15,
              borderRadius: 5,
              flexDirection: "row",
              backgroundColor: "white",
            }}
          >
            <Text
              style={{
                flex: 1,
                color: "grey",
                fontWeight: "400",
                fontSize: 16,
              }}
            >
              {selectValue?.uke?.label ?? "Instansi/Unit kerja *"}
            </Text>
            <Icon size={24} source={"open-in-new"} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={{ position: "relative" }}>
          <TouchableOpacity
            onPress={() => setModal({ ...modal, jenis: true })}
            style={{
              borderWidth: 1,
              borderColor: Colors.border_primary,
              paddingHorizontal: 10,
              paddingVertical: 15,
              borderRadius: 5,
              flexDirection: "row",
              backgroundColor: "white",
            }}
          >
            <Text
              style={{
                flex: 1,
                color: "grey",
                fontWeight: "400",
                fontSize: 16,
              }}
            >
              {selectValue?.jenis?.label ?? "Jenis Jabatan *"}
            </Text>
            <Icon size={24} source={"open-in-new"} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={{ position: "relative" }}>
          <TouchableOpacity
            onPress={() => setModal({ ...modal, jabatan: true })}
            style={{
              borderWidth: 1,
              borderColor: Colors.border_primary,
              paddingHorizontal: 10,
              paddingVertical: 15,
              borderRadius: 5,
              flexDirection: "row",
              backgroundColor: "white",
            }}
          >
            <Text
              style={{
                flex: 1,
                color: "grey",
                fontWeight: "400",
                fontSize: 16,
              }}
            >
              {selectValue?.jabatan?.label ?? "Jabatan *"}
            </Text>
            <Icon size={24} source={"open-in-new"} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            borderWidth: 1,
            borderColor: Colors.border_primary,
            paddingHorizontal: 10,
            paddingVertical: 15,
            borderRadius: 5,
            flexDirection: "row",
            backgroundColor: "white",
          }}
        >
          <Text
            style={{
              flex: 1,
              color: dataInput.tmt_jabatan ? "black" : "grey",
              fontWeight: "400",
              fontSize: 16,
            }}
          >
            {dataInput.tmt_jabatan ? dataInput.tmt_jabatan : "TMT Jabatan *"}
          </Text>
          <Icon size={24} source={"calendar-today"} color="gray" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <TextInput
          value={dataInput.keterangan}
          onChangeText={(text) =>
            setDataInput({ ...dataInput, keterangan: text })
          }
          textColor={Colors.text_primary}
          label={"Keterangan"}
          mode="outlined"
          outlineColor={Colors.border_primary}
          activeOutlineColor={Colors.border_input_active}
          style={{ backgroundColor: "white" }}
        />

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Button
            loading={mutationAdd.isPending}
            disabled={mutationAdd.isPending}
            onPress={handleAdd}
            icon={"content-save-outline"}
            mode="contained"
            textColor="white"
            labelStyle={{ color: "white" }}
            style={{
              backgroundColor: Colors.button_primary,
              borderRadius: 7,
              paddingVertical: 7,
              flex: 1,
            }}
          >
            Simpan
          </Button>
        </View>
      </View>

      <Portal>
        <Modal
          visible={modal.uke || modal.jabatan || modal.jenis}
          onDismiss={() =>
            setModal({ ...modal, uke: false, jabatan: false, jenis: false })
          }
          contentContainerStyle={{
            backgroundColor: "white",
            height: "60%",
            paddingHorizontal: 15,
            paddingVertical: 20,
          }}
        >
          {modal.uke && (
            <>
              <Searchbar
                value={searchUke}
                iconColor={Colors.text_secondary}
                inputStyle={{
                  color: Colors.text_primary,
                }}
                onChangeText={(text) => setSearchUke(text)}
                placeholder="Cari Data"
                placeholderTextColor={Colors.text_secondary}
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: Colors.border_primary,
                  borderRadius: 7,
                  marginBottom: 20,
                }}
              />

              {data.uke.data.data.length === 0 ? (
                <NotFoundSearch />
              ) : (
                <FlashList
                  data={data?.uke.data.data}
                  keyExtractor={(item) => item.code.toString()}
                  estimatedItemSize={15}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectValue({
                          ...selectValue,
                          uke: {
                            label: item.name,
                            value: item.code,
                          },
                          jabatan: null,
                        });
                        setModal({ ...modal, uke: false });
                        setSearchUke("");
                      }}
                      style={{
                        marginBottom:
                          index === data.uke.data.data.length - 1 ? 0 : 20,
                        borderBottomWidth: 1,
                        paddingBottom: 15,
                        borderBottomColor: Colors.border_primary,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.text_primary,
                          fontSize: 15,
                          fontWeight: "500",
                        }}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListFooterComponent={() => (
                    <Pagination
                      loading={isPending}
                      page={page}
                      setPage={setPage}
                      totalPage={data.uke.data.meta.totalPages}
                      horizontal={0}
                    />
                  )}
                />
              )}
            </>
          )}

          {modal.jenis && (
            <>
              <FlashList
                data={dataJenis}
                keyExtractor={(item) => item.label.toString()}
                estimatedItemSize={2}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectValue({
                        ...selectValue,
                        jenis: {
                          label: item.label,
                          value: item.value,
                        },
                      });
                      setModal({ ...modal, jenis: false });
                      setSearchUke("");
                    }}
                    style={{
                      marginBottom: index === dataJenis.length - 1 ? 0 : 20,
                      borderBottomWidth: 1,
                      paddingBottom: 15,
                      borderBottomColor: Colors.border_primary,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.text_primary,
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}

          {modal.jabatan &&
            (data.jabatan.data.data.length === 0 ? (
              <NotFoundSearch />
            ) : (
              <FlashList
                data={data?.jabatan.data.data}
                keyExtractor={(item) => item.code.toString()}
                estimatedItemSize={15}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectValue({
                        ...selectValue,
                        jabatan: {
                          label: item.name,
                          value: item.code,
                        },
                      });
                      setModal({ ...modal, jabatan: false });
                      setSearchUke("");
                    }}
                    style={{
                      marginBottom:
                        index === data.uke.data.data.length - 1 ? 0 : 20,
                      borderBottomWidth: 1,
                      paddingBottom: 15,
                      borderBottomColor: Colors.border_primary,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.text_primary,
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                ListFooterComponent={() => (
                  <Pagination
                    loading={isPending}
                    page={page}
                    setPage={setPage}
                    totalPage={data.jabatan.data.meta.totalPages}
                    horizontal={0}
                  />
                )}
              />
            ))}
        </Modal>
      </Portal>
    </View>
  );
}

const dataJenis = [
  { value: "S", label: "Struktural" },
  { value: "F", label: "Functional" },
];
