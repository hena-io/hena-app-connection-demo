import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';

export default ListItem = ({ title, subtitle }) => (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text>{subtitle}</Text>
    </View>
);

ListItem.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },
});