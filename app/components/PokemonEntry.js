import React, { Component } from 'react';
import { Link } from 'react-router';

import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardHeader, CardTitle, CardText, CardMedia } from 'material-ui/Card';
import { getMoveName } from '../api/moves';

import {
  inject,
  observer,
} from 'mobx-react';
import autobind from 'autobind-decorator';

import styles from './PokemonEntry.css';

@inject('authStore')
@autobind
@observer
export default class PokemonEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
   
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
      });
  };

  handleTransfer = (id) => {
    const {
      authStore,
    } = this.props;

    authStore.transferPokemon(id);
    this.handleRequestClose();
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const {
      pokemon,
    } = this.props;

    const {
      currCP,
      minCP,
      maxCP,
    } = pokemon;

    const percentMaxCp = Math.floor(((currCP - minCP) / (maxCP - minCP)) * 100);
    const percentMaxIv = Math.floor(((pokemon.individual_attack || 0) + (pokemon.individual_defense || 0) + (pokemon.individual_stamina || 0)) / 45 * 100);

    const move1 = getMoveName(pokemon.move_1);
    const move2 = getMoveName(pokemon.move_2);

    return (
      <div className={styles.container}>
        <div>
          <span className={styles.label}>
            CP
          </span>
          <span>
            {pokemon.cp} ({percentMaxCp}%) {pokemon.favorite ? '\u2605' : ''}
          </span>
        </div>
        <Avatar
          backgroundColor="white"
          size={50}
          src={`./images/${pokemon.meta.num}.png`}
          onTouchTap={this.handleTouchTap}
        />
        <div>
          {pokemon.meta.name} {pokemon.nickname ? `(${pokemon.nickname})` : ''}
        </div>
        <div>
          <span className={styles.label}>
            IV
          </span>
          <span>
            {pokemon.individual_attack || 0}/{pokemon.individual_defense || 0}/{pokemon.individual_stamina || 0} ({percentMaxIv}%)
          </span>
        </div>
        <div>
          <span className={styles.label}>
            Fast Move:
          </span>
          <span>
            {move1}
          </span>
        </div>
        <div>
          <span className={styles.label}>
            Charge Move:
          </span>
          <span>
            {move2}
          </span>
        </div>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem primaryText="Transfer" onClick={() => this.handleTransfer(pokemon.id)} />
          </Menu>
        </Popover>
      </div>
    );
  }
}

