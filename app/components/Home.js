import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import Login from './Login';


export default class Home extends Component {
  render() {
    return (
      <div>
        <Login />
      </div>
    );
  }
}
