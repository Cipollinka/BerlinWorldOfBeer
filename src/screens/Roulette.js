import { set } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import {
    View,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Easing,
    Text,
    Image,
    ImageBackground,
    Dimensions,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Line, Circle } from 'react-native-svg';

const images = [
    require("../assets/icons/roulettePointIconBerlin.png"),
    require("../assets/icons/roulettePointIconBerlin.png"),
    require("../assets/icons/roulettePointIconBerlin.png"),
    require("../assets/icons/roulettePointIconBerlin.png"),
    require("../assets/icons/roulettePointIconBerlin.png"),
    require("../assets/icons/roulettePointIconBerlin.png"),
    require("../assets/icons/roulettePointIconBerlin.png"),
    require("../assets/icons/roulettePointIconBerlin.png"),
];

const selectedImage = require("../assets/icons/selectedRandomPlaceBerlin.png");

const imageWidth = 50;
const imageHeight = 50;

const fontBagel = 'BagelFatOne-Regular';
const fontMontReg = 'Montserrat-Regular';
const fontMontSemBold = 'Montserrat-SemiBold';

const Roulette = ({ usedNumbers, setUsedNumbers, rouletteKey, setIsSpinnedLocVivble, selectedRandPlaceIndex, setSelectedRandPlaceIndex }) => {

    const spinValue = useRef(new Animated.Value(0)).current;
    const scaleValues = useRef(images.map(() => new Animated.Value(1))).current;
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isSpinning, setIsSpinning] = useState(false);
    const [randomPoint, setRandomPoint] = useState(null);




    const generateRandomNumber = () => {
        if (usedNumbers.length === 14) {
            setUsedNumbers([]);
        }

        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * 14) + 1; 
        } while (usedNumbers.includes(randomNumber)); 

        setUsedNumbers((prev) => [...prev, randomNumber - 1]);
        setSelectedRandPlaceIndex(randomNumber - 1);
    };

    useEffect(() => {
        console.log('selectedRandPlaceIndex', selectedRandPlaceIndex);
    }, [selectedRandPlaceIndex]);

    useEffect(() => {
        console.log('usedNumbers', usedNumbers);
    }, [usedNumbers]);





    const spinBottle = () => {
        const randomIndex = Math.floor(Math.random() * images.length);
        const singleRotationAngle = 360 / images.length;
        const randomStopAngle = randomIndex * singleRotationAngle;
        setRandomPoint(randomIndex);
        const totalRotations = 2160;
        const finalRotation = totalRotations + randomStopAngle;


        setIsSpinning(true);
        Animated.sequence([
            Animated.timing(spinValue, {
                toValue: finalRotation,
                duration: 4000,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValues[randomIndex], {
                toValue: 1.1,
                duration: 500,
                useNativeDriver: true,
            }),

        ]).start(() => {
            spinValue.setValue(finalRotation % 360); 
            resetOtherPoints(randomIndex);

            setIsSpinning(false);
            setTimeout(() => {
                setIsSpinnedLocVivble(true);
            }, 1500);
        });
    };

    const resetOtherPoints = (selected) => {
        scaleValues.forEach((value, index) => {
            if (index !== selected) {
                Animated.timing(value, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }
        });
    };

    const spinInterpolation = spinValue.interpolate({
        inputRange: [0, 360],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
        }}>
            <View style={{ width: '100%', alignItems: 'center', top: 0, position: 'absolute' }}>

                <View style={{
                    width: dimensions.width * 0.64,
                    height: dimensions.width * 0.64,
                    borderRadius: dimensions.width ,
                    backgroundColor: "#4D0000",
                    justifyContent: "center",
                    alignItems: "center",
                    position: 'relative',
                }}>
                    <Svg
                        height={dimensions.width * 0.64}
                        width={dimensions.width * 0.64}
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    >
                        {images.map((_, index) => {
                            const angle = (index / images.length) * 2 * Math.PI;
                            const x = Math.sin(angle) * (dimensions.width * 0.32) + (dimensions.width * 0.32);
                            const y = -Math.cos(angle) * (dimensions.width * 0.32) + (dimensions.width * 0.32);
                            return (
                                <Line
                                    key={index}
                                    x1={dimensions.width * 0.32}
                                    y1={dimensions.width * 0.32}
                                    x2={x}
                                    y2={y}
                                    stroke="#940006"
                                    strokeWidth="1.4"
                                />
                            );
                        })}
                        {[0.1, 0.2].map((radius, index) => (
                            <Circle
                                key={index}
                                cx={dimensions.width * 0.32}
                                cy={dimensions.width * 0.32}
                                r={dimensions.width * radius}
                                stroke="#940006"
                                strokeWidth="1"
                                fill="none"
                            />
                        ))}
                    </Svg>
                    {images.map((image, index) => (
                        <Animated.Image
                            key={index}
                            source={(!isSpinning && randomPoint) === index ? selectedImage : image}
                            style={[
                                styles.image,
                                {
                                    transform: [
                                        { scale: scaleValues[index] },
                                        {
                                            translateX: Math.sin((index / images.length) * 2 * Math.PI) * dimensions.width * 0.3,
                                        },
                                        {
                                            translateY: -Math.cos((index / images.length) * 2 * Math.PI) * dimensions.width * 0.3,
                                        },
                                    ],
                                },
                            ]}
                        />
                    ))}

                    <Animated.Image
                        source={require("../assets/images/boutleImageBerlin.png")}
                        style={[
                            styles.bottle,
                            { transform: [{ rotate: spinInterpolation }] },
                        ]}
                    />
                </View>

                <Text
                    style={{
                        color: 'white',
                        paddingBottom: 12,
                        fontFamily: fontBagel,
                        fontSize: dimensions.width < 380 ? dimensions.width * 0.05 : dimensions.width * 0.07,
                        paddingTop: dimensions.width * 0.08,
                        marginHorizontal: 20,
                        fontWeight: 700,
                        lineHeight: dimensions.width * 0.08,
                    }}
                >
                    Spin the bottle to choose a location
                </Text>

                <Text
                    style={{
                        color: 'white',
                        paddingBottom: 12,
                        fontFamily: fontMontReg,
                        fontSize: dimensions.width * 0.03,

                        marginHorizontal: dimensions.width * 0.1,
                        fontWeight: 700,
                        textAlign: "center",

                    }}
                >
                    Ready to make Berlin your personal beer garden? Let’s go! Prost!
                </Text>

                <TouchableOpacity
                    style={{
                        width: '90%',
                        paddingBottom: dimensions.width * 0.04,
                        alignSelf: 'center',
                    }}
                    disabled={isSpinning}
                    onPress={() => { generateRandomNumber(); spinBottle() }}>
                    <LinearGradient
                        colors={['#FBF75B', '#FBF75B', '#DCA242', '#FBF75B', '#FBF75B']}
                        style={{
                            width: '100%',
                            borderRadius: 25,
                        }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        locations={[0, 0.25, 0.5, 0.75, 1]}
                    >
                        <Text
                            style={{
                                fontFamily: fontMontSemBold,
                                paddingVertical: dimensions.width * 0.04,
                                fontWeight: '700',
                                fontSize: dimensions.width * 0.05,
                                color: 'black',
                                textAlign: 'center',
                            }}
                        >
                            {!isSpinning ? 'Spin the bottle' : 'Spinning...'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    roulette: {
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: "#4D0000",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        position: "absolute",
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    bottle: {
        width: 30,
        height: 90,
        position: "absolute",
    },
    button: {
        marginTop: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "yellow",
        borderRadius: 10,
    },
    buttonText: {
        color: "black",
        fontSize: 18,
    },
    resultText: {
        marginTop: 20,
        fontSize: 16,
        color: "white",
    },
});

export default Roulette;