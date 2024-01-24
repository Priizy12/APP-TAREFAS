import react from 'react'
import { StyleSheet, Text, View, TouchableOpacity ,TouchableWithoutFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'


export default function TaksList ({ data, deleteItem, editItem }) {
    return (
        <View style={styles.container}>
            
        <TouchableOpacity style={{marginRight: 10}} onPress={() => deleteItem(data.key)}>
            <Icon name='trash' color='#FFF' size={25}/>
        </TouchableOpacity>

        <View style={{paddingRight: 10}}>
            <TouchableWithoutFeedback  onPress={ () => editItem(data)}> 
            <Text style={{color: '#FFF'}}> {data.nome} </Text>
            </TouchableWithoutFeedback>
        </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#121212',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        borderRadius: 4     
    }
})