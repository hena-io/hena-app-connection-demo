import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';

import Button from './Button';

export default class RadioButtonGroup extends Component {
    static propTypes = {
        selectedIndex: PropTypes.number,
        titles: PropTypes.arrayOf(PropTypes.string).isRequired,
        onPress: PropTypes.func,
    };


    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.titles.map((item, index) => {
                        return (
                            <Button
                                key={index}
                                title={item}
                                disabled={this.state.selectedIndex === index}
                                onPress={() => this.onPress(index)}
                            />
                        );
                    })
                }
            </View>
        );
    }

    onPress = (index) => {
        this.props.onPress(index);
        this.setState({ selectedIndex: index });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
})