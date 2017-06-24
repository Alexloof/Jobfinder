import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions, LayoutAnimation, UIManager, Platform } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    }
    constructor(props) {
        super(props);
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx , y: gesture.dy });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipeRight();
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipeLeft();
                } else {
                    this.resetPosition();
                }
            }
        });
        this.state = { panResponder, position, index: 0 };
    }
    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({ index: 0 });
        }
    }
    forceSwipeRight() {
        Animated.timing(this.state.position, {
            toValue: { x: SCREEN_WIDTH * 1.5, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete('right'));
    }
    forceSwipeLeft() {
        Animated.timing(this.state.position, {
            toValue: { x: -SCREEN_WIDTH * 1.5, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete('left'));
    }
    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index]
        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });
    }
    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }
    getCardStyle() {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.4 , 0, SCREEN_WIDTH * 1.4],
            outputRange:['-120deg', '0deg', '120deg'] 
        });
        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        }
    }
    renderCards() {
        if (this.state.index >= this.props.data.length) {
            return this.props.renderNoMoreCards();
        }
        
        const deck = this.props.data.map((item, index) => {
                if (index < this.state.index) { return null; }

                if (index === this.state.index) {
                    return (
                        <Animated.View 
                            key={index} 
                            {...this.state.panResponder.panHandlers} 
                            style={[this.getCardStyle(), styles.cardStyle]}
                        >
                            {this.props.renderCard(item)}
                        </Animated.View>
                    );
                }
                return (
                    <Animated.View 
                        key={index} 
                        style={[styles.cardStyle]}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                ); 
            });

        return Platform.OS === 'android' ? deck : deck.reverse();
    }
    render() {
        return (
            <View style={{ marginTop: 10 }}>
                {this.renderCards()}
            </View>
        );
    }
}

const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH,
    }
}

export default Deck;