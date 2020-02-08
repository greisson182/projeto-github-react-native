import React, { Component } from 'react';
import { ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  OwnerAvatar,
  Info,
  Title,
  Autor,
} from './styles';

const styles = StyleSheet.create({
  starred: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static PropTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
  };

  componentDidMount() {
    this.loadRepositories();
  }

  loadRepositories = async () => {
    if (this.state.loading) return;

    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { page, stars } = this.state;

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    if (response.data.length > 0) {
      this.setState({
        stars: [...stars, ...response.data],
        loading: false,
        page: page + 1,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  };

  hadleNavigate = repo => {
    const { navigation } = this.props;
    navigation.navigate('Profile', { repo: repo.owner.login });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
          {loading && <ActivityIndicator color="#000" size={40} />}
        </Header>
        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          onEndReached={this.loadRepositories}
          onEndReachedThreshold={0.2}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.hadleNavigate(item)}
              style={styles.starred}
            >
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Autor>{item.owner.login}</Autor>
              </Info>
            </TouchableOpacity>
          )}
        />
      </Container>
    );
  }
}
