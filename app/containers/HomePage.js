import React, { Component } from 'react';
import {
  inject,
  observer,
} from 'mobx-react';

import AppHeader from '../components/AppHeader';
import Home from '../components/Home';
import Journal from '../components/Journal';
import style from '../components/HomePage.css';

export type Props = {
  authStore: Object;
}

@inject('authStore')
@observer
export default class HomePage extends Component {
  props: Props;

  render() {
    const {
      authStore,
    } = this.props;

    return (
      <div className={style.container}>
        <AppHeader />
        {authStore.authed || authStore.pokemon.length ?
          <Journal />
        : <Home />}
      </div>
    );
  }
}
