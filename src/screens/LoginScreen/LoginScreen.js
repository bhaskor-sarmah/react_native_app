import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

const LoginScreen = ({navigation}) => {
    const [mobile, setMobile] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('FacingIssueScreen')
    }

    const onLoginPress = () => {
        navigation.navigate('OtpScreen')
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Mobile No'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setMobile(text)}
                    value={mobile}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Get OTP</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Having Trouble, <Text onPress={onFooterLinkPress} style={styles.footerLink}>Need Help</Text> ?</Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default LoginScreen;