import { TouchableOpacity, View } from "react-native";
import React from "react";
import ContainerBackground from "@/components/container/ContainerBackground";
import { moderateScale } from "react-native-size-matters";
import {
  Button,
  Icon,
  Modal,
  Portal,
  Searchbar,
  Text,
  TextInput,
} from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import Pagination from "@/components/sections/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosService } from "@/services/axiosService";
import useDebounce from "@/hooks/useDebounce";
import { IUsers } from "@/type";
import Loading from "@/components/elements/Loading";
import Error from "@/components/elements/Error";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import auth from "@/services/api/auth";
import { Formik, FormikProps, FormikValues } from "formik";
import * as Yup from "yup";
import { useApolloClient } from "@apollo/client";
import NotFoundSearch from "@/components/sections/NotFoundSearch";

type respnose = {
  status: "success" | "error";
  message: string;
  data: {
    data: IUsers[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

const messageSchema = Yup.object().shape({
  subject: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Subject"),
  message: Yup.string()
    .min(2, "Minimum 2 Karakter")
    .required("Harap Masukan Isi Pesan"),
});

export default function KotakMasukCreate() {
  const { user, user_id, subject, message }: any = useLocalSearchParams();

  console.log(subject, message);

  const queryClient = useQueryClient();
  const [searchUsers, setsearchUsers] = React.useState("");

  const [page, setPage] = React.useState(1);

  const search = useDebounce(searchUsers, 500);

  const [modal, setModal] = React.useState(false);

  const [selectValue, setSelectValue] = React.useState<{
    label: string | null;
    value: number | null;
  }>({
    label: null,
    value: null,
  });

  const { data, isPending, error } = useQuery({
    queryKey: ["users", search, page],
    queryFn: async () => {
      const res = await axiosService.get<respnose>(
        `/api/message/user?page=${page}&limit=15&search=${search}`
      );

      return res.data;
    },
  });

  const { mutate, isPending: isPendingMutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      await axiosService.post("/api/message/send-message", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: async () => {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Berhasil",
        textBody: "Pesan Berhasil Dikirim",
        button: "Tutup",
      });
      setSelectValue({ label: null, value: null });
      queryClient.invalidateQueries({ queryKey: ["count-notif"] });
      router.navigate({
        pathname: "/kotak-masuk.keluar",
        params: { data: "success" },
      });
    },
    onError: (error) => {
      console.error("Error adding mesage:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Gagal",
        textBody: "Gagal Mengirim Pesan",
        button: "Tutup",
      });
    },
    retry: 10,
  });

  const handleSend = ({
    subject,
    message,
  }: {
    subject: string;
    message: string;
  }) => {
    const formData = new FormData();
    formData.append("from", selectValue.value as any);
    formData.append("subject", subject);
    formData.append("message", message);

    mutate(formData);
  };

  if (error) return <Error />;

  return (
    <ContainerBackground>
      <View
        style={{
          paddingVertical: moderateScale(20),
          paddingHorizontal: moderateScale(15),
          gap: moderateScale(25),
        }}
      >
        <Formik
          initialValues={{ subject: "", message: "" }}
          onSubmit={({ message, subject }, { resetForm }) => {
            if (!selectValue.value) {
              return Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Peringatan",
                textBody: "Harap Pilih Penerima",
                button: "Tutup",
              });
            }

            if (!message || !subject) {
              return Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Peringatan",
                textBody: "Harap Lengkapi Subjek dan Isi Pesan",
                button: "Tutup",
              });
            }
            handleSend({
              subject: message,
              message: subject,
            });

            resetForm();
          }}
        >
          {({ handleChange, handleSubmit, values, errors, setValues }) => {
            React.useEffect(() => {
              setSelectValue({ label: user, value: user_id });
              setValues({ subject: subject ?? "", message: message ?? "" });
            }, [message, subject, user, user_id]);
            return (
              <>
                <View style={{ gap: moderateScale(15) }}>
                  <View style={{ position: "relative" }}>
                    <TouchableOpacity
                      onPress={() => setModal(true)}
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
                        {selectValue?.label ?? "Kepada"}
                      </Text>
                      <Icon size={24} source={"open-in-new"} color="gray" />
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    textColor="black"
                    value={values.subject}
                    onChangeText={handleChange("subject")}
                    error={errors.subject ? true : false}
                    mode="outlined"
                    label="Subjek"
                    activeOutlineColor={Colors.border_input_active}
                    outlineColor={Colors.border_primary}
                    style={{
                      backgroundColor: "white",
                      minHeight: 60,
                    }}
                  />

                  {errors.subject && (
                    <Text style={{ color: "salmon", fontWeight: "bold" }}>
                      {errors.subject}
                    </Text>
                  )}

                  <TextInput
                    error={errors.message ? true : false}
                    textColor="black"
                    value={values.message}
                    onChangeText={handleChange("message")}
                    mode="outlined"
                    label="Isi Pesan"
                    multiline
                    activeOutlineColor={Colors.border_input_active}
                    outlineColor={Colors.border_primary}
                    style={{
                      backgroundColor: "white",
                      minHeight: moderateScale(100),
                    }}
                  />

                  {errors.message && (
                    <Text style={{ color: "salmon", fontWeight: "bold" }}>
                      {errors.message}
                    </Text>
                  )}
                </View>

                <View style={{ gap: moderateScale(25), flexDirection: "row" }}>
                  <Button
                    onPress={() => router.back()}
                    icon={"arrow-left"}
                    mode="contained"
                    textColor="white"
                    style={{
                      borderRadius: 7,
                      backgroundColor: Colors.button_primary,
                      paddingVertical: moderateScale(5),
                      flex: 1,
                    }}
                  >
                    Kembali
                  </Button>

                  <Button
                    loading={isPendingMutate}
                    disabled={isPendingMutate}
                    onPress={handleSubmit as any}
                    labelStyle={{ color: "black" }}
                    icon={"send"}
                    mode="contained"
                    textColor="black"
                    style={{
                      borderRadius: 7,
                      backgroundColor: Colors.button_secondary,
                      paddingVertical: moderateScale(5),
                      flex: 1,
                    }}
                  >
                    Kirim
                  </Button>
                </View>
              </>
            );
          }}
        </Formik>
      </View>

      <Portal>
        <Modal
          visible={modal}
          onDismiss={() => setModal(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            height: "60%",
            paddingHorizontal: 15,
            paddingVertical: 20,
          }}
        >
          <Searchbar
            value={searchUsers}
            iconColor={Colors.text_secondary}
            inputStyle={{
              color: Colors.text_primary,
            }}
            onChangeText={(text) => setsearchUsers(text)}
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

          {data?.data.data.length === 0 ? (
            <NotFoundSearch />
          ) : isPending ? (
            <Loading />
          ) : (
            <FlashList
              showsVerticalScrollIndicator={false}
              data={data?.data.data}
              keyExtractor={(item) => item.id.toString()}
              estimatedItemSize={15}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectValue({
                      label: item.full_name,
                      value: item.id,
                    });
                    setModal(false);
                    setsearchUsers("");
                  }}
                  style={{
                    marginBottom:
                      index === (data?.data?.meta.total as number) - 1 ? 0 : 20,
                    borderBottomWidth: 1,
                    paddingBottom: 15,
                    borderBottomColor: Colors.border_primary,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: Colors.text_primary,
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {item.full_name}
                    </Text>

                    <View style={{ marginTop: 3 }}>
                      <Text
                        style={{
                          color: Colors.text_primary,
                          fontSize: 15,
                          fontWeight: "500",
                        }}
                      >
                        {item.nip} / {item.nrk}
                      </Text>

                      {/* Should SKPD */}

                      <Text
                        style={{
                          color: Colors.text_primary,
                          fontSize: 15,
                          fontWeight: "500",
                          fontStyle: "italic",
                        }}
                      >
                        {item.uke?.skpd?.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ListFooterComponent={() => (
                <Pagination
                  loading={isPending}
                  page={page}
                  setPage={setPage}
                  totalPage={data?.data.meta.totalPages as number}
                  horizontal={0}
                />
              )}
            />
          )}
        </Modal>
      </Portal>
    </ContainerBackground>
  );
}
