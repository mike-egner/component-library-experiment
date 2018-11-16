import React from 'react';
import Navigation from './Navigation';
import ComponentPage from './ComponentPage';
import componentData from '../../config/componentData';

//no router used, just keeping URL in state

export default class Docs extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            route: window.location.hash.substr(1)
        }
    }

    //updates the route when the fragment (#) portion of the URL changes
    componentDidMount() {
        window.addEventListener('hashchange', () => {
            this.setState({route: window.location.hash.substr(1)})
        })
    }

    render() {
        const {route} = this.state;
        //look for component within componentData (a list) based on the current route 
        const component = route ? componentData.filter(component => component.name === route)[0] : componentData[0];
        return (
            <div>
                <Navigation components={componentData.map(component => component.Name)} />
                <ComponentPage component={component} />
            </div>
        )
    }
};