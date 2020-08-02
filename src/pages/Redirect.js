import React from 'react';
import { useHistory } from 'react-router-dom';

const Redirect = () => {
    const history = useHistory();

    history.push("/discover/");

    const handleClick = () => {
        history.push("/cities/");
    }

    return (
        <div>
            <button onClick={handleClick} type="button" />
        </div>
    );
}

export default Redirect;