import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TextInput, useWindowDimensions, Pressable, KeyboardAvoidingView } from 'react-native';
import { FIREBASE_AUTH } from '../fireBaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Logo from '../imgs/TIMELOGO.png';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import createBottomTabNavigator
import SignUp from './SignUp';
import { ScrollView } from 'react-native-gesture-handler';
const Tab = createBottomTabNavigator(); // Create Tab navigator

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation(); // Use useNavigation hook

    const auth = FIREBASE_AUTH;

    const SignIn = async () => {
        try {
            setLoading(true);
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Welcome Back');
        } catch (error) {
            console.log(error);
            alert('Sign in failed' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const SignUpS = () => {
        navigation.navigate('SignUp'); // Navigate to SignUp screen
    };

    const { height } = useWindowDimensions();
    return (
        <ScrollView>
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <Image source={Logo} style={[styles.logo, { height: height * 0.3 }]} resizeMode="contain" />

                <TextInput
                    value={email}
                    style={styles.input}
                    placeholder='Email'
                    autoCapitalize='none'
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    secureTextEntry={true}
                    value={password}
                    style={styles.input}
                    placeholder='Password'
                    autoCapitalize='none'
                    onChangeText={(text) => setPassword(text)}
                />
                <>
                    <Pressable style={styles.Button1} onPress={SignIn}>
                        <Text style={styles.buttonText1}>Login</Text>
                    </Pressable>
                    <Pressable style={styles.Button2} onPress={SignUpS}>
                        <Text style={styles.buttonText2}>Don't have an account? Sign Up</Text>
                    </Pressable>
                </>
            </KeyboardAvoidingView>
        </View>
        </ScrollView>
    );
};

export default LogIn;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
    },
    logo: {
        marginLeft: 30,
        width: '100%',
        maxWidth: 300,
        maxHeight: 300,
    },
    Button1: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
        borderColor: 'black',
        borderRadius: 6,
        backgroundColor: '#cbae73',
    },
    buttonText1: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    Button2: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
    },
    buttonText2: {
        fontWeight: 'bold',
        fontSize: 15,
    }
});
