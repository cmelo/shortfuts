import * as React from 'react';
import './Popup.scss';

export default class Popup extends React.Component<{}, {}> {
    render() {
        return (
            <div style={{ padding: '12px' }} className="popupContainer">
                <img style={{ width: '400px', height: '432px' }} src="/images/icarus.jpg" />
                <div style={{ textAlign: 'center' }}>
                    Icarus soared into the sky, but in the process he came too close to the sun,
                    which due to the heat melted the wax.
                </div>
            </div>
        );
    }
}
