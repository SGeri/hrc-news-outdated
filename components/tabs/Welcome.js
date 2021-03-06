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
          "K??rj??k, az alkalmaz??s haszn??lat??hoz fogadd el a sz??ks??ges dokumentumokat!",
      });

      return;
    }

    try {
      await AsyncStorage.setItem("@acceptedPolicies", "true");
    } catch (e) {
      this.setState({
        error: "Hiba t??rt??nt: " + e,
      });
      return;
    }

    this.props.navigation.navigate("H??rek");
  };

  onSubscribe = async () => {
    const { newsletterEmail } = this.state;

    if (validateEmail(newsletterEmail)) {
      const res = {
        data: {
          success: true,
          message: "Sikeresen feliratkozt??l.",
        },
      };

      if (res.data.success) {
        try {
          AsyncStorage.setItem("@newsletter", "true");
        } catch (e) {
          this.setState({
            error: "Hiba t??rt??nt: " + e,
          });
        }
      } else {
        this.setState({
          error: "Hiba t??rt??nt: " + res.data.message,
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
            ??dv??zl??nk!
          </Text>

          <Text style={[styles.boldParagraph, { marginBottom: "10%" }]}>
            ??dv??zl??nk a HRC News-ban! K??sz??nj??k, hogy let??lt??tted
            alkalmaz??sunkat ??s ??rdekl??dsz a legfrissebb h??rek ir??nt!
          </Text>

          <Text style={[styles.boldParagraph, { marginBottom: "5%" }]}>
            Miel??tt belev??gunk, k??rj??k er??s??tsd meg, hogy elolvastad ??s
            elfogadod a Jogi Nyilatkozatunkban ??s Adatkezel??si T??j??koztat??nkban
            foglaltakat.
          </Text>

          <CheckBoxComponent
            text="Elolvastam, tudom??sul vettem ??s elfogadom a Jogi Nyilatkozatban foglaltakat."
            name="acceptLegal"
            checked={acceptLegal}
            onPress={() => this.setState({ acceptLegal: !acceptLegal })}
          />
          <CheckBoxComponent
            text="Elolvastam, tudom??sul vettem ??s elfogadom az Adatkezel??si T??j??koztat??ban foglaltakat."
            checked={acceptPrivacy}
            onPress={() => this.setState({ acceptPrivacy: !acceptPrivacy })}
          />

          <Text
            style={[
              styles.boldParagraph,
              { marginTop: "5%", marginBottom: "5%" },
            ]}
          >
            Lehet??s??ged van feliratkozni a HRC Newsletter h??rlev??lre is, hogy
            azonnal ??rtes??lj minden bejelent??sr??l, nyerem??nyj??t??kr??l ??s
            friss??t??sr??l.
          </Text>

          <View style={styles.newsletterInputWrapper}>
            <TextInput
              style={[styles.textInput]}
              placeholder="Email c??m"
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
              <Text style={styles.newsletterButtonText}>Feliratkoz??s</Text>
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
            <Text style={styles.submitButtonText}>Tov??bb</Text>
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
