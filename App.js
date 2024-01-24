import react, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard
} from 'react-native';

import { getDatabase, ref, push, set, onValue, remove, update } from 'firebase/database'
import Login from './src/components/login/login'
import TaksList from './src/components/taskList';
import Icon from 'react-native-vector-icons/Feather'



export default function App() {

  const inputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [key, setKey] = useState('')

  useEffect(() => {
    if (!user) {
      return;
    }

    const db = getDatabase();
    const userRef = ref(db, 'Tarefas/' + user);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const firebaseTasks = Object.keys(data).map((key) => {
          return {
            key: key,
            nome: data[key].nome
          };
        });
        setTasks(firebaseTasks);
      }
    });
  }, [user]);


  async function handleAdd() {
    if (newTask === '') {
      return;
    }

    if(key !== '') {
      const db = getDatabase();
      const tarefaRef = ref(db, 'Tarefas/' + user + '/' + key);
    
      await update(tarefaRef, {
        nome: newTask
      })
      .then( () => {
        alert("Tarefa editada com sucesso")
      })
    
      Keyboard.dismiss(); 
      setNewTask('')
      setKey('')
      return; 
    }

    const db = getDatabase();
    const tarefasRef = ref(db, 'Tarefas/' + user);

    const newTaskRef = push(tarefasRef);
    await set(newTaskRef, {
      nome: newTask
    }).then(() => {
      const data = {
        key: newTaskRef.key + Date.now(),
        nome: newTask
      }
      setTasks(oldTasks => [...oldTasks, data])
    })

    Keyboard.dismiss()
    setNewTask('')
  }


  function deleteTasks(key) {

    const db = getDatabase();
    remove(ref(db, 'Tarefas/' + user + '/' + key))
      .then(() => {
      const findTask = tasks.filter(item => item.key !== key)
      setTasks(findTask)
      })
      .catch((error) => {
        alert("Remoção falhou")
        console.log("Remoção falhou: " + error.message);
      });

  }


  function editTasks(data) {
    setKey(data.key)
    setNewTask(data.nome)
    inputRef.current.focus()
  }


  function cancelEdit () {
    setKey('')
    setNewTask('')
    Keyboard.dismiss()
  }

  if (!user) {
    return <Login changeStatus={(user) => setUser(user)} />
  }

  return (
    <SafeAreaView style={styles.container}>


    { key.length > 0 && (
        <View style={{flexDirection: 'row', marginBottom: 8, marginLeft:5 }}>
        <TouchableOpacity onPress={cancelEdit}>
         <Icon name="x-circle" size={20} color="red"/>
        </TouchableOpacity>
        <Text style={{ marginLeft: 5, color: 'red' }}>Voce esta editando uma tarefa</Text>
      </View>
    ) }


      <View style={styles.containerTask}>
        <TextInput
          style={styles.input}
          placeholder='Qual sua Tarefa de Hoje?'
          value={newTask}
          onChangeText={(text) => setNewTask(text)}
          ref={inputRef}
        />

        <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={tasks}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TaksList data={item} deleteItem={deleteTasks} editItem={editTasks} />
        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,

  },
  containerTask: {
    flexDirection: 'row'
  },
  input: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#141414',
    height: 45
  },
  btnAdd: {
    backgroundColor: '#141414',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 7,
    marginRight: 6,
    borderRadius: 4
  },
  btnText: {
    color: '#FFF'
  }
});
