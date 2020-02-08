import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

export default class Profile extends Component {
  static PropTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    repo: '',
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const repo = navigation.getParam('repo');

    this.setState({ repo });
  }

  render() {
    const { repo } = this.state;

    return (
      <WebView
        source={{ uri: `https://github.com/${repo}` }}
        style={{ flex: 1 }}
      />
    );
  }
}
