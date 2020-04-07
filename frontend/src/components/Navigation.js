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
              {/*
            <NavItem>
                <NavLink tag={Link} to="/password">Change Password</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/logout">Logout</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/about">About</NavLink>
              </NavItem>
              */}

             <UncontrolledDropdown nav inNavbar >
                <DropdownToggle nav caret>
                 Site Admin 
                </DropdownToggle>
                <DropdownMenu right  >
                   <DropdownItem tag={Link} to="/about">
                    Organizations
                    </DropdownItem>
                   <DropdownItem tag={Link} to="/about">
                     Users
                    </DropdownItem>
                 </DropdownMenu>
             </UncontrolledDropdown>

             <UncontrolledDropdown nav inNavbar >
               <DropdownToggle nav caret>
                 Org Admin 
                </DropdownToggle>

                <DropdownMenu right  >
                  <DropdownItem tag={Link} to="/settings">
                                 Settings 
                                  </DropdownItem>
                   <DropdownItem tag={Link} to="/about">
                    Organization
                    </DropdownItem>
                   <DropdownItem tag={Link} to="/about">
                     Users
                    </DropdownItem>
                 </DropdownMenu>
              </UncontrolledDropdown>

             <UncontrolledDropdown nav inNavbar >
                <DropdownToggle nav caret>
                  Sources
                </DropdownToggle>
                <DropdownMenu right  >
                   <DropdownItem tag={Link} to="/sources_upload">
                    Upload
                    </DropdownItem>
                   <DropdownItem tag={Link} to="/sources_rss?ordering=name&page=1&orderDir=%2b">
                    RSS
                    </DropdownItem>
                   <DropdownItem tag={Link} to="/sources_job">
                    Job 
                    </DropdownItem>
                 </DropdownMenu>
              </UncontrolledDropdown>

             <UncontrolledDropdown nav inNavbar >
                <DropdownToggle nav caret>
                  Training 
                </DropdownToggle>
                <DropdownMenu right  >
                  <DropdownItem tag={Link} to="/models">
                   Models 
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/versions">
                   Model Versions
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/train_list">
                    History
                  </DropdownItem>
                  </DropdownMenu>
              </UncontrolledDropdown>
 
             <UncontrolledDropdown nav inNavbar >
                <DropdownToggle nav caret>
                 Account
                </DropdownToggle>
                <DropdownMenu right  >
                 <DropdownItem tag={Link} to="/password">
                   Change Password
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/logout">
                    Logout
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/about">
                    About
                  </DropdownItem>
 
               </DropdownMenu>
              </UncontrolledDropdown>


            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
