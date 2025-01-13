import React from "react";
import './profile.css';

interface ProfileProps {
    img: string;
    nick: string;
    ubicacion: string;
    grupo?: string;
    }

const Profile: React.FC<ProfileProps> = ({ img, nick, ubicacion, grupo }) => {
    return (

        <div className="profile">
            <div className="profile-img">
            <img src={img} alt="imagen de perfil" />
            </div>

            <div className="profile-info">
            <p>{nick}</p>
            <p>{ubicacion}</p>
            {grupo && <p>{grupo}</p>}
            <button>Editar</button>
            </div>

            <div className="profile-actions">
                <button>Seguir</button>
            </div>

            <div className="profile-search">
                <input type="text" />
                <button>Buscar</button>
            </div>
            
        </div>
    );
}

export default Profile;