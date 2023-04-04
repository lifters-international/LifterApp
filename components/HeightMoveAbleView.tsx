import React, { useState, useEffect, useRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { moderateScale, scale, verticalScale } from '../utils';

export type HeightMoveAbleViewProps = {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    onHeightMove: ( height: number ) => void;
    
    starterHeight: number;
    maxHeight: number;
    minHeight: number;
}

export const HeightMoveAbleView : React.FC<HeightMoveAbleViewProps> = ({ starterHeight, maxHeight, minHeight, onHeightMove, children, style }) => {
    const [ holdingStartMove, setholdingStartMove ] = useState(0);

    const [ height, setHeight ] = useState( starterHeight );

    const viewButtonRef = useRef<View>(null);
    const viewButtonRefHeight = useRef(0);

    useEffect( () => {
        viewButtonRef.current?.measure( ( x, y, width, height, pageX, pageY ) => {
            viewButtonRefHeight.current = pageY;
        } );

        return () => {
            setHeight(starterHeight);
        }
    }, [ ]);

    useEffect( () => {
        onHeightMove(height);
    }, [ height ])

    return (
        <View style={{ position: "absolute", zIndex: 10, bottom: 0 }}
            onStartShouldSetResponder={ ( event ) => true }
            onResponderStart={ ( event ) => {
                setholdingStartMove(event.nativeEvent.pageY);
                viewButtonRef.current?.measure( ( x, y, width, height, pageX, pageY ) => {
                    viewButtonRefHeight.current = pageY;
                } );
            } }
            onResponderMove={(event) => {
                if ( viewButtonRefHeight.current + 50 >= holdingStartMove && viewButtonRefHeight.current - 50 <= holdingStartMove ) {
                    let newHeight = height + ( holdingStartMove - event.nativeEvent.pageY );

                    setHeight(
                        newHeight >= minHeight ? 
                            newHeight <= maxHeight ? newHeight : maxHeight
                            : minHeight
                    )
                }
            }}

            hitSlop={{
                top: 40,
            }}
        >
            <View ref={viewButtonRef} style={{ backgroundColor: "white", width: scale(80), height: verticalScale(10), borderRadius: moderateScale(10), padding: moderateScale(10), opacity: 0.5, marginTop: moderateScale(5), marginBottom: moderateScale(5), marginRight: "auto", marginLeft: 'auto' }} />

            <View 
                style={{ 
                    ...( style as object ), 
                    height
                }}
            >
                { children }
            </View>
        </View>
    )
}

HeightMoveAbleView.defaultProps = {
    style: {}
}
