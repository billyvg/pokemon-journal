import React, { Component } from 'react';
import { Link } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import { Card, CardHeader, CardTitle, CardText, CardMedia } from 'material-ui/Card';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import {
  inject,
  observer,
} from 'mobx-react';
import autobind from 'autobind-decorator';

import styles from './Home.css';


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
      <div>
        <Toolbar>
          <ToolbarGroup>
            <RaisedButton
              type="submit"
              label="Load"
              onClick={this.handleGetPokemon}
              primary
            />
          </ToolbarGroup>

          <ToolbarGroup>
            <DropDownMenu value={authStore.sort} onChange={this.handleChangeSort}>
              <MenuItem value="recent" primaryText="Recent" />
              <MenuItem value="id" primaryText="Pokemon ID" />
              <MenuItem value="iv" primaryText="IV" />
            </DropDownMenu>
          </ToolbarGroup>
        </Toolbar>

        <div style={{overflowY: 'auto'}}>
          {authStore.pokemon.map((pokemon, i) => {
            return (
              <Card key={i}>
                <CardHeader
                  title={`${pokemon.name} ${pokemon.nickname ? `(${pokemon.nickname})` : ''}`}
                  subtitle={` IV: ${pokemon.individual_attack || 0} / ${pokemon.individual_defense || 0} / ${pokemon.individual_stamina || 0}`}
                  avatar={pokemon.img}
                />
              </Card>
            );
          })}
        </div>
      </div>
    );
  }
}
