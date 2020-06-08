import React
    //, { useState }
    from 'react';
import { Link } from 'react-router-dom';

import {
    //Collapse,
    Navbar,
    //NavbarToggler,
    NavbarBrand,
    //Nav,
    //NavItem,
    //NavLink
} from 'reactstrap';

const Header = () => {
    // const [isOpen, setIsOpen] = useState(false);

    // const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand tag={Link} to="/">Chat App</NavbarBrand>
                {/*<NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr" navbar>
                        <NavItem>
                            <NavLink tag={Link} to="/publicChat">Public Chat</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/roomChat">Rooom Chat</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>*/}
            </Navbar>
        </div>
    );
}

export default Header