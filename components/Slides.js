import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Slides extends Component {
    renderLastSlide(index) {
        if (index === this.props.data.length - 1) {
            return (
                <Button 
                    title="Onwards!"
                    rasied
                    buttonStyle={styles.buttonStyle}
                    onPress={this.props.onSlidesComplete} 
                />
            );
        }
    }
    renderSlides() {
        return this.props.data.map((slide, index) => {
            return (
                <View style={[styles.slideStyle, { backgroundColor: slide.color }]} key={index}>
                    <Text style={styles.slideText}>{slide.text}</Text>
                    {this.renderLastSlide(index)}
                </View>
            );
        });
    }
    render() {
        return (
            <ScrollView
                horizontal
                style={{ flex: 1 }}
                pagingEnabled
            >
                {this.renderSlides()}
            </ScrollView>
        );
    }
}

const styles = {
    slideStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH
    },
    slideText: {
        fontSize: 30,
        color: 'white'
    },
    buttonStyle: {
        backgroundColor: '#0288D1',
        marginTop: 15,
    }
};

export default Slides;