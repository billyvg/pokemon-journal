import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import TextField from 'material-ui/TextField';

export default class Login extends Component {
  render() {
    return (
      <div className={styles.container}>
        <TextField
          hintText="Username"
          floatingLabelText="Username"
          floatingLabelFixed
        /><br />
        <TextField
          hintText="Password"
          floatingLabelText="Password"
          type="password"
        /><br />
      </div>
    );
  }
}
