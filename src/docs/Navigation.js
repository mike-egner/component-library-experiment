import React from 'react';
import PropTypes from 'prop-types';

//displays a list of components in the nav which are links to the components (fragments / hashes)

const Navigation = ({components}) => {
    return (
        <ul className="navigation">
            {
                components.map(name => {
                    return (
                        <li key={name}>
                            <a href={`#${name}`}>{name}</a>
                        </li>
                    )
                })
            }
        </ul>
    )
}

Navigation.PropTypes = {
    components: PropTypes.array.isRequired
};

export default Navigation;