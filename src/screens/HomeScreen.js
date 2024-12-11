import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SavedScreen from './SavedScreen';
import RouteScreen from './RouteScreen';
import Roulette from './Roulette';
import LinearGradient from 'react-native-linear-gradient';



const placesInfo = [
  {
    id: 1, idForSave: 1, title: 'Spielbank Berlin (Potsdamer Platz)', locDescription: 'The largest casino in Berlin, with various games, bars, and regular events.', image: require('../assets/images/placesImages/berlinPlace1.png'),
    locationMapLink: 'https://maps.apple.com/?address=Eichhornstra%C3%9Fe,%2010785%20%D0%91%D0%B5%D1%80%D0%BB%D1%96%D0%BD,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.507264,13.372673&q=Eichhornstra%C3%9Fe',
    coordinates: { latitude: 52.50726, longitude: 13.37267 }
  },
  {
    id: 2, idForSave: 2, title: 'Casino Royal Berlin', locDescription: 'Located near Alexanderplatz, offers gaming and a casual bar.', image: require('../assets/images/placesImages/berlinPlace2.png'),
    locationMapLink: 'https://maps.apple.com/?address=Dircksenstra%C3%9Fe,%2010178%20%D0%91%D0%B5%D1%80%D0%BB%D1%96%D0%BD,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.523485,13.405400&q=Dircksenstra%C3%9Fe', coordinates: {
      latitude: 52.523485,
      longitude: 13.405400
    }
  },
  {
    id: 3, idForSave: 3, title: 'Casino am Kurfürstendamm', locDescription: 'A cozy casino on the famous boulevard with gaming tables and a bar.', image: require('../assets/images/placesImages/berlinPlace3.png'), categoryId: 2,
    locationMapLink: 'https://maps.apple.com/?address=Kurf%C3%BCrstendamm,%2010789%20%D0%91%D0%B5%D1%80%D0%BB%D1%96%D0%BD,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.504500,13.335422&q=Kurf%C3%BCrstendamm', coordinates: {
      latitude: 52.504500,
      longitude: 13.335422
    }
  },
  {
    id: 4, idForSave: 4, title: 'Berlin Casino (Alexanderplatz)', locDescription: 'Combines modern games with an intimate bar in the Alexanderplatz ', image: require('../assets/images/placesImages/berlinPlace4.png'),
    locationMapLink: 'https://maps.apple.com/?address=Alexanderstra%C3%9Fe,%2010179%20%D0%91%D0%B5%D1%80%D0%BB%D1%96%D0%BD,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.517538,13.418001&q=Alexanderstra%C3%9Fe',
    coordinates: {
      latitude: 52.517538,
      longitude: 13.418001
    }

  },
  {
    id: 5, idForSave: 5, title: 'Potsdam Casino and Bar', locDescription: 'Just outside Berlin, a quieter casino with a relaxed bar atmosphere.', image: require('../assets/images/placesImages/berlinPlace5.png'), categoryId: 2,
    locationMapLink: 'https://maps.apple.com/?address=Friedrich-Ebert-Stra%C3%9Fe,%2014467%20%D0%9F%D0%BE%D1%82%D1%81%D0%B4%D0%B0%D0%BC,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.399186,13.057976&q=Friedrich-Ebert-Stra%C3%9Fe',
    coordinates: {
      latitude: 52.399186,
      longitude: 13.057976,
    }
  },
  {
    id: 6, idForSave: 6, title: 'Queens 45 Resto-Casino', locDescription: 'Offers a mix of dining, drinks, and gaming for a full night out.', image: require('../assets/images/placesImages/berlinPlace6.png'), categoryId: 2,
    locationMapLink: 'https://maps.apple.com/?address=K%C3%B6nigin-Elisabeth-Stra%C3%9Fe%2047,%20Westend,%2014059%20%D0%91%D0%B5%D1%80%D0%BB%D1%96%D0%BD,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.514638,13.280362&q=K%C3%B6nigin-Elisabeth-Stra%C3%9Fe%2047',
    coordinates: {
      latitude: 52.51448087987442,
      longitude: 13.280637693859983,
    }
  },
  {
    id: 7, idForSave: 7, title: 'Zille Stube', locDescription: 'A cozy, classic Berlin venue with slots and a small bar.', image: require('../assets/images/placesImages/berlinPlace7.png'),
    locationMapLink: 'https://maps.apple.com/?address=Zillestra%C3%9Fe,%2014059%20%D0%91%D0%B5%D1%80%D0%BB%D1%96%D0%BD,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.513512,13.297189&q=Zillestra%C3%9Fe',
    coordinates: {
      latitude: 52.513512,
      longitude: 13.297189,
    }
  },
  {
    id: 8, idForSave: 8, title: 'Las Vegas Casino Berlin', locDescription: 'Intimate casino with a lively bar for drinks and socializing.', image: require('../assets/images/placesImages/berlinPlace8.png'),
    locationMapLink: 'https://maps.apple.com/?address=Cassinohof,%2014163%20%D0%91%D0%B5%D1%80%D0%BB%D1%96%D0%BD,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.434819,13.237083&q=Cassinohof',
    coordinates: {
      latitude: 52.434819,
      longitude: 13.237083,
    }
  },
  {
    id: 9, idForSave: 9, title: 'Alexanderplatz Casino Bar', locDescription: 'Centrally located, offering accessible gaming and a casual bar.', image: require('../assets/images/placesImages/berlinPlace9.png'), categoryId: 2,
    locationMapLink: 'https://maps.apple.com/?address=Alexanderplatz,%2010178%20%D0%91%D0%B5%D1%80%D0%BB%D1%96%D0%BD,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.521646,13.414132&q=Alexanderplatz',
    coordinates: {
      latitude: 52.521646,
      longitude: 13.414132,
    }
  },
  {
    id: 10, idForSave: 10, title: 'Grand Casino Esplanade', locDescription: 'Elegant casino with an upscale bar for a refined experience.', image: require('../assets/images/placesImages/berlinPlace10.png'),
    locationMapLink: 'https://maps.apple.com/?address=L%C3%BCtzowufer%2015,%20Tiergarten,%2010785%20Berlin,%20Germany&auid=11539158980030201708&ll=52.505459,13.354717&lsp=9902&q=Grand%20Hotel%20Esplanade%20Berlin',
    coordinates: {
      latitude: 52.505459,
      longitude: 13.354717,
    }
  },
  {
    id: 11, idForSave: 11, title: 'Casino EuroCenter', locDescription: 'A smaller venue focused on slots with a casual bar.', image: require('../assets/images/placesImages/berlinPlace11.png'),
    locationMapLink: 'https://maps.apple.com/?address=Cassinohof,%2014163%20%D0%91%D0%B5%D1%80%D0%BB%D1%96%D0%BD,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.434819,13.237083&q=Cassinohof',
    coordinates: {
      latitude: 52.534819,
      longitude: 13.277083,
    }
  },
  {
    id: 12, idForSave: 12, title: 'Royal Casino Mitte', locDescription: 'Cozy location in Mitte with a small bar space for relaxation.', image: require('../assets/images/placesImages/berlinPlace12.png'),
    locationMapLink: 'https://maps.apple.com/?address=Limastra%C3%9Fe%201,%20Zehlendorf,%2014163%20%D0%91%D0%B5%D1%80%D0%BB%D1%96%D0%BD,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.438313,13.232108&q=%D0%9F%D0%BE%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%B5%20%D0%BC%D1%96%D1%81%D1%86%D0%B5',
    coordinates: {
      latitude: 52.438313,
      longitude: 13.232108,
    }
  },
  {
    id: 13, idForSave: 13, title: 'Casino Erlebniswelt', locDescription: 'Gaming and a lively bar area for an engaging night out.', image: require('../assets/images/placesImages/berlinPlace13.png'),
    locationMapLink: 'https://maps.apple.com/?address=Limastra%C3%9Fe%2023A,%20Zehlendorf,%2014163%20%D0%91%D0%B5%D1%80%D0%BB%D1%96%D0%BD,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.441459,13.230868&q=%D0%9F%D0%BE%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%B5%20%D0%BC%D1%96%D1%81%D1%86%D0%B5',
    coordinates: {
      latitude: 52.441459,
      longitude: 13.230868,
    }
  },
  {
    id: 14, idForSave: 14, title: 'Hohenschoenhausen Casino', locDescription: 'Local favorite in suburban Berlin with a laid-back bar.', image: require('../assets/images/placesImages/berlinPlace14.png'),
    locationMapLink: 'https://maps.apple.com/?address=Cassinohof,%2014163%20%D0%91%D0%B5%D1%80%D0%BB%D1%96%D0%BD,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=52.434819,13.237083&q=Cassinohof',
    coordinates: {
      latitude: 52.534819,
      longitude: 13.331083,
    }
  },
];


