import React, { Component } from 'react';

import autobind from 'autobind-decorator';
import {
  observer,
  inject
} from 'mobx-react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import SortMenu from './SortMenu';

export type Props = {
  authStore: Object;
};

@inject('authStore')
@observer
export default class AppHeader extends Component {
  props: Props;

  @autobind
  handleMenuChange() {
    this.props.authStore.savedFileCheck();
  }

  render() {
    const {
      authStore,
    } = this.props;
    const {
      authed,
      hasSavedData,
      pokemon,
    } = authStore;

    return (
      <AppBar
        title={
          <div
            onTouchTap={authStore.getPokemon}
          >
            Pokemon Journal
          </div>
        }
        iconStyleLeft={{ color: 'white' }}
        iconElementLeft={
          <IconMenu
            onTouchTap={this.handleMenuChange}
            iconButtonElement={
              <IconButton iconStyle={{ color: 'white' }}>
                <MoreVertIcon />
              </IconButton>
            }
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          >
            <MenuItem
              disabled={!authed}
              onTouchTap={authStore.getPokemon}
              primaryText="Refresh"
            />
            <MenuItem
              disabled={!authed || !pokemon.length}
              primaryText="Save as JSON"
              onTouchTap={authStore.saveData}
            />
            <MenuItem
              disabled={!hasSavedData}
              primaryText="Load JSON"
              onTouchTap={authStore.loadData}
            />
            <MenuItem
              disabled={!authed}
              primaryText="Sign out"
            />
          </IconMenu>
        }
        iconElementRight={<SortMenu iconColor="#fff" />}
      />
    );
  }
}

