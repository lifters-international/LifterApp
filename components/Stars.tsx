import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { FontAwesome } from '@expo/vector-icons';

import { moderateScale } from "../utils";

type Props = {
    edit: boolean;
    value: number;
    total?: number;
    style?: Object;
    onPress?: ( val: number ) => void;
    size?: number;
}

export const Stars: React.FC<Props> = ({ edit, value, total, style, onPress, size }) => {
    const [ state, setState ] = useState<{
        value: number,
        stars: any[]
    }>({
        value,
        stars: []
    });

    useEffect(() => {
        let stars: any[] = [];

        for ( let i = 0; i < total!; i++ ) {
            stars.push( 
                <FontAwesome 
                    name={ state.value > ( i + 0.5 ) ? "star" :  state.value % 0.5 === 0 && state.value === ( i + 0.5 ) ?  "star-half-empty" : "star-o" } 
                    color="#FF3636" 
                    size={moderateScale(size || 30)} 
                    key={i} 
                    onPress={() => {
                        if ( edit ) {
                            if ( onPress ) onPress( i + 1 );
                            setState(prev => (
                                {
                                    ...prev,
                                    value: i + 1
                                }
                            ))
                        }
                    }}
                /> 
            );
        }

        setState(prev => {
            return {
                ...prev, 
                stars
            }
        });

    }, [ state.value, value, total, size ]);

    return (
        <View style={{ ...{ display: "row", flexDirection: "row", justifyContent: "space-between" }, ...style }}>
            {state.stars}
        </View>
    )
}

Stars.defaultProps = {
    total: 5
}
