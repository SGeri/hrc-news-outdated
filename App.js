import React from "react";
import { View, Text, Image, Linking, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

import Icon from "react-native-vector-icons/FontAwesome";
import IconFontisto from "react-native-vector-icons/Fontisto";

import Welcome from "./components/tabs/Welcome";
import News from "./components/tabs/News";
import Status from "./components/tabs/Status";
import Guide from "./components/tabs/Guide";
import Settings from "./components/tabs/Settings";

const TabNavigator = createBottomTabNavigator();

const navTheme = DefaultTheme;
navTheme.colors.background = "black";

class App extends React.Component {
  state = { loaded: false, firstTime: true };

  async componentDidMount() {
    try {
      AsyncStorage.getItem("@acceptedPolicies").then((value) => {
        if (value == "true") {
          this.setState({ firstTime: false });
        }
      });
    } catch (e) {
      alert("Hiba történt az olvasás közben: " + e);
    }
  }

  LoadFonts = async () => {
    await Font.loadAsync({
      ChairdrobeRoundedBold: require("./components/fonts/ChairdrobeRoundedBold.otf"),
      BebasNeueRegular: require("./components/fonts/BebasNeueRegular.ttf"),
      NotoSansRegular: require("./components/fonts/NotoSansRegular.ttf"),
      NotoSansBold: require("./components/fonts/NotoSansBold.ttf"),
    });
  };

  render() {
    const { loaded, firstTime } = this.state;

    if (!loaded) {
      return (
        <AppLoading
          startAsync={this.LoadFonts}
          onFinish={() => this.setState({ loaded: true })}
          onError={(e) => console.log(e)}
        />
      );
    }

    return (
      <NavigationContainer>
        <TabNavigator.Navigator
          initialRouteName={firstTime ? "Welcome" : "Hírek"}
          screenOptions={{
            headerShown: true,
            headerTitle: () => <HeaderTitle />,
            headerRight: () => <HeaderRight />,

            tabBarShowLabel: false,
            gestureEnabled: false,
            tabBarActiveTintColor: "#ffa500",
            tabBarInactiveTintColor: "#000",
          }}
        >
          {firstTime && (
            <TabNavigator.Screen
              name="Welcome"
              component={Welcome}
              options={{
                headerShown: false,
                tabBarButton: () => null,
                tabBarStyle: {
                  display: "none",
                },
              }}
            />
          )}
          <TabNavigator.Screen
            name="Hírek"
            component={News}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon
                  name="globe"
                  size={25}
                  color={focused ? "#ffa500" : "#000"}
                />
              ),
            }}
          />
          <TabNavigator.Screen
            name="Status"
            component={Status}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon
                  name="wifi"
                  size={25}
                  color={focused ? "#ffa500" : "#000"}
                />
              ),
            }}
          />
          <TabNavigator.Screen
            name="Útmutató"
            component={Guide}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon
                  name="file-text-o"
                  size={25}
                  color={focused ? "#ffa500" : "#000"}
                />
              ),
            }}
          />
          <TabNavigator.Screen
            name="Beállítások"
            component={Settings}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon
                  name="bell-o"
                  size={25}
                  color={focused ? "#ffa500" : "#000"}
                />
              ),
            }}
          />
        </TabNavigator.Navigator>
      </NavigationContainer>
    );
  }
}

function HeaderTitle() {
  return (
    <TouchableOpacity
      style={{ display: "flex", flexDirection: "row" }}
      activeOpacity={0.8}
      onPress={() => {
        Linking.openURL("https://huroc.com/hrc-news");
      }}
    >
      <Image
        source={require("./components/images/huroc_logo_v1.png")}
        style={{ width: 30, height: 30, marginRight: 10 }}
      />
      <View style={{ display: "flex", justifyContent: "center" }}>
        <Text style={{ fontFamily: "ChairdrobeRoundedBold", fontSize: 20 }}>
          HRC News
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function HeaderRight() {
  return <Icons statusColor="black" />;
}

function Icons(props) {
  return (
    <View style={{ display: "flex", flexDirection: "row", marginRight: 15 }}>
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
        color={props.statusColor}
        onPress={() => {
          Linking.openURL("https://huroc.com/status");
        }}
      />
    </View>
  );
}

export default App;
