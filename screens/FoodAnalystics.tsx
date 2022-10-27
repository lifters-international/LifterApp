import React from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Text, Image } from 'react-native';
import {
    PieChart,
    ProgressChart
} from 'react-native-chart-kit';

import { FoodView, Loading, AppLayout } from "../components";

import { useGetDailyFoodAnalystics } from "../hooks";

import { verticalScale, moderateScale, scale } from "../utils";

const FoodAnalystics: React.FC = () => {
    const { loading, error, analysis } = useGetDailyFoodAnalystics();

    if (loading) return <AppLayout backgroundColor="black"><Loading /></AppLayout>

    if (error) return <AppLayout><Text>There was a problem loading your daily food analysis. Please try again.</Text></AppLayout>

    return (
        <AppLayout backgroundColor="black">
            <View style={styles.Header}>
                <Text style={styles.HeaderText}>DAILY FOOD ANALYTICS</Text>
                <Image
                    source={require("../assets/images/hero-section-line-vector.png")}
                    style={styles.line}
                    resizeMode="contain"
                />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View style={styles.ChartContainer}>
                    <Text style={styles.ChartTitle}>Macronutrient BreakDown</Text>
                    {
                        analysis?.Calories == 0 ? (
                            <Text style={styles.ChartText}>No food has been logged today.</Text>
                        ) : (
                            <PieChart
                                data={[
                                    {
                                        name: "Fats",
                                        count: analysis?.Fat,
                                        color: 'rgb(255, 112, 112)',
                                        legendFontColor: 'white',
                                        legendFontSize: moderateScale(20),
                                    },

                                    {
                                        name: "Carbs",
                                        count: analysis?.Carbs,
                                        color: 'rgb(163, 221, 163)',
                                        legendFontColor: 'white',
                                        legendFontSize: moderateScale(20),
                                    },

                                    {
                                        name: "Protein",
                                        count: analysis?.Protein,
                                        color: 'rgba(131, 167, 234, 1)',
                                        legendFontColor: 'white',
                                        legendFontSize: moderateScale(20)
                                    }
                                ]}
                                width={Dimensions.get('window').width - 50}
                                height={verticalScale(220)}
                                chartConfig={{
                                    backgroundColor: '#1cc910',
                                    backgroundGradientFrom: '#eff3ff',
                                    backgroundGradientTo: '#efefef',
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: moderateScale(16),
                                    }
                                }}
                                style={{
                                    marginVertical: moderateScale(8),
                                    borderRadius: moderateScale(16),
                                }}
                                accessor="count"
                                backgroundColor="transparent"
                                paddingLeft="15"
                            />
                        )
                    }
                    <Text style={{ ...styles.ChartTitle, fontSize: moderateScale(15) }}>Estimated % of Calories</Text>
                </View>

                <View style={styles.ChartContainer}>
                    <Text style={{ ...styles.ChartTitle, textAlign: 'center' }}>Daily Macronutrient Goals</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: moderateScale(20) }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: moderateScale(20), height: moderateScale(20), backgroundColor: 'rgb(255, 112, 112)', borderRadius: moderateScale(10) }}></View>
                            <Text style={{ fontSize: moderateScale(15), color: 'white' }}>Fats: {analysis?.FatsGoal}g</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: moderateScale(20), height: moderateScale(20), backgroundColor: 'rgb(163, 221, 163)', borderRadius: moderateScale(10), marginLeft: moderateScale(5) }}></View>
                            <Text style={{ fontSize: moderateScale(15), color: 'white' }}>Carbs: {analysis?.CarbsGoal}g</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: moderateScale(20), height: moderateScale(20), backgroundColor: 'rgba(131, 167, 234, 1)', borderRadius: moderateScale(10), marginLeft: moderateScale(5) }}></View>
                            <Text style={{ fontSize: moderateScale(15), color: 'white' }}>Protein: {analysis?.ProteinGoal}g</Text>
                        </View>
                    </View>
                    {
                        analysis?.Calories == 0 ? (
                            <Text style={styles.ChartText}>No food has been logged today.</Text>
                        ) : (
                            <ProgressChart
                                data={{
                                    labels: ["Fats", "Carbs", "Protein"], // optional
                                    data: [
                                        ((analysis?.Fat || 0) / ( analysis?.FatsGoal || 0 ) ),
                                        ((analysis?.Carbs || 0) / ( analysis?.CarbsGoal || 0 ) ),
                                        ((analysis?.Protein || 0) / ( analysis?.ProteinGoal || 0 ) )
                                    ],
                                    colors: ["rgb(255, 112, 112)", "rgb(163, 221, 163)", "rgba(131, 167, 234, 1)"]
                                }}
                                width={(Dimensions.get('window').width - 150)}
                                height={verticalScale(200)}
                                strokeWidth={moderateScale(16)}
                                radius={moderateScale(30)}
                                chartConfig={{
                                    backgroundGradientFrom: '#01200e',
                                    backgroundGradientTo: 'rgba(0, 0, 0, 0)',
                                    decimalPlaces: 1, // optional, defaults to 2dp
                                    color: (opacity = 1, index) => {
                                        if (index == 0) return `rgba(255, 112, 112, ${opacity})`;
                                        else if (index == 1) return `rgba(163, 221, 163, ${opacity})`;
                                        else return `rgba(131, 167, 234, ${opacity})`;
                                    },
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        marginBottom: moderateScale(50)
                                    }
                                }}
                                hideLegend={true}
                                style={{ 
                                    borderRadius: moderateScale(50), 
                                    padding: moderateScale(20), 
                                    marginLeft: moderateScale(10),
                                    marginRight: moderateScale(10), 
                                    marginBottom: moderateScale(20), 
                                    position: 'relative', 
                                    left: moderateScale(-10) 
                                }}
                            />
                        )
                    }
                </View>

                <View style={styles.FoodAteTodayView}>
                    <Text style={{ ...styles.ChartTitle, textAlign: 'center', color: "black", fontSize: moderateScale(25) }}>Food Ate Today</Text>
                    <View>
                        {
                            analysis?.Foods.map((food, index) => (
                                (
                                    <View key={`food-item-${food.id}-${index}`} style={{ marginBottom: 5 }}>
                                        <FoodView {...food} action={false} />
                                    </View>
                                )
                            ))
                        }
                    </View>
                </View>
            </ScrollView>
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    Header: {
        padding: moderateScale(10)
    },

    HeaderText: {
        fontSize: moderateScale(25),
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        position: "relative",
        top: moderateScale(20)
    },

    line: {
        height: verticalScale(100),
        width: scale(400),
        zIndex: 1
    },

    ChartContainer: {
        backgroundColor: "#222121",
        alignItems: 'center',
        justifyContent: 'center',
        width: "95%",
        marginRight: "auto",
        marginLeft: "auto",
        marginTop: moderateScale(10),
        padding: moderateScale(10),
        borderRadius: moderateScale(10)
    },

    ChartTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: 'white'
    },

    ChartText: {
        fontSize: moderateScale(15),
        color: 'white'
    },

    FoodAteTodayView: {
        marginTop: moderateScale(15),
        marginBottom: moderateScale(95)
    }

});

export default FoodAnalystics;
