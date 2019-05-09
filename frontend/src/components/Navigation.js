import React from 'react';
import {Link} from 'react-router-dom'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar className={"brand-primary"} dark expand="md">
          <NavbarBrand tag={Link} to="/">IntStream</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/password">Change Password</NavLink>
              </NavItem>
               <NavItem>
                <NavLink tag={Link} to="/about">About</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/logout">Logout</NavLink>
              </NavItem>

              {/*  
             <UncontrolledDropdown nav inNavbar >
                <DropdownToggle nav caret>
                 Menu 
                </DropdownToggle>
                <DropdownMenu right  >
                  <DropdownItem tag={Link} to="/">
                    Home
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/password">
                    Change Password
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/settings">
                    Settings
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/about">
                    About
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem tag={Link} to="/logout">
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              */}

            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
