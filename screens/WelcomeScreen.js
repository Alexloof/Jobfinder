import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { AppLoading } from 'expo';
import Slides from '../components/Slides';

const SLIDE_DATA = [
    { text: 'Welcome to JobApp', color: '#03A9F4' },
    { text: 'This is the App', color: '#009688' },
    { text: 'Set your location, then swipe away', color: '#03A9F4' }
];

class WelcomeScreen extends Component {
    state = { token: null }

    
    async componentWillMount() {
        let token = await AsyncStorage.getItem('fb_token');
        if (token) {
            this.setState({ token });
            this.props.navigation.navigate('map');
            // this.setState({ token });
        } else {
            this.setState({ token: false });
        }
    }
    onSlidesComplete() {
        this.props.navigation.navigate('auth')
    }
    render() {
        if (_.isNull(this.state.token)) {
            return <AppLoading />
        }
        return (
            <View style={{ flex: 1 }}>
                <Slides data={SLIDE_DATA} onSlidesComplete={this.onSlidesComplete.bind(this)} />
            </View>
        );
    }
}

export default WelcomeScreen;