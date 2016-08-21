import React, { Component } from 'react';
import {
  inject,
  observer,
} from 'mobx-react';

import LinearProgress from 'material-ui/LinearProgress';

import AppHeader from '../components/AppHeader';
import Home from '../components/Home';
import Journal from '../components/Journal';
import Notifications from '../components/Notifications';
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
        {authStore.loading ?
          <div className={style.loading}>
            <LinearProgress mode="indeterminate" />
          </div>
        : null}


        {authStore.journalVisible && !authStore.loading ?
          <Journal />
        : null}

        {!authStore.journalVisible && !authStore.loading ?
          <Home />
        : null}

        <Notifications />
      </div>
    );
  }
}
