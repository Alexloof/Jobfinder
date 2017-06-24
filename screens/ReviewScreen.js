import React, { Component } from 'react';
import { View, Text, ScrollView, Linking, Platform } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { MapView } from 'expo';

class ReviewScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Review Jobs',
        tabBarIcon : ({ tintColor }) => {
            return <Icon name='favorite' size={30} color={tintColor} />;
        },
        headerRight: (
            <Button 
                title="Settings" 
                backgroundColor="rgba(0,0,0,0)" 
                color="rgba(0,122,255,1)"
                onPress={() => navigation.navigate('settings')} />
        )
    });
    renderLikedJobs() {
        return this.props.likedJobs.map((job, index) => {
            const initialRegion = {
                longitude: job.longitude,
                latitude: job.latitude,
                latitudeDelta: 0.045,
                longitudeDelta: 0.02
            };

            return (
                <Card key={index} title={job.jobtitle}>
                    <View style={{ height: 200 }}>
                        <MapView 
                            style={{ flex: 1 }}
                            cacheEnabled={Platform.OS === 'andoid'}
                            scrollEnabled={false}
                            initialRegion={initialRegion}
                        />
                        <View style={styles.detailWrapper}>
                            <Text style={styles.italics}>{job.company}</Text>
                            <Text style={styles.italics}>{job.formattedRelativeTime}</Text>
                        </View>
                        <Button 
                            title='Apply Now!'
                            backgroundColor='#03A9F4'
                            onPress={() => Linking.openURL(job.url)}
                        />
                    </View>
                </Card>
            );
        })
    }
    render() {
        return (
            <ScrollView>
                {this.renderLikedJobs()}
            </ScrollView>
        );
    }
}

const styles = {
    detailWrapper: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10
    },
    italics : {
        fontStyle: 'italic'
    }
};

function mapStateToProps(state) {
    return { likedJobs: state.likedJobs };
}

export default connect(mapStateToProps)(ReviewScreen);