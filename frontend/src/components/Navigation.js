import React from 'react'
import { Link } from 'react-router-dom'
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
  DropdownItem
} from 'reactstrap'
import {
  MITIGATE_IND_JOB_EDIT_URI,
  UNMITIGATE_IND_JOB_EDIT_URI
} from '../containers/api'

export default class Example extends React.Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
  }

  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render () {
    return (
      <div>
        <Navbar className={'brand-primary'} dark expand="md">
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

             { this.props.isSuperuser
               ? <UncontrolledDropdown nav inNavbar >
                <DropdownToggle nav caret>
                 Site Admin
                </DropdownToggle>
                <DropdownMenu right >
                   <DropdownItem tag={Link} to="/organization">
                    Organizations
                    </DropdownItem>
                   <DropdownItem tag={Link} to="/alluserinfo">
                     Users
                    </DropdownItem>
                 </DropdownMenu>
             </UncontrolledDropdown>
               : null}

             { this.props.isStaff
               ? <UncontrolledDropdown nav inNavbar >
               <DropdownToggle nav caret>
                 Org Admin
                </DropdownToggle>

                <DropdownMenu right >
                  <DropdownItem tag={Link} to="/settings">
                                 Settings
                                  </DropdownItem>
                  <DropdownItem tag={Link} to="/orguserinfo">
                     Users
                    </DropdownItem>
                  <DropdownItem tag={Link} to="/tasklist">
                     TaskList
                  </DropdownItem>
                 </DropdownMenu>
              </UncontrolledDropdown>
               : null}

             { this.props.isIntegrator
               ? <UncontrolledDropdown nav inNavbar >
                <DropdownToggle nav caret>
                  Sources
                </DropdownToggle>
                <DropdownMenu right >
                   <DropdownItem tag={Link} to="/sources_upload">
                    Raw Text Upload
                    </DropdownItem>
                   <DropdownItem tag={Link} to="/sources_fileupload">
                    File Upload
                    </DropdownItem>
                   <DropdownItem tag={Link} to="/sources_rss?ordering=name&page=1&orderDir=%2b">
                    RSS
                    </DropdownItem>
                   <DropdownItem tag={Link} to="/sources_job">
                    Scheduled Jobs
                    </DropdownItem>
                    <DropdownItem tag={Link} to="/sources_indjob">
                    Hunting Jobs
                    </DropdownItem>
                    <DropdownItem tag={Link} to="/sources_mitigateindicatorjob">
                    Mitigation Jobs
                    </DropdownItem>
                    <DropdownItem tag={Link} to={UNMITIGATE_IND_JOB_EDIT_URI}>
                    Unmitigation Jobs
                    </DropdownItem>

                 </DropdownMenu>
              </UncontrolledDropdown>
               : null}
             { this.props.isIntegrator
               ? <UncontrolledDropdown nav inNavbar >
                <DropdownToggle nav caret>
                  Upload
                </DropdownToggle>
                <DropdownMenu right >
                   <DropdownItem tag={Link} to="/sources_do_upload">
                    Raw Text
                    </DropdownItem>
                   <DropdownItem tag={Link} to="/sources_do_htmlupload">
                    File Html
                    </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
               : null}

             { this.props.isIntegrator
               ? <UncontrolledDropdown nav inNavbar >
                <DropdownToggle nav caret>
                  Training
                </DropdownToggle>
                <DropdownMenu right >
                 <DropdownItem tag={Link} to="/train_list">
                    History
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/models">
                   Models
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/versions">
                   Model Versions
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/trainingscripts">
                    Training Scripts
                  </DropdownItem>
                  </DropdownMenu>
              </UncontrolledDropdown>
               : null}

              <UncontrolledDropdown nav inNavbar >
                <DropdownToggle nav caret>
                  Main
                </DropdownToggle>
                <DropdownMenu right >
                 <DropdownItem tag={Link} to="/">
                   Articles
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/indicatorhome">
                    Indicators
                  </DropdownItem>

               </DropdownMenu>
              </UncontrolledDropdown>

             <UncontrolledDropdown nav inNavbar >
                <DropdownToggle nav caret>
                 Account
                </DropdownToggle>
                <DropdownMenu right >
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
    )
  }
}
