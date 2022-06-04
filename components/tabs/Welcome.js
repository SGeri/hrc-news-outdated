import React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CheckBox } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { validate as validateEmail } from "email-validator";
import axios from "axios";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: "8%",
    backgroundColor: "#121212",
  },
  header: {
    fontFamily: "ChairdrobeRoundedBold",
    fontSize: 42,
    color: "white",
  },
  boldParagraph: {
    fontFamily: "NotoSansBold",
    fontSize: 14,
    color: "white",
    width: "100%",
    textAlignVertical: "center",
  },
  checkboxContainer: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  checkboxText: {
    fontFamily: "NotoSansRegular",
    fontSize: 12,
    color: "white",
    flex: 1,
  },
  textInput: {
    height: 40,
    width: "75%",
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 10,
    backgroundColor: "white",
  },
  submitButton: {
    height: 50,
    width: 140,

    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    backgroundColor: "#000000",

    padding: 5,
  },
  submitButtonText: {
    color: "white",
    fontFamily: "ChairdrobeRoundedBold",
    textAlign: "center",
    fontSize: 28,
  },
  newsletterInputWrapper: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  newsletterButton: {
    height: 38,
    width: "25%",
    backgroundColor: "#ffa500",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  newsletterButtonText: {
    fontFamily: "NotoSansRegular",
    fontSize: 11,
  },
});

class Welcome extends React.Component {
  state = {
    acceptLegal: false,
    acceptPrivacy: false,
    newsletterEmail: "",
  };

  onSubmit = async () => {
    const { acceptLegal, acceptPrivacy } = this.state;

    if (!acceptLegal || !acceptPrivacy) {
      this.setState({
        error:
          "Kérjük, az alkalmazás használatához fogadd el a szükséges dokumentumokat!",
      });

      return;
    }

    try {
      await AsyncStorage.setItem("@acceptedPolicies", "true");
    } catch (e) {
      this.setState({
        error: "Hiba történt: " + e,
      });
      return;
    }

    this.props.navigation.navigate("Hírek");
  };

  onSubscribe = async () => {
    const { newsletterEmail } = this.state;

    if (validateEmail(newsletterEmail)) {
      const res = {
        data: {
          success: true,
          message: "Sikeresen feliratkoztál.",
        },
      };

      if (res.data.success) {
        try {
          AsyncStorage.setItem("@newsletter", "true");
        } catch (e) {
          this.setState({
            error: "Hiba történt: " + e,
          });
        }
      } else {
        this.setState({
          error: "Hiba történt: " + res.data.message,
        });
      }
    }
  };

  render() {
    const { acceptLegal, acceptPrivacy, newsletterEmail, error } = this.state;

    return (
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require("../images/huroc_logo_v2.png")}
            style={{
              width: 100,
              height: 100,
              marginTop: "10%",
              marginBottom: "5%",
            }}
          />
          <Text style={[styles.header, { marginBottom: "18%" }]}>
            Üdvözlünk!
          </Text>

          <Text style={[styles.boldParagraph, { marginBottom: "10%" }]}>
            Üdvözlünk a HRC News-ban! Köszönjük, hogy letöltötted
            alkalmazásunkat és érdeklődsz a legfrissebb hírek iránt!
          </Text>

          <Text style={[styles.boldParagraph, { marginBottom: "5%" }]}>
            Mielőtt belevágunk, kérjük erősítsd meg, hogy elolvastad és
            elfogadod a Jogi Nyilatkozatunkban és Adatkezelési Tájékoztatónkban
            foglaltakat.
          </Text>

          <CheckBoxComponent
            text="Elolvastam, tudomásul vettem és elfogadom a Jogi Nyilatkozatban foglaltakat."
            name="acceptLegal"
            checked={acceptLegal}
            onPress={() => this.setState({ acceptLegal: !acceptLegal })}
          />
          <CheckBoxComponent
            text="Elolvastam, tudomásul vettem és elfogadom az Adatkezelési Tájékoztatóban foglaltakat."
            checked={acceptPrivacy}
            onPress={() => this.setState({ acceptPrivacy: !acceptPrivacy })}
          />

          <Text
            style={[
              styles.boldParagraph,
              { marginTop: "5%", marginBottom: "5%" },
            ]}
          >
            Lehetőséged van feliratkozni a HRC Newsletter hírlevélre is, hogy
            azonnal értesülj minden bejelentésről, nyereményjátékról és
            frissítésről.
          </Text>

          <View style={styles.newsletterInputWrapper}>
            <TextInput
              style={[styles.textInput]}
              placeholder="Email cím"
              onChangeText={(v) => {
                this.setState({ newsletterEmail: v });
              }}
              value={newsletterEmail}
              selectionColor="black"
            />
            <TouchableOpacity
              style={styles.newsletterButton}
              onPress={this.onSubscribe}
              activeOpacity={0.8}
            >
              <Text style={styles.newsletterButtonText}>Feliratkozás</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgb(255, 107, 107)",
                borderRadius: 5,
                padding: 20,
                marginTop: "5%",
                marginBottom: "5%",
                backgroundColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontFamily: "NotoSansBold",
                  color: "white",
                  fontSize: 18,
                }}
              >
                Hiba
              </Text>
              <Text
                style={{
                  fontFamily: "NotoSansRegular",
                  color: "white",
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              { marginTop: "5%", marginBottom: "10%" },
            ]}
            onPress={this.onSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Tovább</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

function CheckBoxComponent(props) {
  return (
    <View style={styles.checkboxContainer}>
      <CheckBox {...props} checkedColor="#ffa500" />
      <Text style={styles.checkboxText}>{props.text}</Text>
    </View>
  );
}

export default Welcome;
