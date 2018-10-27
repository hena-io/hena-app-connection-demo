import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import AicBalances from '../components/AIC/Balances';
import AicHistory from '../components/AIC/History';
import AicReport from '../components/AIC/Report';
import RadioButtonGroup from '../components/RadioButtonGroup';

export default class AicScreen extends Component {
    static propTypes = {
        userId: PropTypes.string.isRequired,
    };

    pages = [
        <AicBalances userId={this.props.userId} />,
        <AicHistory userId={this.props.userId} />,
        <AicReport userId={this.props.userId} />,
    ];

    constructor(props) {
        super(props);

        this.state = {
            page: 0,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    {this.pages[this.state.page]}
                </View>
                <View style={styles.navigator}>
                    <RadioButtonGroup
                        titles={['Balances', 'History', 'Report']}
                        onPress={(page) => this.setState({ page: page })}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor: '#444444',
    },
    navigator: {
        height: 60,
        flexDirection: 'row',
    }
})