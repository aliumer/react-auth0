import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Nav extends Component {
    render() {
        const { isAuthenticated, login, logOut } = this.props.auth;
        return (
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><button onClick={isAuthenticated() ? logOut : login}>{isAuthenticated() ? "Log Out" : "Log In"}</button></li>
                </ul>
            </nav>
        )
    }
}
