import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import HelloWord from '@/components/buoi_1/hello-word';
import HelloName from '@/components/buoi_1/alert-hello';
import HelloState from '@/components/buoi_1/hello-state';
import PTbacNhat from '@/components/buoi_1/pt-bac-nhat';
import Parent from '@/components/buoi_3/Parent';
import Calculation from '@/components/buoi_4/Calculation';
import BMIApp from '@/components/buoi_5/calculator-BMI';
import Flexbox from '../../components/buoi_7/Flexbox';
import GridLayout from '@/components/buoi_7/GridLayout';
import UIHomeWebsite from '@/components/buoi_7/UI-Home-Website';
import CakeUI from '@/components/buoi_8/CakeUI';
import LayoutUI from '@/components/buoi_8/LayoutUI';
import FlatListUI from '@/components/buoi_8/FlatListUI';
import ArrayPractice from '@/components/buoi_9/ArrayPractice';
import DanhBa from '@/components/buoi_10/DanhBa';

export default function HomeScreen() {
  return (
      // <HelloWord></HelloWord>
      // <HelloName name="Hương" age= {20}></HelloName>
      // <HelloState></HelloState>
      // <PTbacNhat></PTbacNhat>
      // <Parent></Parent>
      // <Calculation></Calculation>
      // <BMIApp></BMIApp>
      // <Flexbox></Flexbox>
      // <GridLayout></GridLayout>
      // <UIHomeWebsite></UIHomeWebsite>
      // <CakeUI></CakeUI>
      // <LayoutUI></LayoutUI>
      // <FlatListUI></FlatListUI>
      // <ArrayPractice></ArrayPractice>
      <DanhBa></DanhBa>
      
  );
}

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });
