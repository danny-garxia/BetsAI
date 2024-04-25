import React from 'react';
import { View, Text, StyleSheet, Pressable, LayoutAnimation ,SafeAreaView} from 'react-native';
import { NavigationProp } from '@react-navigation/native';


interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Notifcations = ({ navigation }: RouterProps) => {
    return (
        <SafeAreaView style={styles.SafeAC}>
            <View style={styles.container}>
                <Pressable onPress={() => navigation.goBack()}>
                </Pressable>
            </View>
            <View style={styles.container}>
                
            </View>
        </SafeAreaView>
    );
};

export default Notifcations;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
        flexDirection: "row",
        justifyContent: 'center'
    },
    Button1: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
        borderColor: 'black',
        borderRadius: 6,
        fontWeight: 'bold',
        fontSize: 30,
        backgroundColor: '#cbae73',
    },
    SafeAC: {
        flex: 1,
        paddingHorizontal: 22,
    }
});
