import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import Button from '../components/Button';
import MiningController from '../components/Mining/Controller';
import MiningHistory from '../components/Mining/History';
import MiningReport from '../components/Mining/Report';
import { fetchPost } from '../utils';
import { API_URL } from '../constants'

const UPDATE_SESSION_INTERVAL = 30000;

var miningConnector = null;

export default class MiningScreen extends Component {
    static propTypes = {
        userId: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        
        this.state = {
            initMiningState: false,
            miningActivated: false,
            isDisplayHistory: true,
        };
    }

    componentWillMount() {
        this.checkMiningState();
    }

    render() {
        let page = this.state.isDisplayHistory
            ? <MiningHistory userId={this.props.userId}/>
            : <MiningReport userId={this.props.userId}/>;
        return (
            <View style={{flex: 1}}>
                <MiningController
                    initMiningState={this.state.initMiningState}
                    miningActivated={this.state.miningActivated}
                    onStartMining={this.startMining}
                    onStopMining={this.stopMining}
                />
                <View style={styles.miningHistory}>
                    {page}
                    <View style={styles.pageController}>
                        <Button
                            title={'History'}
                            disabled={this.state.isDisplayHistory}
                            onPress={this.openHistory}
                        />
                        <Button
                            title={'Report'}
                            disabled={!this.state.isDisplayHistory}
                            onPress={this.openReport}
                        />
                    </View>
                </View>
            </View>
        );
    }
    
    openHistory = () => {
        this.setState({
            isDisplayHistory : true
        });
    }

    openReport = () => {
        this.setState({
            isDisplayHistory : false
        });
    }

    checkMiningState = () => {
        fetchPost(`${API_URL}/service/mining/miningstate`, {
            userId: this.props.userId
        })
        .then(response => response.success && response.data.isRunning)
        .then(result => {
            this.setState({
                initMiningState: true,
                miningActivated: result,
            });
            this.refreshMiningUpdator(result);
        })
        .catch(error => console.log('[Error] Mining State', error));
    }
    
    startMining = () => {
        fetchPost(`${API_URL}/service/mining/miningstart`, {
            userId: this.props.userId
        })
        .then(response => response.success)
        .then(result => {
            if (!this.state.miningActivated) {
                this.setState({ miningActivated: true });
                this.refreshMiningUpdator(true);
            }
        })
        .catch(error => console.log('[Error] Mining Start', error));
    }
    
    stopMining = () => {
        fetchPost(`${API_URL}/service/mining/miningstop`, {
            userId: this.props.userId
        })
        .then(response => response.success)
        .then(result => {
            if (this.state.miningActivated) {
                this.setState({ miningActivated: false });
                this.refreshMiningUpdator(false);
            }
        })
        .catch(error => console.log('[Error] Mining End', error));
    }
    
    updateMiningSession = () => {
        fetchPost(`${API_URL}/service/mining/miningupdatesession`, {
            userId: this.props.userId
        })
        .then(response => response.success)
        .then(result => {
            if (!result) {
                this.checkMiningState();
            }
        })
        .catch(error => console.log('[Error] Mining Session Update', error));
    }

    refreshMiningConnector = (state) => {
        if (state) {
            if (miningConnector == null){ 
                miningConnector =
                    setInterval(this.updateMiningSession, UPDATE_SESSION_INTERVAL);

                console.log('Start Mining Session Keeper')
            }
    
            return;
        }
    
        if (miningConnector != null) {
            clearInterval(miningConnector);
            miningConnector = null;

            console.log('Stop Mining Session Keeper');
        }
    }
}

const styles = StyleSheet.create({
    miningHistory: {
        flex: 1,
        backgroundColor: '#00000077',
    },
    pageController: {
        height: 60,
        backgroundColor: '#00000055',
        flexDirection: 'row',
    },
});