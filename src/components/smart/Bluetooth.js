import {
    Alert,
    FlatList,
    Button,
} from "react-native";
import React, { Component, SectionList, StyleSheet } from "react";
import { Container, Header, Content, Body, Title, Text } from 'native-base';

import { withNavigation } from "react-navigation";
import { inject } from "mobx-react";


@inject("bleStore")
class Bluetooth extends Component {


    componentDidMount() {
        const { bleStore } = this.props;
        bleStore.connectToDevice();
    }

    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>TEST</Title>
                    </Body>
                </Header>
                <Content>
                    
                </Content>
            </Container>
        )
    }

    componentWillUnmount() {
        const { bleStore } = this.props;
        bleStore.removeHandlers();
    }
}

export default Bluetooth;