import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import styles from './Home.css';

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
