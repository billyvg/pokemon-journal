import React, { Component } from 'react';

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
  render() {
    return (
      <div className={styles.container}>
        <PokemonList />
      </div>
    );
  }
}
