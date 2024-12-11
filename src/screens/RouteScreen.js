import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    Share,
    Linking,
    Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styled } from 'nativewind';
import { ArrowUpOnSquareIcon, StarIcon } from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { is } from 'date-fns/locale';

const fontBagel = 'BagelFatOne-Regular';
const fontMontReg = 'Montserrat-Regular';
const fontMontSemBold = 'Montserrat-SemiBold';

const RouteScreen = ({ placesInfo, selectedRandPlaceIndex, locForRoute, wasSavedLocations, selectedPage, setWasSavedLocations }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isMapOpened, setIsMapOpened] = useState(false);
    const [isRateBlockVisible, setIsRateBlockVisible] = useState(false);
    const StyledTouchableOpacity = styled(TouchableOpacity);

    const [rating, setRating] = useState(0);
    const handleStarPress = (rate) => {
        setRating(rate);
    };

    const isLocationSaved = useMemo(() => {
        return locForRoute && wasSavedLocations.some((loc) => loc.idForSave === locForRoute.idForSave);
    }, [wasSavedLocations, locForRoute, selectedPage]);

    useEffect(() => {
        console.log('routed loc idForSave is ' + locForRoute?.idForSave);
    }, []);

    const openLink = (url) => {
        if (url) {
            console.log('Opening URL:', url);
            Linking.openURL(url).catch(() => {
                Alert.alert('Error', 'Cannot open the link');
            });
        } else {
            Alert.alert('Error', 'No link provided');
        }
    };


    const shareLink = async (url) => {
        try {
            if (!url) {
                Alert.alert('Error', 'No link to share');
                return;
            }
            console.log('Sharing URL:', url);
            await Share.share({
                message: `I found interesting bar in Berlin World of Beer: ${url}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };


    const saveLocation = async (location) => {
        try {
            const saved = await AsyncStorage.getItem('wasSavedLocations');
            const parsedLocations = saved ? JSON.parse(saved) : [];

            const locationIndex = parsedLocations.findIndex((loc) => loc.idForSave === locForRoute.idForSave);

            if (locationIndex === -1) {
                const updatedLocations = [location, ...parsedLocations];
                await AsyncStorage.setItem('wasSavedLocations', JSON.stringify(updatedLocations));
                setWasSavedLocations(updatedLocations);
                console.log('Локація збережена');
            } else {
                const updatedLocations = parsedLocations.filter((loc) => loc.idForSave !== locForRoute.idForSave);
                await AsyncStorage.setItem('wasSavedLocations', JSON.stringify(updatedLocations));
                setWasSavedLocations(updatedLocations);
                console.log('Локація видалена');
            }
        } catch (error) {
            console.error('Помилка збереження/видалення локації:', error);
        }
    };


    return (
        <SafeAreaView style={{ width: '100%', marginTop: '3%' }}>
            {!locForRoute && (
                 <Text
                 style={{
                     color: 'white',
                     fontFamily: fontBagel,
                     textAlign: 'center',
                     fontSize: dimensions.width * 0.066,
                     paddingHorizontal: 30,
                     paddingTop: '50%',
                     alignSelf: 'center'
                 }}
             >
                You need to Build the route if you want to see and run the route
             </Text>
            )}
            {isRateBlockVisible ? (
                <View style={{ width: '90%', height: '70%', marginTop: '10%', alignSelf: 'center' }}>

                    <View 
                        style={{ 
                            height: '80%', 
                            borderRadius: dimensions.width * 0.05, 
                            position: 'relative',
                            flex: 1,
                            backgroundColor: '#4E0003',
                            justifyContent: 'space-between', 
                        }}>
                        <Image
                            source={require('../assets/icons/selectedRandomPlaceBerlin.png')}
                            style={{
                                width: dimensions.width * 0.21,
                                height: dimensions.width * 0.21,
                                position: 'absolute',
                                top: -dimensions.width * 0.09,
                                alignSelf: 'center',
                                borderTopLeftRadius: dimensions.width * 0.05,
                                borderTopRightRadius: dimensions.width * 0.05,
                                zIndex: 50,
                            }}
                            resizeMode="cover"
                        />
                        <View style={{ width: 300, padding: 20, backgroundColor: 'transparent', borderRadius: 10, alignSelf: 'center', marginTop: '10%' }}>
                            <Text style={{
                                paddingBottom: 5,
                                fontFamily: fontBagel,
                                fontWeight: 700,
                                textAlign: 'center',
                                marginBottom: 19,
                                fontSize: dimensions.width * 0.06,
                                color: '#FCD997',
                            }}>
                                Have you finished the route and would you like to rate it?
                            </Text>
                            <View 
                                style={{
                                    flexDirection: 'row',
                                    paddingHorizontal: 12,
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    padding: 16,
                                    borderRadius: 25,
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                                            <Image
                                                source={require('../assets/icons/beerGoldIcon.png')}
                                                style={{textAlign: 'center', width: dimensions.width * 0.14, height: dimensions.width * 0.14,
                                                    opacity: rating >= star ? 1 : 0.3,
                                                 }}
                                                resizeMode="contain"
                                            />
                                            {/* <StarIcon style={{ color: rating >= star ? '#DCA100' : 'gray', }} size={dimensions.width * 0.12} /> */}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => { setIsRateBlockVisible(false); setIsMapOpened(false); setRating(1) }} style={{ marginTop: 14 }}>
                                <LinearGradient
                                    colors={['#FBF75B', '#FBF75B', '#DCA242', '#FBF75B', '#FBF75B']}
                                    locations={[0, 0.1, 0.5, 0.9, 1]}
                                    style={{
                                        borderRadius: dimensions.width * 0.1,
                                        width: '80%',
                                        alignSelf: 'center',
                                    }}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text
                                        style={{
                                            color: '#1A0001',
                                            fontWeight: 'semibold',
                                            fontFamily: fontMontSemBold,
                                            paddingVertical: 14,
                                            fontSize: dimensions.width * 0.05,
                                            color: 'black',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Rate
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            ) : (
                <View>
                    {locForRoute ? (

                        <View>
                            <View 
                                style={{
                                    backgroundColor: '#4E0003',
                                    borderRadius: 18,
                                    width: '95%',
                                    position: 'relative',
                                    alignSelf: 'center',
                                    marginTop: '3%',
                                    height: dimensions.width < 380 ? dimensions.height * 0.6 : dimensions.height * 0.55
                                }}>

                                <MapView
                                    style={{
                                        width: '95%',
                                        height: dimensions.height * 0.35,
                                        borderRadius: 40,
                                        alignSelf: 'center',
                                        marginTop: dimensions.height * 0.01
                                    }}
                                    region={{
                                        latitude: locForRoute?.coordinates?.latitude,
                                        longitude: locForRoute?.coordinates?.longitude,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                >
                                    {locForRoute?.coordinates && (
                                        <Marker
                                            coordinate={locForRoute.coordinates}
                                            title={locForRoute.title}
                                            description={locForRoute.locDescription}
                                            pinColor="#4E0003"
                                        />
                                    )}
                                    {placesInfo.map((location, index) => (
                                        <Marker
                                            key={index}
                                            coordinate={location.coordinates}
                                            title={location.title}
                                            description={location.locDescription}
                                            pinColor="#DCA100"
                                        />
                                    ))}
                                </MapView>



                                <Text
                                    style={{
                                        fontFamily: fontBagel,
                                        fontSize: dimensions.width * 0.05,
                                        color: 'white',
                                        textAlign: 'center',
                                        paddingTop: 16,
                                        marginHorizontal: 20,
                                        fontWeight: 700,
                                        textAlign: 'left'
                                    }}
                                >
                                    {locForRoute?.title}
                                </Text>

                                <Text
                                    style={{
                                        fontFamily: fontMontSemBold,
                                        fontSize: dimensions.width * 0.03,
                                        color: 'white',
                                        textAlign: 'center',
                                        paddingTop: 16,
                                        marginHorizontal: 20,
                                        fontWeight: 700,
                                        textAlign: 'left'
                                    }}
                                >
                                    {locForRoute?.locDescription}
                                </Text>

                                <View  
                                    style={{ 
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 16,
                                        paddingBottom: 12,
                                        paddingTop: 12, 
                                        }}>
                                    <View style={{ width: '50%' }}>
                                        <TouchableOpacity
                                            style={{
                                                width: '90%',
                                                alignSelf: 'center',
                                            }}

                                            onPress={() => {
                                                if (!isMapOpened) {
                                                    console.log('Opening link:', locForRoute?.locationMapLink);
                                                    openLink(locForRoute?.locationMapLink);
                                                    setIsMapOpened(true);
                                                } else {
                                                    setIsRateBlockVisible(true);
                                                }
                                            }}
                                        >
                                            <LinearGradient
                                                colors={['#FBF75B', '#FBF75B', '#DCA242', '#FBF75B', '#FBF75B']}
                                                style={{
                                                    width: '100%',
                                                    borderRadius: dimensions.width * 0.05,
                                                }}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                locations={[0, 0.25, 0.5, 0.75, 1]}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: fontMontSemBold,
                                                        paddingVertical: dimensions.width * 0.03,
                                                        fontWeight: '700',
                                                        fontSize: dimensions.width * 0.03,
                                                        color: 'black',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {isMapOpened ? 'Stop Route' : 'Run Route'}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>

                                    </View>

                                    <View style={{flexDirection: 'row'}}>

                                        <StyledTouchableOpacity
                                            onPress={() => { saveLocation(locForRoute) }}
                                            style={{ alignItems: 'center', justifyContent: 'center', }}
                                        >
                                            <Image
                                                source={
                                                    isLocationSaved
                                                        ? require('../assets/icons/locationVisibleIcons/wasSavedIconBerlin.png')
                                                        : require('../assets/icons/locationVisibleIcons/savedIconBerlin.png')
                                                }
                                                style={{ width: dimensions.width * 0.1, height: dimensions.width * 0.1, marginRight: dimensions.width * 0.03 }}
                                                resizeMode="contain"
                                            />
                                        </StyledTouchableOpacity>

                                        <StyledTouchableOpacity
                                            onPress={() => {
                                                console.log('Sharing link:', locForRoute?.locationMapLink);
                                                shareLink(locForRoute?.locationMapLink);
                                            }}
                                        >
                                            <Image
                                                source={require('../assets/icons/locationVisibleIcons/shareIconBerlin.png')}
                                                style={{ width: dimensions.width * 0.1, height: dimensions.width * 0.1, textAlign: 'center' }}
                                                resizeMode="contain"
                                            />
                                        </StyledTouchableOpacity>
                                    </View>


                                </View>


                            </View>
                        </View>
                    ) : (
                        <Text
                            style={{
                                
                            }}
                        >
                           
                        </Text>

                    )}
                </View>
            )}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    generalText: (dimensions) => ({
        fontFamily: 'InknutAntiqua-Regular',
        fontSize: dimensions.width * 0.08,
        color: '#FAEDE1',
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    }),
});

export default RouteScreen;
