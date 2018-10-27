import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';

import Button from '../Button';

export default MiningController = ({ initMiningState, miningActivated, onStartMining, onStopMining }) => (
    <View style={styles.container}>
        <View style={styles.stateContainer}>
            <Text style={styles.state}>
                Mining {miningActivated ? 'Activated' : 'Inactivated'}
            </Text>
        </View>
        <View style={styles.controls}>
            <Button
                title={'Start Mining'}
                disabled={initMiningState && miningActivated}
                onPress={onStartMining}
            />
            <Button
                title={'Stop Mining'}
                disabled={initMiningState && !miningActivated}
                onPress={onStopMining}
            />
        </View>
    </View>
);

MiningController.propTypes = {
    initMiningState: PropTypes.bool.isRequired,
    miningActivated: PropTypes.bool.isRequired,
    onStartMining: PropTypes.func,
    onStopMining: PropTypes.func,
};

const styles = StyleSheet.create({
    container: {
        height: 200,
        backgroundColor: '#00000055',
    },
    stateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    state: {
        fontSize: 30
    },
    controls: {
        height: 60,
        flexDirection: 'row',
        padding: 5,
        backgroundColor: '#DDD'
    },
});