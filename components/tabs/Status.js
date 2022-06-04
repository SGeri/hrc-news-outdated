import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconFontisto from "react-native-vector-icons/Fontisto";
import axios from "axios";

const styles = StyleSheet.create({
  loadingWrapper: {
    height: "100%",
    width: "100%",
    padding: "10%",
  },
  container: {
    alignItems: "center",
    paddingLeft: "8%",
    paddingRight: "8%",
  },
  header: {
    fontFamily: "ChairdrobeRoundedBold",
    fontSize: 42,
    color: "white",
  },
  title: {
    fontFamily: "NotoSansBold",
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  subTitle: {
    fontFamily: "NotoSansRegular",
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
  messageWrapper: {
    backgroundColor: "#000000",
    padding: "8%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginBottom: "5%",
    width: "100%",
    borderColor: "#ffffff",
    borderWidth: 1,
  },
  messageTitle: {
    fontFamily: "ChairdrobeRoundedBold",
    fontSize: 26,
    color: "white",
    marginBottom: 20,
  },
  messageText: {
    fontFamily: "NotoSansRegular",
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
  platformWrapper: {
    width: "100%",
    padding: "5%",
    backgroundColor: "#000000",
    borderRadius: 5,
    marginBottom: "10%",
    borderColor: "#ffffff",
    borderWidth: 1,
  },
  platformRow: {
    flexDirection: "row",
  },
  platformText: {
    fontFamily: "NotoSansBold",
    fontSize: 18,
    color: "white",
    marginLeft: 5,
  },
});

class Status extends React.Component {
  state = {
    statusData: {},
    messages: [],
    refreshing: false,
    loading: true,
  };

  componentDidMount = async () => {
    await this.refreshData();

    this.props.navigation.addListener("focus", async () => {
      this.refreshData();
    });
  };

  refreshData = async () => {
    await this.loadStatus();

    this.props.navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginRight: 15,
          }}
        >
          <IconFontisto
            name="messenger"
            size={25}
            color="#000"
            style={{
              marginRight: 10,
            }}
            onPress={() => {
              Linking.openURL("https://m.me/hungarianrockstarclub");
            }}
          />

          <Icon
            name="wifi"
            size={25}
            color="#00ff00"
            onPress={() => {
              Linking.openURL("https://huroc.com/status");
            }}
          />
        </View>
      ),
    });
  };

  loadStatus = async () => {
    this.setState({ loading: true });

    const response = {
      data: {
        success: true,
        message: "Sikeresen lekérdezve.",
        status: {
          GTAO: {
            PC: "Elérhető / UP",
            PS4: "Elérhető / UP",
            X1: "Elérhető / UP",
            XCG: "Elérhető / UP",
          },
          RDO: {
            PC: "Elérhető / UP",
            PS4: "Elérhető / UP",
            X1: "Elérhető / UP",
            Stadia: "Elérhető / UP",
            XCG: "Elérhető / UP",
          },
          RGL: {
            Authentication: "Elérhető / UP",
            Store: "Elérhető / UP",
            CS: "Elérhető / UP",
            Downloads: "Elérhető / UP",
          },
          SC: {
            AS: "Elérhető / UP",
          },
        },
      },
    };

    if (response.data.success) {
      this.setState({
        statusData: response.data.status,
      });
    } else {
      alert("Hiba történt: " + response.data.message);
    }

    const response2 = {
      data: {
        success: true,
        message: "Az üzenetek sikeresen lekérdezve.",
        messages: ["Jelenleg karbantartásokat végzünk oldalunkon."],
      },
    };

    if (response2.data.success) {
      this.setState({
        messages: response2.data.messages,
      });
    } else {
      alert("Hiba történt: " + response2.data.message);
    }

    this.setState({ loading: false });
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.refreshData();
    this.setState({ refreshing: false });
  };

  getHeaderStatus = () => {
    const { statusData } = this.state;

    let statusHeader = "";

    for (const [statusCategory, statusCategoryValue] of Object.entries(
      statusData
    )) {
      for (const [statusPlatform, statusPlatformValue] of Object.entries(
        statusCategoryValue
      )) {
        if (statusPlatformValue === "Korlátozott / Limited") {
          statusHeader =
            "Néhány szolgáltatás állapota jelenleg: Korlátozott / Limited";
          break;
        } else if (statusPlatformValue === "Nem elérhető / Down") {
          statusHeader =
            "Néhány szolgáltatás állapota jelenleg: Nem elérhető / Down";
          break;
        } else if (
          statusCategory === "SC" &&
          statusPlatform === "AS" &&
          statusPlatformValue === "Elérhető / UP"
        ) {
          statusHeader = "Jelenleg minden szolgáltatás állapota: Elérhető / UP";
        }
      }
    }

    return statusHeader;
  };

  render() {
    const { messages, statusData, refreshing, loading } = this.state;

    let messageBoxes = messages.map((message, index) => {
      return (
        <View style={styles.messageWrapper} key={index}>
          <Text style={styles.messageTitle}>Közlemény</Text>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      );
    });

    let statusHeader = this.getHeaderStatus();

    let statusHeaderColor = "";

    if (
      statusHeader ==
      "Néhány szolgáltatás állapota jelenleg: Korlátozott / Limited"
    )
      statusHeaderColor = "#FFA500";
    if (
      statusHeader ==
      "Néhány szolgáltatás állapota jelenleg: Nem elérhető / Down"
    )
      statusHeaderColor = "#FF0000";
    if (statusHeader == "Jelenleg minden szolgáltatás állapota: Elérhető / UP")
      statusHeaderColor = "#00FF00";

    let date = new Date();
    let dateString =
      date.getFullYear() +
      ". " +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ". " +
      ("0" + date.getDate()).slice(-2) +
      ". " +
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2);

    return (
      <ScrollView
        refreshing={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#ffa500" />
          </View>
        ) : (
          <View style={{ backgroundColor: "#121212" }}>
            <View style={styles.container}>
              <Text style={[styles.header, { marginTop: "10%" }]}>
                Rockstar Games
              </Text>
              <Text style={[styles.header, { marginBottom: "13%" }]}>
                Service Status
              </Text>

              <Icon name="wifi" size={40} color={statusHeaderColor} />

              <Text
                style={[
                  styles.title,
                  {
                    marginTop: "5%",
                    color: statusHeaderColor,
                  },
                ]}
              >
                {statusHeader}
              </Text>
              <Text
                style={[
                  styles.subTitle,
                  { marginTop: "2%", marginBottom: "20%" },
                ]}
              >
                Utoljára frissítve: {dateString}
              </Text>

              {messages.length > 0 && (
                <View style={{ width: "100%", marginBottom: "20%" }}>
                  {messageBoxes}
                </View>
              )}
            </View>
            <View style={styles.container}>
              {statusData.GTAO && (
                <View style={[styles.platformWrapper]}>
                  <Text
                    style={[styles.header, { fontSize: 30, marginBottom: 20 }]}
                  >
                    GTA Online
                  </Text>

                  <PlatformInfoBox platform="PC" status={statusData.GTAO.PC} />
                  <PlatformInfoBox
                    platform="PS4"
                    status={statusData.GTAO.PS4}
                  />
                  <PlatformInfoBox
                    platform="Xbox One"
                    status={statusData.GTAO.X1}
                  />
                  <PlatformInfoBox
                    platform="Xbox Cloud Gaming"
                    status={statusData.GTAO.XCG}
                  />
                </View>
              )}
              {statusData.RDO && (
                <View style={styles.platformWrapper}>
                  <Text
                    style={[styles.header, { fontSize: 30, marginBottom: 20 }]}
                  >
                    Red Dead Online
                  </Text>

                  <PlatformInfoBox platform="PC" status={statusData.RDO.PC} />
                  <PlatformInfoBox platform="PS4" status={statusData.RDO.PS4} />
                  <PlatformInfoBox
                    platform="Xbox One"
                    status={statusData.RDO.X1}
                  />
                  <PlatformInfoBox
                    platform="Stadia"
                    status={statusData.RDO.Stadia}
                  />
                  <PlatformInfoBox
                    platform="Xbox Cloud Gaming"
                    status={statusData.RDO.XCG}
                  />
                </View>
              )}
              {statusData.RGL && (
                <View style={styles.platformWrapper}>
                  <Text
                    style={[styles.header, { fontSize: 30, marginBottom: 20 }]}
                  >
                    Rockstar Games Launcher
                  </Text>

                  <PlatformInfoBox
                    platform="Hitelesítés / Authentication"
                    status={statusData.RGL.Authentication}
                  />
                  <PlatformInfoBox
                    platform="Bolt / Store"
                    status={statusData.RGL.Store}
                  />
                  <PlatformInfoBox
                    platform="Felhő szolgáltatások / Cloud Services"
                    status={statusData.RGL.CS}
                  />
                  <PlatformInfoBox
                    platform="Letöltések / Downloads"
                    status={statusData.RGL.Downloads}
                  />
                </View>
              )}
              {statusData.SC && (
                <View style={[styles.platformWrapper, { marginBottom: "15%" }]}>
                  <Text
                    style={[
                      styles.header,
                      { fontSize: 30, marginBottom: "10%" },
                    ]}
                  >
                    Social Club
                  </Text>

                  <PlatformInfoBox
                    platform="Minden szolgáltatás"
                    status={statusData.SC.AS}
                  />
                </View>
              )}
            </View>

            <View style={[styles.container, { alignItems: "baseline" }]}>
              <Text
                style={[styles.header, { fontSize: 30, marginBottom: "5%" }]}
              >
                Mit jelent?
              </Text>
              <View style={{ marginBottom: "5%" }}>
                <View style={styles.platformRow}>
                  <Icon
                    style={{ margin: 5 }}
                    name="circle"
                    size={15}
                    color="#00FF0F"
                  />
                  <Text style={[styles.platformText, { color: "#00FF0F" }]}>
                    Elérhető / UP
                  </Text>
                </View>
                <Text
                  style={[
                    styles.platformText,
                    {
                      color: "white",
                      marginLeft: 28,
                      fontFamily: "NotoSansRegular",
                      fontSize: 14,
                    },
                  ]}
                >
                  Ebben az esetben a játékok, szolgáltatások probléma nélkül
                  működnek.
                </Text>
              </View>
              <View style={{ marginBottom: "5%" }}>
                <View style={styles.platformRow}>
                  <Icon
                    style={{ margin: 5 }}
                    name="circle"
                    size={15}
                    color="#FFA500"
                  />
                  <Text style={[styles.platformText, { color: "#FFA500" }]}>
                    Korlátozott / Limited
                  </Text>
                </View>
                <Text
                  style={[
                    styles.platformText,
                    {
                      color: "white",
                      marginLeft: 28,
                      fontFamily: "NotoSansRegular",
                      fontSize: 14,
                    },
                  ]}
                >
                  Ebben az esetben az adott játék / szolgáltatás korlátozottan
                  elérhető. Elképzelhető, hogy lehet csatlakozni az adott
                  játékhoz, de súlyos hibák léphetnek fel. Az is előfordulhat,
                  hogy nem kerül mentésre az előrehaladás vagy elvesznek a
                  korábbi javak, tárgyak és egyéb tartalmak (szintek, pénz,
                  járművek, ingatlanok). Az eltűnt tartalmak visszaállítása nem
                  minden esetben lehetséges, ezért nem ajánlott ilyen esetben
                  elindítani a játékokat, szolgáltatásokat.
                </Text>
              </View>
              <View style={{ marginBottom: "15%" }}>
                <View style={styles.platformRow}>
                  <Icon
                    style={{ margin: 5 }}
                    name="circle"
                    size={15}
                    color="#FF0000"
                  />
                  <Text style={[styles.platformText, { color: "#FF0000" }]}>
                    Nem elérhető / Down
                  </Text>
                </View>
                <Text
                  style={[
                    styles.platformText,
                    {
                      color: "white",
                      marginLeft: 28,
                      fontFamily: "NotoSansRegular",
                      fontSize: 14,
                    },
                  ]}
                >
                  Ebben az esetben az adott játék / szolgáltatás egyáltalán nem
                  elérhető, csatlakozásra és/vagy vásárlásra nincs lehetőség.
                </Text>
              </View>
              <View
                style={{
                  marginBottom: "10%",
                  borderTopColor: "white",
                  borderTopWidth: 2,
                  paddingTop: "15%",
                }}
              >
                <Text
                  style={[
                    styles.platformText,
                    {
                      color: "grey",
                      marginLeft: 28,
                      fontFamily: "NotoSansRegular",
                      fontSize: 14,
                      textAlign: "center",
                    },
                  ]}
                >
                  Az oldalon automatikusan frissülnek az adatok a Rockstar Games
                  szervereinek állapota alapján, továbbá ugyanazt tartalmazzák,
                  mint a Rockstar Games Service Status oldal. Az oldalt
                  automatikus robot üzemelteti.
                </Text>
              </View>
              <View style={{ marginBottom: "10%" }}>
                <Text
                  style={[
                    styles.platformText,
                    {
                      color: "grey",
                      marginLeft: 28,
                      fontFamily: "NotoSansRegular",
                      fontSize: 14,
                      textAlign: "center",
                    },
                  ]}
                >
                  Ezt az oldalt nem a Rockstar Games vagy a Take-Two Interactive
                  üzemelteti. A huroc.com oldal nem hivatalos csatorna, a
                  Hungarian Rockstar Fan Club pedig nem áll kapcsolatban sem a
                  Rockstar Games, sem a Take-Two Interactive vállalatokkal.
                </Text>
              </View>
              <View style={{ marginBottom: "15%" }}>
                <Text
                  style={[
                    styles.platformText,
                    {
                      color: "grey",
                      marginLeft: 28,
                      fontFamily: "NotoSansRegular",
                      fontSize: 14,
                      textAlign: "center",
                    },
                  ]}
                >
                  This page in unofficial and is not produced or maintained by
                  Rockstar Games, Inc. or Take-Two Interactive Software, Inc.
                  Please note that we are not affiliated with Rockstar Games and
                  our company is fan-created.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

function PlatformInfoBox(props) {
  return (
    <View style={{ marginBottom: 15 }}>
      <View style={styles.platformRow}>
        <Icon
          style={{ margin: 5 }}
          name="circle"
          size={15}
          color={statusToColor(props.status)}
        />
        <Text
          style={[styles.platformText, { color: statusToColor(props.status) }]}
        >
          {props.platform}
        </Text>
      </View>
      <Text style={[styles.platformText, { color: "white", marginLeft: 28 }]}>
        {props.status}
      </Text>
    </View>
  );
}

function statusToColor(status) {
  if (status == "Elérhető / UP") {
    return "#00FF00";
  } else if (status == "Korlátozott / Limited") {
    return "#FFA500";
  } else {
    return "#FF0000";
  }
}

export default Status;
