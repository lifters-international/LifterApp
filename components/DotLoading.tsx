import React, { useState, useEffect } from 'react';
import { Octicons } from '@expo/vector-icons';
import { moderateScale, scale } from '../utils';
import { StyleProp, View, ViewStyle } from 'react-native';

export type DotLoaderProps = {
    activeColor?: string;
    inactiveColor?: string;
    dotSize?: number;
    style?: StyleProp<ViewStyle>;
}

export type DotProps = {
    active: boolean;
} & DotLoaderProps;

export const Dot:React.FC<DotProps> = ({ activeColor, inactiveColor, active, dotSize }) => {
    return <Octicons name="dot-fill" size={moderateScale(dotSize!)} color={ active ? activeColor : inactiveColor } />
}

export const DotLoader: React.FC<DotLoaderProps> = ( props ) => {
    const [ currentDot, setCurrentDot ] = useState(0);

    useEffect(() => {
        let dotChanger = setInterval( () => {
            setCurrentDot(
                prev => prev < 3 ? prev+1 : 0
            )
        }, 300);

        return () => {
            clearInterval(dotChanger);
        }
    }, []);

    return (
        <View style={{ ...(props.style ? props.style : {} as Object), display: 'flex', flexDirection: "row", justifyContent: "space-between", width: scale(50) }}>
            {
                [0, 1, 2].map( i => (
                    <Dot {...props} active={ currentDot === i } key={i}/>
                ))
            }
        </View>
    )
}

DotLoader.defaultProps = {
    activeColor: "darkgray",
    inactiveColor: "lightgray",
    dotSize: 30
}




