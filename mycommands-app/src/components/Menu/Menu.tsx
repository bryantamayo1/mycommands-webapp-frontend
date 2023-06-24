import { NavLink, useLocation } from 'react-router-dom';
import './Menu.css';
import GridViewIcon from '@mui/icons-material/GridView';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useContext, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { AuthContext } from '../../auth/AuthContext';
import { useEffect } from 'react';
import CodeIcon from '@mui/icons-material/Code';

const style = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'background.paper',
};

export const MenuMc = () => {
  ////////
  // Hooks
  ////////
  const {logout} = useContext(AuthContext);
  let location = useLocation();
  

  ////////////
  // Functions
  ////////////

  return (
    <nav className="menu-container">
      <ul>
        <li>
          <NavLink to="/home">
            {( {isActive} ) => (
              <span className={isActive? "active-link-menu": "not-active-link-menu"}>
                <HomeIcon color={isActive? "primary": "inherit"}/>
                <span className="menu-title">
                  Home
                </span>
              </span>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink to="/categories">
            {( {isActive} ) => (
              <span className={isActive? "active-link-menu": "not-active-link-menu"}>
                <GridViewIcon color={isActive? "primary": "inherit"}/>
                <span className="menu-title">
                  Categories
                </span>
              </span>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink to="/commands">
            {( {isActive} ) => (
              <span className={isActive? "active-link-menu": "not-active-link-menu"}>
                <CodeIcon color={isActive? "primary": "inherit"}/>
                <span className="menu-title">
                  Commands
                </span>
              </span>
            )}
          </NavLink>
        </li>

        <li className='mc-menu'>
          <span className={location.pathname === "/user"? "active-link-menu": "not-active-link-menu"}>
            <AccountCircleIcon/>
            <span className="menu-title">
              User
            </span>
            <KeyboardArrowDownIcon/>
          </span>

          <div className='mc-menu-children'>
            <List sx={style} component="nav" aria-label="mailbox folders">
              <ListItem button>
                <ListItemText primary={
                  <NavLink to="/user">
                    Settings
                  </NavLink>
                }/>
              </ListItem>
              <Divider />
              <ListItem button onClick={logout}>
                <ListItemText primary="Sign out" style={{ color: "red" }}/>
              </ListItem>
            </List>
          </div>
        </li>
      </ul>
    </nav>
  )
}
