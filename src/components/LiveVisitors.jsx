import React, { Component } from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';
import io from 'socket.io-client'

class LiveVisitors extends Component {

    state = {
        visitors: [],
        socket: null
    };


    onAddVisitors = (visitors) => {
        this.setState({
            visitors
        });
    };

    onConnected = (message) => {
        console.log(message);
    }

    componentDidMount() {
        this.axiosCancelSource = axios.CancelToken.source()

        const socket = io('http://localhost:6600');

        this.setState({
            socket: socket
        });

        axios.get("http://www.geoplugin.net/json.gp").then(res => {
            const {
                geoplugin_request,
                geoplugin_city,
                geoplugin_countryCode,
                geoplugin_regionName,
                geoplugin_countryName
            } = res.data;

            const visitor = {
                ip: geoplugin_request,
                city: geoplugin_city,
                state: geoplugin_regionName,
                country: geoplugin_countryName,
                countryCode: geoplugin_countryCode
            };

            this.state.socket.emit("new-user", visitor);

            this.state.socket.on("visitors", this.onAddVisitors);

            this.state.socket.on("connected", this.onConnected);

            
        });
    }

    componentWillUnmount() {
        this.state.socket.disconnect();
        this.axiosCancelSource.cancel('Component unmounted.')
    }

    getCountryFlag = (countryCode) => `https://www.countryflags.io/${countryCode}/flat/32.png`;

    renderTableBody = () => {
        const { visitors } = this.state;

        return visitors.map((v, index) => {

            return (
                <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td>{v.ip}</td>
                    <td><img alt="{v.countryCode}" src={this.getCountryFlag(v.countryCode)} /></td>
                    <td>{v.city}</td>
                    <td>{v.state}</td>
                    <td>{v.country}</td>
                </tr>
            );
        });
    }

    render() {
        return (
            <>
                <h3>Live Visitors</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>IP</th>
                            <th>Flag</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Country</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.renderTableBody()
                        }
                    </tbody>
                </Table>
            </>
        );
    }
}

export default LiveVisitors