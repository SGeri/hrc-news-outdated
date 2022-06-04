import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { CheckBox } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from "react-native-vector-icons/FontAwesome";
import Icon5 from "react-native-vector-icons/FontAwesome5";

import { validate as validateEmail } from "email-validator";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    alignItems: "center",
    padding: "8%",
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
    marginBottom: "-5%",
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
    backgroundColor: "black",

    padding: 5,
  },
  submitButtonText: {
    fontFamily: "ChairdrobeRoundedBold",
    textAlign: "center",
    fontSize: 26,
    color: "white",
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

export default class Settings extends React.Component {
  state = {
    notifications: [],
    newsletter: false,
    newsletterEmail: "",
  };

  async componentDidMount() {
    try {
      const newsletter = await AsyncStorage.getItem("@newsletter");

      if (newsletter == "true") {
        this.setState({ newsletter: true });
      }
    } catch (e) {
      alert(e);
    }
  }

  toggleNotification = (notification) => {
    this.setState((prevState) => {
      if (prevState.notifications.includes(notification)) {
        return {
          notifications: prevState.notifications.filter(
            (n) => n !== notification
          ),
        };
      } else {
        return {
          notifications: [...prevState.notifications, notification],
        };
      }
    });
  };

  onSubscribe = async () => {
    const { newsletterEmail } = this.state;

    if (validateEmail(newsletterEmail)) {
      alert("Sikeresen feliratkoztál a hírlevélre!");

      try {
        AsyncStorage.setItem("@newsletter", "true");
      } catch (e) {
        alert("Hiba történt: " + e);
      }
    } else {
      alert("Hibás email cím!");
    }
  };

  render() {
    const { notifications, newsletter, newsletterEmail } = this.state;

    return (
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require("../images/huroc_logo_v2.png")}
            style={{
              width: 100,
              height: 100,
              marginBottom: "5%",
            }}
          />
          <Text style={[styles.header, { marginBottom: "10%" }]}>
            Beállítások
          </Text>

          <Text style={[styles.boldParagraph, { marginBottom: "5%" }]}>
            Milyen típusú hírekről szeretnél értesítéseket kapni?
          </Text>

          <CheckBoxComponent
            text="Service Status értesítések"
            checked={notifications.includes("SS")}
            onPress={() => this.toggleNotification("SS")}
          />
          <CheckBoxComponent
            text="GTA Online értesítések"
            checked={notifications.includes("GTAO")}
            onPress={() => this.toggleNotification("GTAO")}
          />
          <CheckBoxComponent
            text="Red Dead Online értesítések"
            checked={notifications.includes("RDO")}
            onPress={() => this.toggleNotification("RDO")}
          />
          <CheckBoxComponent
            text="Grand Theft Auto VI értesítések"
            checked={notifications.includes("GTAVI")}
            onPress={() => this.toggleNotification("GTAVI")}
          />
          <CheckBoxComponent
            text="Grand Theft Auto: The Triology értesítések"
            checked={notifications.includes("GTAT")}
            onPress={() => this.toggleNotification("GTAT")}
          />
          <CheckBoxComponent
            text="Rockstar Games értesítések"
            checked={notifications.includes("RG")}
            onPress={() => this.toggleNotification("RG")}
          />
          <CheckBoxComponent
            text="Take-Two Interactive értesítések"
            checked={notifications.includes("TT")}
            onPress={() => this.toggleNotification("TT")}
          />
          <CheckBoxComponent
            text="Hungarian Rockstar Club értesítések"
            checked={notifications.includes("HUROC")}
            onPress={() => this.toggleNotification("HUROC")}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              { marginTop: "10%", marginBottom: "10%" },
            ]}
            onPress={this.onSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Mentés</Text>
          </TouchableOpacity>

          {!newsletter && (
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
          )}

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: newsletter ? 0 : "10%",
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  marginTop: "10%",
                  marginBottom: "10%",
                  width: 120,
                  height: 40,
                  marginRight: 5,
                },
              ]}
              onPress={this.onSubmit}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.submitButtonText,
                  { fontSize: 18, marginTop: 2 },
                ]}
              >
                Jogi Nyilatkozat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  marginTop: "10%",
                  marginBottom: "10%",
                  width: 120,
                  height: 40,
                  marginLeft: 5,
                },
              ]}
              onPress={this.onSubmit}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.submitButtonText,
                  { fontSize: 18, marginTop: 2 },
                ]}
              >
                Adatvédelem
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Icon
              name="facebook-square"
              size={25}
              color="white"
              style={{
                margin: 10,
                marginBottom: 0,
              }}
              onPress={() => {
                Linking.openURL("https://facebook.com/hungarianrockstarclub");
              }}
            />
            <Icon
              name="instagram"
              size={25}
              color="white"
              style={{
                margin: 10,
                marginBottom: 0,
              }}
              onPress={() => {
                Linking.openURL("https://instagram.com/rockstarhungary");
              }}
            />
            <Icon5
              name="discord"
              size={25}
              color="white"
              style={{
                margin: 10,
                marginBottom: 0,
              }}
              onPress={() => {
                Linking.openURL("https://discord.me/rockstarhun");
              }}
            />
            <Icon
              name="youtube-play"
              size={25}
              color="white"
              style={{
                margin: 10,
                marginBottom: 0,
              }}
              onPress={() => {
                Linking.openURL("https://youtube.com/rockstarhungary");
              }}
            />
            <Icon
              name="twitter-square"
              size={25}
              color="white"
              style={{
                margin: 10,
                marginBottom: 0,
              }}
              onPress={() => {
                Linking.openURL("https://twitter.com/rockstarhungary");
              }}
            />
          </View>

          <View style={{ marginTop: 10, marginBottom: "10%" }}>
            <Text style={[styles.boldParagraph, { textAlign: "center" }]}>
              Hungarian Rockstar Club EV. {"\n"}
              2022 Minden jog fenntartva.
            </Text>
          </View>
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
