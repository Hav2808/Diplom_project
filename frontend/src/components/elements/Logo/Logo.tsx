import { NavLink } from 'react-router-dom'
import './logo.css'
import myImage from './image.png';
import { FC } from 'react'

export const Logo: FC = () => {
    return (
        <NavLink className="logo" to="/">
            <img src={myImage} alt="Description of image" style={{ width: '300px', height: 'auto' }}/>            
        </NavLink>
    )
}