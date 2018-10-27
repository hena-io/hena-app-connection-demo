/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import MiningScreen from './src/screens/MiningScreen';
import AicScreen from './src/screens/AicScreen';
import RadioButtonGroup from './src/components/RadioButtonGroup';

const USER_ID = '791472617497798814';

export default class App extends Component {
  pages = [
    <MiningScreen userId={USER_ID} />,
    <AicScreen userId={USER_ID} />
  ];

  constructor(props) {
    super(props);

    this.state = {
      isDisplayMining: true,
      page: 0,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navigator}>
          <RadioButtonGroup
            titles={['MINING', 'AIC']}
            onPress={(page) => this.setState({ page: page })}
          />
        </View>
        {this.pages[this.state.page]}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  navigator: {
    height: 60,
    flexDirection: 'row',
  }
});
