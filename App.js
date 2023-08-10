import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,Alert, FlatList,Modal} from 'react-native';
import {Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, {useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [tarefa, setTarefa] = useState([]);
  const [newTarefa, setNewTarefa] = useState('');
  const[edit,setEdit]= useState(null);
  const [visible,setVisible]=useState(false);
  async function addTask(){
    
    setTarefa(...tarefa);
    
  }
  async function removeTask(item){
    Alert.alert('Deletar Tarefa', 'Tem certeza que deseja remover esta tarefa?',[{
      text:"Não",
      onPress:()=>{
          return;
      },
      style:'cancel'
    },
    {
      text:'Sim',
      onPress:()=>{
        setTarefa(tarefa.filter(tarefas=> tarefas != item));
      }
    }
      
  ],
  {cancelable:false}
  );
    
  }
  async function editTask(item){
    handleSave(item,edit);
    setVisible(true);
  }
  function handleVisibleModal(){
    setVisible(!visible);
  }
 async function handleSave(id,newtask){

    setVisible(false);
    var todosArray =[...tarefa];
    todosArray.splice(id,1,{text:newtask,id:id});
    setTarefa(tarefa);    
  }
  useEffect(()=>{
    async function carregaDados(){
      const tarefa = await AsyncStorage.getItem('tarefa');
      if(tarefa){
        setTarefa(JSON.parse(tarefa));
      }
    }
    carregaDados();
  },[])
  useEffect(()=>{
    async function salvaDados(){
      AsyncStorage.setItem('tarefa',JSON.stringify(tarefa));
    }
    salvaDados();
  }, [tarefa])
 
  return (
    <>    
    <View style={styles.container}>
      <View style={styles.body}> 
      <FlatList
      style={styles.flat}
       data={tarefa}
       keyExtractor={item=>item.toString()}
       showsVerticalScrollIndicator={false}
       renderItem={({item})=>(<View style={styles.containerView}>
        <TouchableOpacity><MaterialIcons name="check-box-outline-blank" size={24} color="black" /></TouchableOpacity>
        <Text style={styles.texto}>{item}</Text>
        <TouchableOpacity onPress={()=>removeTask(item)}>
          <MaterialIcons
          name='delete-forever'
          size={25}
          color='#f64c75'
          />
          </TouchableOpacity> 
          <TouchableOpacity onPress={()=>editTask(item)}>
          <MaterialIcons
          name='edit'
          size={25}
          color='#f64c75'
          />
          </TouchableOpacity>
          <Modal 
    animationType='fade'
        visible={visible}>
          <View>
            <TouchableOpacity onPress={handleVisibleModal}>
              <Text style={styles.textom}>Close</Text>
            </TouchableOpacity>
          <TextInput style={styles.inputm} 
        placeholderTextColor='#999' 
        onChangeText={text=>setTarefa(text)}
        value={tarefa} 
        editable={true}
      />
      <TouchableOpacity style={styles.buttonm} onPress={()=>handleSave(item,edit)}>
        <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Salvar</Text>
        </TouchableOpacity>
        </View>
        </Modal>          
      </View>)}
      />
        
      </View>
      
      <View style={styles.form}>
        <TextInput 
        style={styles.input} 
        placeholderTextColor='#999' 
        autoCorrect={true}
        placeholder='Adicione uma tarefa'
        onChangeText={text=>setNewTarefa(text)}
        value={newTarefa}
        />
      <TouchableOpacity style={styles.button} onPress={addTask}>
        <Ionicons name='ios-add' size={25} color='#fff'/>
      </TouchableOpacity>
    </View>
    
      <StatusBar style="auto" />
    </View>
    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal:20,
    paddingVertical:20,
    marginTop:20
  },
  body:{
    flex:1
  },
  form:{
    padding:0,
    height:60,
    justifyContent:'center',
    alignSelf:'stretch',
    flexDirection:'row',
    paddingTop:13,
    borderTopWidth:1,
    borderColor:'#eee',
  }, 
  input:{
    flex:1,
    height:40,
    backgroundColor:'#eee',
    borderRadius:4,
    paddingVertical:5,
    paddingHorizontal:10,
    borderWidth:1,
    borderColor:'#eee'
  },
  button:{
    height:40,
    width:40,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#1c6cce',
    borderRadius:4,
    marginLeft:10
    },
    containerView:{
      marginBottom:15,
      padding:15,
      borderRadius:4,
      backgroundColor:'#eee',
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      borderWidth:1,
      borderColor:'#eee'
    },
    texto:{
      fontSize:14,
      color:'#333',
      fontWeight:'bold',
      marginTop:4,
      textAlign:'center'
    },
    flat:{
      flex:1,
      marginTop:5
    },
    textom:{
      fontSize:18,
      fontWeight:'bold',
      marginVertical:10,
      textAlign:'right'
    },
    inputm:{
      padding:10,
      borderWidth:1,
      borderRadius:10,
      marginTop:10,
      borderColor:'gray'
    },
    buttonm:{
      marginTop:10,
    height:40,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#1c6cce',
    borderRadius:4,
    }
});
