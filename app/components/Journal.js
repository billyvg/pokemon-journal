import React, { Component } from 'react';
import { Link } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import {
  inject,
  observer,
} from 'mobx-react';
import autobind from 'autobind-decorator';

import PokemonList from './PokemonList';
import styles from './Journal.css';

@inject('authStore')
@autobind
@observer
export default class Journal extends Component {
  handleChangeSort(e, index, value) {
    const {
      authStore,
    } = this.props;

    authStore.sort = value;
  }

  handleGetPokemon() {
    const {
      authStore,
    } = this.props;

    authStore.getPokemon();
  }

  render() {
    const {
      authStore,
    } = this.props;

    return (
      <div className={styles.container}>
        <Toolbar className={styles.toolbar}>
          <ToolbarGroup>
            <RaisedButton
              type="submit"
              label="Refresh"
              onClick={this.handleGetPokemon}
              primary
            />
          </ToolbarGroup>

          <ToolbarGroup>
            <DropDownMenu value={authStore.sort} onChange={this.handleChangeSort}>
              <MenuItem value="recent" primaryText="Recent" />
              <MenuItem value="id" primaryText="Pokemon ID" />
              <MenuItem value="iv" primaryText="IV" />
              <MenuItem value="cp" primaryText="CP" />
            </DropDownMenu>
          </ToolbarGroup>
        </Toolbar>

        <PokemonList />
      </div>
    );
  }
}
