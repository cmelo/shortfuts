import * as React from 'react';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import './Header.scss';

export interface HeaderProps {
    isNativeShortcuts: boolean;
    onShortcutsModeToggled: (isNativeShortcuts: boolean) => void;
}

@observer
export default class Header extends React.Component<HeaderProps, {}> {
    render() {
        return (
            <div className="header">
                <span className="headerTitle">shortfuts</span>
                <Toggle
                    checked={this.props.isNativeShortcuts}
                    offText="Legacy shortcuts (not configurable)"
                    onChanged={this.onToggleChanged}
                    onText="Native Chrome shortcuts (configurable)"
                />
            </div>
        );
    }

    private onToggleChanged = (value: boolean) => {
        this.props.onShortcutsModeToggled(value);
    };
}
