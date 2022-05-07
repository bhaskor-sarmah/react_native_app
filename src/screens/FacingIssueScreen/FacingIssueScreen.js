import React from 'react'
import { Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

const FacingIssueScreen = ({navigation}) => {

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Facing Issue Page</Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default FacingIssueScreen