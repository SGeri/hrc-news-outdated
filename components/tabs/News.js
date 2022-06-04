import React, { useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  RefreshControl,
  ActivityIndicator,
  BackHandler,
  Animated,
} from "react-native";
import axios from "axios";

import Icon from "react-native-vector-icons/FontAwesome";
import IconFontisto from "react-native-vector-icons/Fontisto";

const monthNames = [
  "január",
  "február",
  "március",
  "április",
  "május",
  "június",
  "július",
  "augusztus",
  "szeptember",
  "október",
  "november",
  "december",
];

const styles = StyleSheet.create({
  loadingWrapper: {
    height: "100%",
    width: "100%",
    padding: "10%",
  },
  container: {
    padding: "8%",
  },
  cardWrapper: {
    height: 320,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#000000",
    marginBottom: "10%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  cardImage: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  cardTextWrapper: {
    height: "40%",
    padding: "5%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  cardTimestampWrapper: {
    flexDirection: "row",
  },
  cardTimestamp: {
    fontFamily: "NotoSansRegular",
    fontSize: 12,
  },
  cardTitle: {
    color: "white",
    fontFamily: "NotoSansBold",
    fontSize: 18,
  },
  pinnedPostWrapper: {
    width: "100%",
    height: 400,
    backgroundColor: "#000000",
    borderBottomColor: "rgba(255,255,255,0.5)",
    borderBottomWidth: 1,
  },
  pinnedImage: {
    width: "100%",
    height: "60%",
  },
  loadMoreButton: {
    height: 40,
    width: 180,

    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    backgroundColor: "#000000",

    padding: 5,
  },
  loadMoreButtonText: {
    color: "white",
    fontFamily: "ChairdrobeRoundedBold",
    textAlign: "center",
    fontSize: 22,
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

class News extends React.Component {
  state = {
    activePostData: [],
    fullPostData: [],
    lastPostLoadedIndex: 0,
    refreshing: false,
    loading: true,
  };

  componentDidMount = async () => {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);

    await this.refreshData();

    this.props.navigation.addListener("focus", async () => {
      await this.refreshData();
    });
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  refreshData = async () => {
    await this.loadPosts();

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

  loadPosts = async () => {
    this.setState({ loading: true });

    const response = {
      data: {
        success: true,
        message: "Sikeresen lekérdezve.",
        pinnedPost: {
          id: 30,
          title: "Bemutatkozik a GTA+ a GTA Online-hoz",
          releaseDate: "2022-04-16T16:11:25.037Z",
          thumbURL:
            "https://huroc.com/wp-content/uploads/2022/03/gta-plus-new-rockstar.jpg",
          category: "GTA Online",
          link: "https://huroc.com/introducing-gta-plus/",
        },
        posts: [
          {
            id: 32,
            title:
              "Megérkezett a GTAV és a GTA Online PS5 és Xbox Series X|S kiadása",
            releaseDate: "2022-04-16T16:12:18.715Z",
            thumbURL:
              "https://huroc.com/wp-content/uploads/2022/03/gtav-and-gta-online-artwork-new-rockstar.jpg",
            category: "GTAV",
            link: "https://huroc.com/gtav-and-gta-online-out-now/",
          },
          {
            id: 31,
            title:
              "A Tough Business bónuszok a Red Dead Online-ban egész hónapban",
            releaseDate: "2022-04-16T16:11:49.624Z",
            thumbURL:
              "https://huroc.com/wp-content/uploads/2022/04/telegram-mission-artwork-new-rockstar.jpg",
            category: "Red Dead Online",
            link: "https://huroc.com/red-dead-online-weekly-update-22-04-05",
          },
          {
            id: 29,
            title: "Középpontban a Gunrunning Criminal Career a GTA Online-ban",
            releaseDate: "2022-04-16T16:10:54.837Z",
            thumbURL:
              "https://huroc.com/wp-content/uploads/2022/04/business-bonuses-new-rockstar.jpg",
            category: "GTA Online",
            link: "https://huroc.com/gta-online-weekly-update-22-04-14/",
          },
        ],
      },
    };

    if (response.data.success) {
      this.setState({
        pinnedPost: response.data.pinnedPost,
        fullPostData: response.data.posts,
        activePostData: response.data.posts.slice(0, 5),
        lastPostLoadedIndex: 4,
      });
    } else {
      alert("Hiba történt: " + response.data.message);
    }

    this.setState({ loading: false });
  };

  formatTimestamp(timestamp) {
    let date = new Date(timestamp);

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return `${year}. ${monthNames[month - 1]} ${day}.`;
  }

  loadMore = () => {
    const { lastPostLoadedIndex, activePostData, fullPostData } = this.state;

    let newPostData = fullPostData.slice(
      lastPostLoadedIndex + 1,
      lastPostLoadedIndex + 5
    );
    let newActivePostData = [...activePostData, ...newPostData];

    this.setState({
      activePostData: newActivePostData,
      lastPostLoadedIndex: lastPostLoadedIndex + newPostData.length,
    });
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    this.refreshData();
    this.setState({ refreshing: false });
  };

  render() {
    const {
      activePostData,
      fullPostData,
      lastPostLoadedIndex,
      pinnedPost,
      refreshing,
      loading,
    } = this.state;

    let posts = activePostData.map((post, index) => {
      return (
        <NewsCard
          key={index}
          title={post.title}
          thumbURL={post.thumbURL}
          category={post.category}
          timestamp={this.formatTimestamp(post.releaseDate)}
          link={post.link}
        />
      );
    });

    return (
      <ScrollView
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
            {pinnedPost && (
              <TouchableOpacity
                style={[styles.pinnedPostWrapper, { marginBottom: "5%" }]}
                activeOpacity={0.8}
                onPress={() => {
                  Linking.openURL(pinnedPost.link);
                }}
              >
                <Image
                  style={styles.pinnedImage}
                  source={{ uri: pinnedPost.thumbURL }}
                />
                <View style={[styles.cardTextWrapper, { padding: "8%" }]}>
                  <View style={styles.cardTimestampWrapper}>
                    <Text style={[styles.cardTimestamp, { color: "white" }]}>
                      {pinnedPost.category} |{" "}
                    </Text>
                    <Text style={[styles.cardTimestamp, { color: "grey" }]}>
                      {this.formatTimestamp(pinnedPost.releaseDate)}
                    </Text>
                  </View>
                  <Text style={[styles.cardTitle, { fontSize: 20 }]}>
                    {pinnedPost.title}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            <View style={styles.container}>
              {posts}
              {lastPostLoadedIndex != fullPostData.length - 1 && (
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity
                    style={[styles.loadMoreButton]}
                    onPress={this.loadMore}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.loadMoreButtonText}>
                      Több betöltése
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

function NewsCard(props) {
  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      activeOpacity={0.8}
      onPress={() => {
        Linking.openURL(props.link);
      }}
    >
      <Image style={styles.cardImage} source={{ uri: props.thumbURL }} />
      <View style={styles.cardTextWrapper}>
        <View style={styles.cardTimestampWrapper}>
          <Text style={[styles.cardTimestamp, { color: "white" }]}>
            {props.category} |{" "}
          </Text>
          <Text style={[styles.cardTimestamp, { color: "grey" }]}>
            {props.timestamp}
          </Text>
        </View>
        <Text style={[styles.cardTitle]}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default News;
