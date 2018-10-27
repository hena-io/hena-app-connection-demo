import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export default Button = ({ title, onPress, disabled }) => {
    let backgroundColor = `#225599${disabled ? '55' : 'FF'}`;

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: backgroundColor }]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

Button.propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    disabled: false,
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 5,
    },
    title: {
        fontSize: 20,
        margin: 5,
        color: '#EFEFEF'
    },
});