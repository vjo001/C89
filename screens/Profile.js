import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    Switch
} from "react-native";
import { RFValue } from "react-native-respontive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

import firebase from "firebase";

let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            isEnabled: false,
            light_theme: true,
            profileImage: "",
            name: ""
        };
    }

    toggleSwitch() {
        const previous_state = this.state.isEnabled;
        const theme = !this.state.isEnabled ? "dark" : "light";
        var updates = {};
        updates[
            "/users/" + firebase.auth().currentUser.uid + "/current_theme"
        ] = theme;
        firebase
            .database()
            .ref()
            .update(updates);
        this.setState({ isEnabled: !previous_state, light_theme: previous_state });
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
        this.fetchUser();
    }

    async fetchUser() {
        let theme, name, image;
        await firebase
        .database()
        .ref("/users/" + firebase.auth().currentUser.uid)
        .on("value", function (snapshot) {
            theme = snapshot.val().current_theme;
            name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
            image = snapshot.val().profile_picture;
        });
    this.setState({
        light_theme: theme === "light" ? true : false,
        isEnabled: theme === "light" ? false: true,
        name: name,
        profile_image: image
    });
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <AppLoading />;
        } else {
            return (
                <View style={styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <View style={styles.appTitle}>
                        <View style={styles.appIcon}>
                            <Image
                                source={require("../assets/logo.png")}
                                style={styles.iconImage}
                            ></Image>
                        </View>
                        <View style={styles.appItitleTextContainer}>
                            <Text style={styles.appTitleText}>Storytelling App</Text>
                        </View>
                    </View>
                    <View style={styles.screenContainer}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={{ uri: this.state.profile_image }}
                                style={styles.profileImage}
                            ></Image>
                            <Text style={styles.nameText}>{this.state.name}</Text>
                        </View>
                        <View style={styles.themeContainer}>
                            <Text style={styles.themeText}>Dark Theme</Text>
                            <Switch
                                style={{
                                    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }]
                                }} . . .
                        </View>
                    </View>
                </View>
            )
        }
    }
}