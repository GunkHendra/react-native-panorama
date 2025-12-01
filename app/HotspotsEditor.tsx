// import CustomButton from '@/components/Button';
// import InputField from '@/components/InputField';
// import CustomText from '@/components/Text';
// import { PlayerHotspot } from '@/interfaces/vtour';
// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';

// const HotspotsEditor = ({ hotspots }: PlayerHotspot[]) => {
//     return (
//         hotspots.length === 0 ? (
//             <View className="flex-1 justify-center items-center">
//                 <CustomText text={"No hotspots added yet. Tap the + button on the 360° viewer to add hotspots."} isDimmed={true} classname="text-center" />
//             </View>

//         ) : (
//             <View className="flex-1">
//                 {hotspots.map((hotspot, index) => (
//                     <View key={index}>
//                         <CustomText text={hotspot.title} variant="h3" classname="mb-2 font-semibold" />
//                         <View className="gap-2 mb-4">
//                             <CustomText text="Hotspot Title" />
//                             <InputField placeholder="Enter Title" />
//                             <Dropdown
//                                 style={styles.dropdown}
//                                 containerStyle={styles.container}
//                                 placeholderStyle={styles.placeholderStyle}
//                                 selectedTextStyle={styles.selectedTextStyle}
//                                 itemTextStyle={styles.selectedTextStyle}
//                                 data={scene_data}
//                                 labelField="label"
//                                 valueField="value"
//                                 placeholder='Go to the Scene'
//                                 value={value}
//                                 onChange={item => {
//                                     setValue(item.value);
//                                 }}
//                             />
//                         </View>
//                         <View className="gap-2 mb-4">
//                             <CustomText text="URL" />
//                             <InputField placeholder="Enter URL" />
//                         </View>
//                     </View>
//                 ))}
//                 <CustomButton text={"Save"} variant="dark" isCenter={true} onPress={() => console.log('pressed')} />
//             </View>
//         )
//     )
// }

// export default hotspot

// const styles = StyleSheet.create({
//     container: {
//         borderRadius: 12,
//         marginTop: 8,
//         borderWidth: 1,
//         borderColor: 'rgba(1, 15, 28, 0.12)',
//         shadowColor: 'transparent',
//         elevation: 0,
//         shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: 0,
//         shadowRadius: 0,
//     },
//     dropdown: {
//         borderColor: 'rgba(1, 15, 28, 0.12)',
//         borderWidth: 1,
//         borderRadius: 9999,
//         padding: 16,
//         fontSize: 14,
//         height: 50,
//         backgroundColor: '#FEFEFE',
//     },
//     placeholderStyle: {
//         fontSize: 14,
//         color: 'rgba(1, 15, 28, 0.40)',
//     },
//     selectedTextStyle: {
//         fontSize: 14,
//         color: 'rgba(1, 15, 28, 1)',
//     },
// });