const fontBagel = 'BagelFatOne-Regular';
const fontMontReg = 'Montserrat-Regular';
const fontMontSemBold = 'Montserrat-SemiBold';



const HomeScreen = () => {
  const [isSpinnedLocVivble, setIsSpinnedLocVivble] = useState(false);
  const [selectedRandPlaceIndex, setSelectedRandPlaceIndex] = useState(null);





  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedPage, setSelectedPage] = useState('Home');
  const [entriedUser, setEntriedUser] = useState(null);
  const [generatedLocation, setGeneratedLocation] = useState(null);
  const [locForRoute, setLocForRoute] = useState(null);
  const [wasSavedLocations, setWasSavedLocations] = useState([]);
  const [rouletteKey, setRouletteKey] = useState(0);
  const [usedNumbers, setUsedNumbers] = useState([]);

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

  const isThisLocationSaved = useMemo(() => {
    return placesInfo[selectedRandPlaceIndex] && wasSavedLocations.some((loc) => loc.idForSave === placesInfo[selectedRandPlaceIndex].idForSave);
  }, [selectedRandPlaceIndex, wasSavedLocations, selectedPage,]);

  useEffect(() => {
    const fetchEnteredUser = async () => {
      try {
        const userOfStorage = await AsyncStorage.getItem('entriedUser');
        if (userOfStorage) {
          const parsedThisUser = JSON.parse(userOfStorage);
          setEntriedUser(parsedThisUser);
        }
      } catch (error) {
        console.error('Error entry user:', error);
      }
    };

    fetchEnteredUser();
  }, []);

  const saveLocation = async (location) => {
    try {
      const savedLoc = await AsyncStorage.getItem('wasSavedLocations');
      const parsedTheeseLocations = savedLoc ? JSON.parse(savedLoc) : [];

      const thisLocationIndex = parsedTheeseLocations.findIndex((loc) => loc.idForSave === location.idForSave);

      if (thisLocationIndex === -1) {
        const updatedLocationsList = [location, ...parsedTheeseLocations];
        await AsyncStorage.setItem('wasSavedLocations', JSON.stringify(updatedLocationsList));
        setWasSavedLocations(updatedLocationsList);
        console.log('loc was saved');
      } else {
        const updatedLocationsList = parsedTheeseLocations.filter((loc) => loc.idForSave !== location.idForSave);
        await AsyncStorage.setItem('wasSavedLocations', JSON.stringify(updatedLocationsList));
        setWasSavedLocations(updatedLocationsList);
        console.log('loc was deleted');
      }
    } catch (error) {
      console.error('error of збереження/видалення локації:', error);
    }
  };

  useEffect(() => {
    console.log("generated location idForSave is " + generatedLocation?.idForSave)
  }, [generatedLocation])


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

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#1a0001' }}>
      <View

        style={{
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: '#4E0003',
          top: 0,
          width: '100%',
          paddingVertical: 4,
          paddingTop: 30,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row', justifyContent: 'space-around',
            paddingTop: 10,
            alignItems: 'center',
            marginBottom: 25
          }}
        >

          <Text
            style={{
              fontFamily: fontBagel,
              fontSize: dimensions.width * 0.07,
              paddingTop: 16,
              marginHorizontal: 20,
              lineHeight: dimensions.width * 0.1,
              color: 'white',
              textAlign: 'center',
            }}
          >
            {selectedPage === 'Home' ? "BEERLIN LOCATOR" :
              selectedPage === 'Saved' ? "SAVED LOCATIONS" :
                selectedPage === 'Route' ? "BERLIN MAP" :
                  selectedPage === 'TossLog' ? "TOSS LOG" :
                    ''}
          </Text>
        </View>
      </View>



      {selectedPage === 'Home' ? (
        <View
          style={{ flex: 1, paddingHorizontal: 4, width: '100%', paddingTop: dimensions.width < 380 ? 12 : 41, }}
        >

          {!isSpinnedLocVivble ? (
            <View 
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            >
              <Roulette placesInfo={placesInfo} setSelectedPage={setSelectedPage} setGeneratedLocation={setGeneratedLocation} usedNumbers={usedNumbers} setUsedNumbers={setUsedNumbers} rouletteKey={rouletteKey} setIsSpinnedLocVivble={setIsSpinnedLocVivble} selectedRandPlaceIndex={selectedRandPlaceIndex} setSelectedRandPlaceIndex={setSelectedRandPlaceIndex} />

            </View>
          ) : (
            <View
              style={{
                maxHeight: dimensions.width < 380 ? '75%' : '80%',
                borderRadius: dimensions.width * 0.05,
                position: 'relative',
                flex: 1,
                backgroundColor: '#4E0003',
                justifyContent: 'space-between',
              }}
            >
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
              <View>
                <Image
                  source={placesInfo[selectedRandPlaceIndex].image}
                  style={{ width: '100%', height: '50%', borderTopLeftRadius: dimensions.width * 0.05, borderTopRightRadius: dimensions.width * 0.05 }}
                  resizeMode="cover"
                />
                <View style={{ marginHorizontal: dimensions.width * 0.04, marginTop: dimensions.width * 0.025 }}>

                  <Text
                    style={{
                      color: 'white',
                      paddingBottom: 8,
                      fontFamily: fontBagel,
                      textAlign: "left",
                      fontSize: dimensions.width < 380 ? dimensions.width * 0.05 : dimensions.width * 0.07,
                      fontWeight: 700,

                    }}
                  >
                    {placesInfo[selectedRandPlaceIndex].title}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontFamily: fontMontReg,
                      fontSize: dimensions.width * 0.04,
                      fontWeight: 700,
                      textAlign: "left",

                    }}
                  >
                    {placesInfo[selectedRandPlaceIndex].locDescription}
                  </Text>
                </View>
              </View>




              <View>
                <TouchableOpacity
                  onPress={() => { setLocForRoute(placesInfo[selectedRandPlaceIndex]); setSelectedPage('Route') }}
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: dimensions.width < 380 ? dimensions.width * 0.0 : dimensions.width * 0.02,
                  }}
                >
                  <LinearGradient
                    colors={['#FBDE5B', '#FBD05B', '#DCA242', '#FBD05B', '#FBDE5B']}
                    style={{
                      width: '100%',
                      borderRadius: 19,
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0, 0.25, 0.5, 0.75, 1]}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: fontMontSemBold,
                        paddingVertical: dimensions.width * 0.04,
                        fontWeight: '700',
                        fontSize: dimensions.width * 0.05,
                        color: 'black',
                        textAlign: 'center',
                      }}
                    >
                      Set route
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View 
                  style={{ 
                    alignSelf: 'center', 
                    overflow: 'hidden',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 12, 
                    }}>


                  <TouchableOpacity
                    onPress={() => saveLocation(placesInfo[selectedRandPlaceIndex])}
                    style={{alignItems: 'center', padding: 8,}}

                  >
                    <Image
                      source={
                        isThisLocationSaved
                          ? require('../assets/icons/locationVisibleIcons/wasSavedIconBerlin.png')
                          : require('../assets/icons/locationVisibleIcons/savedIconBerlin.png')
                      }
                      style={{ width: dimensions.width * 0.1, height: dimensions.width * 0.1, textAlign: 'center' }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedRandPlaceIndex(null);
                      setIsSpinnedLocVivble(false)
                      setRouletteKey(prevKey => prevKey + 1);
                    }}
                    style={{ marginHorizontal: dimensions.width * 0.05, alignItems: 'center', padding: 8, }}
                  >
                    <Image
                      source={require('../assets/icons/locationVisibleIcons/regenerateIconBerlin.png')}
                      style={{ width: dimensions.width * 0.1, height: dimensions.width * 0.1, textAlign: 'center' }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>


                  <TouchableOpacity
                    onPress={() => shareLinkOfPlace(placesInfo[selectedRandPlaceIndex].locationMapLink)}
                    style={{alignItems: 'center', padding: 8, }}
                  >
                    <Image
                      source={require('../assets/icons/locationVisibleIcons/shareIconBerlin.png')}
                      style={{ width: dimensions.width * 0.1, height: dimensions.width * 0.1, textAlign: 'center' }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}




        </View>

      ) : selectedPage === 'Saved' ? (
        <SavedScreen selectedPage={selectedPage} setLocForRoute={setLocForRoute} setSelectedPage={setSelectedPage} locForRoute={locForRoute} />
      ) : selectedPage === 'Route' ? (
        <RouteScreen placesInfo={placesInfo} selectedRandPlaceIndex={selectedRandPlaceIndex} locForRoute={locForRoute} wasSavedLocations={wasSavedLocations} selectedPage={selectedPage} setWasSavedLocations={setWasSavedLocations} />
      ) : null}
      <View
        
        style={{ 
          borderTopLeftRadius: 23,
          borderTopRightRadius: 23,
          position: 'absolute',
          backgroundColor: '#4E0003',
          bottom: 0,
          width: '100%',
          paddingVertical: 8,

         }}
      >
        <View 
          style={{justifyContent: 'space-around', flexDirection: 'row', paddingVertical: 8, marginBottom: 21}}
        >
          <View 
            style={{ 
              marginHorizontal: dimensions.width * 0.07,
              flex: 1,
              paddingHorizontal: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',

            }}>

            <TouchableOpacity
              onPress={() => setSelectedPage('Home')}
              style={{alignItems: 'center', padding: 8,}}
            >
              <Image
                source={selectedPage === 'Home' ? require('../assets/icons/activatedHomeIcons/activatedHomeIconBerlin.png') : require('../assets/icons/homeIcons/HomePageIconBerlin.png')}
                style={{ width: dimensions.width * 0.14, height: dimensions.width * 0.14, textAlign: 'center' }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedPage('Saved')}
              style={{alignItems: 'center', padding: 8,}}
            >
              <Image
                source={selectedPage === 'Saved' ? require('../assets/icons/activatedHomeIcons/activatedSavedIconBerlin.png') : require('../assets/icons/homeIcons/SavedIconBerlin.png')}
                style={{ width: dimensions.width * 0.14, height: dimensions.width * 0.14, textAlign: 'center' }}
                resizeMode="contain"
              />
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => setSelectedPage('Route')}
              style={{alignItems: 'center', padding: 8,}}
            >
              <Image
                source={selectedPage === 'Route' ? require('../assets/icons/activatedHomeIcons/activatedMapIconBerlin.png') : require('../assets/icons/homeIcons/MapIconBerlin.png')}
                style={{ width: dimensions.width * 0.14, height: dimensions.width * 0.14, textAlign: 'center' }}
                resizeMode="contain"
              />
            </TouchableOpacity>

          </View>
        </View>
      </View>

    </View>
  );
};

export default HomeScreen;
