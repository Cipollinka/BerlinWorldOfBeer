import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, SafeAreaView, Share, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowUpOnSquareIcon } from 'react-native-heroicons/solid';
import { styled } from 'nativewind';
import { ScrollView } from 'react-native-gesture-handler';


const fontBagel = 'BagelFatOne-Regular';
const fontMontReg = 'Montserrat-Regular';
const fontMontSemBold = 'Montserrat-SemiBold';

const SavedScreen = ({ selectedPage, setLocForRoute, setSelectedPage, locForRoute }) => {
    const [wasSavedLocations, setWasSavedLocations] = useState([]);
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const StyledTouchableOpacity = styled(TouchableOpacity);

    useEffect(() => {
        const fetchLocationsWasSaved = async () => {
          try {
            const locWhichSaved = await AsyncStorage.getItem('wasSavedLocations');
            setWasSavedLocations(locWhichSaved ? JSON.parse(locWhichSaved) : []);
          } catch (error) {
            console.error('error downloading placesInfo:', error);
          }
        };
    
        fetchLocationsWasSaved();
      }, [selectedPage]);

    const handleDeleteThisLocation = async (idForSave) => {
        try {
            const updatedLocationsList = wasSavedLocations.filter(thisLocation => thisLocation.idForSave !== idForSave);
            setWasSavedLocations(updatedLocationsList);
            await AsyncStorage.setItem('wasSavedLocations', JSON.stringify(updatedLocationsList));
        } catch (error) {
            console.error("Error deleting thisLocation:", error);
        }
    };

    const shareLinkOfPlace = async (url) => {
        try {
          if (!url) {
            Alert.alert('Error', 'There are no share link');
            return;
          }
          console.log('Sharing URL:', url);
          await Share.share({
            message: `I found interesting bar in Berlin World of Beer: ${url}`,
          });
        } catch (error) {
          console.error('Error sharing place:', error);
        }
      };

    useEffect(() => {
        console.log("saved places is " + wasSavedLocations)
    }, [selectedPage])

    return (
        <SafeAreaView style={{ marginBottom: 230, marginTop: dimensions.width * 0.05, width: '100%' }}>
            {wasSavedLocations.length !== 0 ? (

                <ScrollView>
                    {wasSavedLocations.map(thisLocation => (


                        <View key={thisLocation.idForSave} 
                            style={{ 
                                borderRadius: 19, 
                                width: '97%', 
                                alignSelf: 'center', 
                                position: 'relative', 
                                backgroundColor: '#4E0003',
                                marginBottom: 25,
                            }}>

                            <Image
                                source={thisLocation?.image}
                                style={{
                                    borderTopRightRadius: 19,
                                    width: '100%',
                                    height: dimensions.height * 0.3,
                                    borderTopLeftRadius: 19, 

                                }}
                                resizeMode="stretch"
                            />
                            <Text
                                style={{
                                    fontFamily: fontBagel,
                                    fontWeight: 700,
                                    fontSize: dimensions.width * 0.07,
                                    color: 'white',
                                    textAlign: 'center',
                                    textAlign: 'left',
                                    paddingTop: 16,
                                    marginHorizontal: 20,
                                }}
                            >
                                {thisLocation?.title}
                            </Text>

                            <View 
                                style={{width: '100%', 
                                    overflow: 'hidden',
                                    justifyContent: 'space-between',
                                    marginBottom: 12,
                                    display: 'flex',
                                    marginHorizontal: 16,
                                    marginTop: 12,
                                }}>

                                <View style={{width: '70%', overflow: 'hidden', flexDirection: 'row'}}>

                                    <TouchableOpacity
                                        onPress={() => handleDeleteThisLocation(thisLocation.idForSave)}
                                    >
                                        <Image
                                            source={require('../assets/icons/locationVisibleIcons/wasSavedIconBerlin.png')}
                                            style={{ overflow: 'hidden', width: dimensions.width * 0.09, height: dimensions.width * 0.09, marginRight: dimensions.width * 0.03 }}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log('Sharing link:', thisLocation?.locationMapLink);
                                            shareLinkOfPlace(thisLocation?.locationMapLink);
                                        }}
                                        style={{overflow: 'hidden'}}
                                    >
                                        <Image
                                            source={require('../assets/icons/locationVisibleIcons/shareIconBerlin.png')}
                                            style={{overflow: 'hidden', width: dimensions.width * 0.1, height: dimensions.width * 0.1, textAlign: 'center'}}
                                            resizeMode="stretch"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <Text
                    style={{
                        color: 'white',
                        fontFamily: fontBagel,
                        textAlign: 'center',
                        fontSize: dimensions.width * 0.07,
                        paddingHorizontal: 30,
                        paddingTop: '50%',
                        justifyContent: 'center',
                        display: 'flex',
                    }}
                >
                    You haven't selected any favorite locations yet. Begin adding your favorite spots!
                </Text>
            )}
        </SafeAreaView>
    )
}

export default SavedScreen