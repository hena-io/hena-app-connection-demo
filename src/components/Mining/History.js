import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, RefreshControl } from 'react-native';

import ListItem from '../ListItem';
import ListItemSeparator from '../ListItemSeparator';

import { fetchPost } from '../../utils';
import { API_URL } from '../../constants';

export default class History extends Component {
    static propTypes = {
        userId: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            history: [],
            page: 0,
            offset: 20,
            refreshing: false,
        };
    }

    componentWillMount() {
        this.refresh();
    }

    render() {
        return (
            <FlatList
                data={this.state.history}
                renderItem={this.renderListItem}
                keyExtractor={item => item.miningHistoryId}
                ItemSeparatorComponent={ListItemSeparator}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refresh}
                    />
                }
            />
        );
    }

    renderListItem = ({ index, item }) => (
        <ListItem
            title={item.miningAmount.toString()}
            subtitle={item.miningTime}
        />
    )

    refresh = () => {
        this.loadHistory(
            this.state.page,
            this.state.offset
        );
    }

    loadHistory = (page, offset) => {
        fetchPost(`${API_URL}/service/mining/mininghistory`, {
            userId: this.props.userId,
            offset: page,
            count: offset
        })
        .then(response => {
            if (response.success) {
                this.setState({ history: response.data.items });
            }
        })
        .catch(error => console.log('[Error] Mining History', error));
    }
}