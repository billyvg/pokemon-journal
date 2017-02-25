import React, { Component } from 'react';
import styles from './Home.css';
import Login from './Login';


export default class Home extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Login />
      </div>
    );
  }
}
