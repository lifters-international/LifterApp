import React from 'react';

import { Text, View } from 'react-native';
import { moderateScale } from "../utils";

const BenefitText: React.FC<{ text: string }> = ( { text } ) => {
    return (
        <View style={{ 
            borderWidth: moderateScale(1),
            borderColor: "gainsboro",
            padding: moderateScale(10),
            borderRadius: moderateScale(10),
            marginBottom: moderateScale(10)
        }}>
            <Text style={{ textAlign: 'center', fontSize: moderateScale(15) }}>{text}</Text>
        </View>
    )
}

export default BenefitText;