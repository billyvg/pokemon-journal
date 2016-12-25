import React, { Component } from 'react';
import { Link } from 'react-router';

import Avatar from 'material-ui/Avatar';
import { Card, CardHeader, CardTitle, CardText, CardMedia } from 'material-ui/Card';
import { getMoveName, getFastMoveWithDPS, getLevel } from '../api/moves';

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

		const move1 = getFastMoveWithDPS(pokemon.move_1, pokemon.meta.type);
		const move2 = getFastMoveWithDPS(pokemon.move_2, pokemon.meta.type);
		const level = getLevel(pokemon.cp_multiplier, pokemon.additional_cp_multiplier);
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
        />
        <div>
          {pokemon.meta.name} {pokemon.nickname ? `(${pokemon.nickname})` : ''} Level: {level}
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
				<div>
					<span className={styles.label}>From Fort:</span>
					<span>{pokemon.from_fort?'yes':'no'}({pokemon.pokeball})</span>
				</div>
      </div>
    );
  }
}
