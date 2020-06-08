import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import {
    Container,
    Row
} from 'reactstrap';

import Header from '../components/Header';
import LiveVisitors from '../components/LiveVisitors';
import RoomChat from '../components/RoomChat';
import PublicChat from '../components/PublicChat';

//import routes from '../routing/routes';

class Layout extends Component {

    render() {
        return (
            <React.Fragment>
                <Header />
                <Container>
                    <Row>
                        <Switch>
                            <Route path="/" exact component={RoomChat}></Route>
                            <Route path="/LiveVisitors" component={LiveVisitors}></Route>
                            <Route path="/publicChat" exact component={PublicChat}></Route>
                        </Switch> 
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

export default Layout;
