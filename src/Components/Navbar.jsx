import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData.js";
import { ProfileMenuData } from "./ProfileMenuData.js";
import "../css/Navbar.css";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: false,
      profileMenu: false,
    };
  }

  showSidebar() {
    this.setState({ sidebar: !this.state.sidebar, profileMenu: false });
  }

  showProfileMenu() {
    this.setState({ profileMenu: !this.state.profileMenu, sidebar: false });
  }

  render() {
    return (
      <div>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={() => this.showSidebar()} />
          </Link>
          <div className="navbar-right">
            <Link to="/" className="home-icon">
              <FaIcons.FaHome></FaIcons.FaHome>
            </Link>
            <Link to="#" className="profile-icon">
              <FaIcons.FaCircle onClick={() => this.showProfileMenu()} />
            </Link>
          </div>
        </div>
        <nav className={this.state.sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={() => this.showSidebar()}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span className="sidebar-item-title">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <nav
          className={
            this.state.profileMenu ? "profile-menu active" : "profile-menu"
          }
        >
          <ul
            className="profile-menu-items"
            onClick={() => this.showProfileMenu()}
          >
            {ProfileMenuData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span className="profile-menu-item-title">
                      {item.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }
}
