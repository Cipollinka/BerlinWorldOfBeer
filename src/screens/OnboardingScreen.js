import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform } from 'react-native';
import { styled } from 'nativewind';
import onboardingData from '../components/onboardingDataFile';
import { useNavigation } from '@react-navigation/native';


const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

const fontBagel = 'BagelFatOne-Regular';
const fontMontReg = 'Montserrat-Regular';
const fontMontSemBold = 'Montserrat-SemiBold';

const OnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);


  const topPaddingBlock = dimensions.height >= 820 ? 39 : 0;


  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
  
    const dimensionListener = Dimensions.addEventListener('change', onChange);
  
    return () => {
      dimensionListener.remove(); 
    };
  }, []);
  



  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToTheNextBlock = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Home'); 
    }
  };


  const renderItem = ({ item }) => (
    <View 
      style={{width: dimensions.width, flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}
    >
      <Image
        source={item.image}
        style={{
          width: '100%',
          marginTop: topPaddingBlock,
          height: '55%',
          marginBottom: 16,
        }}
        resizeMode="stretch"
      />
      <Text 
        style={{ 
          fontFamily: fontBagel, 
          fontSize: dimensions.width * 0.07, 
          maxWidth: '80%',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          marginTop: 21,

        }}>
        {item.title}
      </Text>
      <Text 
        style={{ 
          fontFamily: fontMontReg, 
          fontSize: dimensions.width < 400 ? dimensions.width * 0.04 : dimensions.width * 0.045,
          color: 'white',
          marginTop: 8,
          textAlign: 'center',
          paddingHorizontal: 21, 
        }}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <StyledView 
      style={{
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: '#1A0001',
        alignItems: 'center',
      }}
    >
      <StyledView 
        style={{display: 'flex',}}
      >
        <FlatList
          data={onboardingData}
          renderItem={renderItem}
          horizontal
          bounces={false}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef}
        />
      </StyledView>

      <StyledTouchableOpacity
        onPress={() => {
          if(currentIndex === onboardingData.length - 1) {
            navigation.navigate('Home');
          } else scrollToTheNextBlock();
        }}
        style={{
          bottom: '16%',
          backgroundColor: '#F2A92F',
          borderRadius: 25,
          paddingVertical: 21,
          paddingHorizontal: 28,
          marginBottom: 40,
          alignSelf: 'center',
          width: '80%',
        }}
      >
        <Text
          style={{ 
            fontFamily: fontMontSemBold,
            color: 'black',
            fontSize: 16,
            fontWeight: 'semibold',
            textAlign: 'center', 
          }}>
            {currentIndex === onboardingData.length - 1 ? 'Start' : 'Next'}
        </Text>
      </StyledTouchableOpacity>

    </StyledView>
  );
};

export default OnboardingScreen;
