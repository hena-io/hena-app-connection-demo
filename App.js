/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';

const API_URL = 'http://52.231.69.215';
const USER_ID = '791472617497798814';
const UPDATE_INTERVAL = 30000;

const fetchPost = (apiStem, parameter) => (
  fetch(apiStem, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(parameter)
  })
  .then(response => response.json())
  .then(responseJson => {
    console.log('Fetch', responseJson.result, responseJson.data);
    return ({
      result: responseJson.result,
      success: responseJson.result === 'Success',
      data: responseJson.data
    });
  })
);

const Button = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: disabled ? '#22559955' : '#225599FF' }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={styles.buttonText}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const MiningController = ({ initMiningState, miningActivated, onStartMining, onStopMining }) => (
  <View style={styles.miningContainer}>
    <View style={styles.miningState}>
      <Text style={{fontSize: 30}}>
        Mining: {miningActivated ? 'Activate' : 'Inactivate'}
      </Text>
    </View>
    <View style={styles.miningControlsContainer}>
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
)

const MiningHistoryItem = ({index, item}) => (
  <View style={styles.listItem}>
    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.miningAmount}</Text>
    <Text>{item.miningTime}</Text>
  </View>
);

const MiningReportItem = ({index, item}) => {
  console.log(index, item);
  return (
  <View style={styles.listItem}>
    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.miningAmount}</Text>
    <Text>{item.reportDate}</Text>
  </View>
);
};

const ListSeparator = () => (
  <View style={{height: 1, width: '100%', backgroundColor: '#CED0CE'}} />
);

class MiningHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  render() {
    return (
      <FlatList
        data={this.props.items}
        renderItem={MiningHistoryItem}
        keyExtractor={item => item.miningHistoryId}
        ItemSeparatorComponent={ListSeparator}
        refreshControl={
          <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.props.onRefresh}
          />
        }
      />
    );
  }
}

class MiningReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  render() {
    return (
      <FlatList
        data={this.props.items}
        renderItem={MiningReportItem}
        keyExtractor={item => item.reportDate}
        ItemSeparatorComponent={ListSeparator}
        refreshControl={
          <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.props.onRefresh}
          />
        }
      />
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initMiningState: false,
      miningActivated: false,
      isDisplayHistory: true,
      miningHistory: [],
      miningReport: [],
    };
  };

  static defaultProps = {
    userId: USER_ID,
  };

  componentWillMount() {
    this._checkMiningState();
    this._getMiningHistory(0, 20);
    this._getMiningReport('2018-10-01 00:00:00', '2018-11-01 00:00:00', '09:00:00');
  }

  render() {
    return (
      <View style={styles.container}>
        <MiningController
          initMiningState={this.state.initMiningState}
          miningActivated={this.state.miningActivated}
          onStartMining={this._startMining}
          onStopMining={this._stopMining}
        />
        <View style={styles.miningHistory}>
          {
            this.state.isDisplayHistory ?
              <MiningHistory
                items={this.state.miningHistory}
                onRefresh={() => this._getMiningHistory(0, 20)}
              /> :
              <MiningReport
                items={this.state.miningReport}
                onRefresh={() => this._getMiningReport('2018-10-01 00:00:00', '2018-11-01 00:00:00', '09:00:00')}
              />
          }
          <View style={{height: 60, backgroundColor: '#00000055', flexDirection: 'row'}}>
            <Button title='History' onPress={() => this.setState({ isDisplayHistory : true })} />
            <Button title='Report' onPress={() => this.setState({ isDisplayHistory : false })} />
          </View>
        </View>
      </View>
    );
  }

  _refreshMiningUpdator = (result) => {
    let timer = this.state.miningUpdator;
    if (result) {
      if (timer == null){ 
        timer = setInterval(this._updateMiningSession, UPDATE_INTERVAL);
      }
    }
    else {
        if (timer != null) {
        clearInterval(timer);
        timer = null;
      }
    }

    this.setState({
      miningUpdator: timer
    });
  }

  _checkMiningState = () => {
    fetchPost(`${API_URL}/service/mining/miningstate`, { userId: this.props.userId })
      .then(response => response.success && response.data.isRunning)
      .then(result => {
        this.setState({
          initMiningState: true,
          miningActivated: result,
        });
        this._refreshMiningUpdator(result);
      })
      .catch(error => console.log('[Error] Mining State', error));
  };

  _startMining = () => {
    fetchPost(`${API_URL}/service/mining/miningstart`, { userId: this.props.userId })
      .then(response => response.success)
      .then(result => {
        if (!this.state.miningActivated) {
          this.setState({ miningActivated: true });
          this._refreshMiningUpdator(true);
        }
      })
      .catch(error => console.log('[Error] Mining Start', error));
  };

  _stopMining = () => {
    fetchPost(`${API_URL}/service/mining/miningstop`, { userId: this.props.userId })
      .then(response => response.success)
      .then(result => {
        if (this.state.miningActivated) {
          this.setState({ miningActivated: false });
          this._refreshMiningUpdator(false);
        }
      })
      .catch(error => console.log('[Error] Mining End', error));
  };

  _updateMiningSession = () => {
    fetchPost(`${API_URL}/service/mining/miningupdatesession`, { userId: this.props.userId })
      .then(response => response.success)
      .then(result => {
        if (!result) {
          this._checkMiningState();
        }
      })
      .catch(error => console.log('[Error] Mining Session Update', error));
  };

  _getMiningHistory = (offset, count) => {
    console.log(offset, count);
    fetchPost(`${API_URL}/service/mining/mininghistory`, {
      userId: this.props.userId,
      offset: offset,
      count: count
    })
    .then(response => {
      if (response.success) {
        this.setState({ miningHistory: response.data.items });
      }
    })
    .catch(error => console.log('[Error] Mining History', error));
  }

  _getMiningReport = (beginTime, endTime, timezoneOffset) => {
    fetchPost(`${API_URL}/service/mining/miningreport`, {
      userId: this.props.userId,
      beginTime: beginTime,
      endTime: endTime,
      timeZoneOffset: timezoneOffset
    })
    .then(response => {
      if (response.success) {
        this.setState({ miningReport: response.data.items });
      }
    })
    .catch(error => console.log('[Error] Mining Report', error));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  miningContainer: {
    height: 200,
    backgroundColor: '#00000055'
  },
  miningState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miningControlsContainer: {
    height: 60,
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#DDD'
  },
  miningHistory: {
    flex: 1,
    backgroundColor: '#00000077'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 5,
  },
  buttonText: {
    fontSize: 20,
    margin: 5,
    color: '#EFEFEF'
  },
  listItem: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'white',
  }
});
