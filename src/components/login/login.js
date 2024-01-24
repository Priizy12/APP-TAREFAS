import react, { useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../database/firebase';


export default function Login({ changeStatus }) {
    const [type, setType] = useState('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')



    async function handleUser() {
        if(type === 'login'){
            await signInWithEmailAndPassword(auth, email, password).
            then((value) => {
                const user = value.user
                changeStatus(value.user.uid)
                alert("Usuario Logado com sucesso, Bem vindo(a) " + value.user.email)
            }).catch((error) => {
                alert("Erro ao Logar, por favor preencha os campos corretamente")
                console.log("Erro ao Logar: " + error)
                return;
            })
        } else{
            await createUserWithEmailAndPassword(auth, email, password).
            then( (value) => {
                const user = value.user
                changeStatus(value.user.uid)
                alert("Conta criada com sucesso, Bem vindo(a) " + value.user.email)
                return;
            })
        }
    }


    return (
        <SafeAreaView style={styles.container}>

            <TextInput
                placeholder='Email'
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />


            <TextInput
                placeholder='Password'
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity style={[styles.handleLogin, { backgroundColor: type === 'login' ? '#141414' : '#3ea6f2' } ]}
             onPress={handleUser}>
                <Text style={{ color: 'white' }}>
                    { type === 'login' ? 'Logar' : 'Cadastrar'  }
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={ () => setType(type => type === 'login' ? 'cadastrar' : 'login')}>
                <Text style={{ textAlign: 'center' }}>
                  { type === 'login' ? 'Criar conta' : 'Entrar' }
                    </Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        paddingHorizontal: 10,
        backgroundColor: '#F2f6fc'
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#FFF',
        borderRadius: 4,
        height: 45,
        padding: 10,
        borderWidth: 1,
        margin: 15
    },
    handleLogin: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        marginLeft: 110,
        marginBottom: 10,
        borderRadius: 10
    }
});
