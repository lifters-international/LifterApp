import React from 'react';

import { Text, View } from 'react-native';

const BenefitText: React.FC<{ text: string }> = ( { text } ) => {
    return (
        <View style={{ 
            borderWidth: 1,
            borderColor: "gainsboro",
            padding: 10,
            borderRadius: 10,
            marginBottom: 10
        }}>
            <Text style={{ textAlign: 'center', fontSize: 15 }}>{text}</Text>
        </View>
    )
}

export default BenefitText;