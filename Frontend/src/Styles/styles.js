import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 14,
    color: 'gray',
  },
  container: {
    padding: 20,
    marginTop: 40,
    gap:20,
    borderRadius: 20,
    backgroundColor:"white"
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  label: {
    marginTop: 10,
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5
  },
  picker: {
    height: 50,
    marginVertical: 10
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  dropdown: {
    marginBottom: 20,
  },
  loginHeader: {
    margin:0,
    backgroundColor: '#A2EABF',
    padding: 30,
    borderBottomRightRadius: 50,
  },
  heading :{
    fontSize:20,
    
    textAlign:"center"
  },
  orangeText:{
    color:"#FF7D05",
    fontWeight:"bold"
  },
  borderRounded:{
    borderRadius:30
  },
  marginXAuto:
    { 
      marginLeft: 'auto', 
      marginRight: 'auto' 
    },
  
  loginText: {
    color: 'black',
    fontSize: 30,
  },
  backGround:{
    backgroundColor:"#E7F5E8",
  },
  logo:{
    width: 50,
     height: 50
  },
  errorText:{
    color:"red",
    fontWeight:"bold",
    textAlign:"center",
    fontSize:15
  },

  borderr:{
    borderRadius:100,
    borderColor:"#FF7D05",
    borderWidth: 8,
  },
  btn: {
      
      backgroundColor: '#A2EABF',
      fontSize: 20,
      padding:10,
      textAlign:"center",
      borderRadius:20
    },
    btnText:{
      color:"black",
      textAlign:"center",
      fontWeight:"bold"
    },
    inputField:{
    height: 40,
    borderColor: '#ccc',
    borderWidth: 2,
    width: '100%',
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor:"white"
    },
    label:{
      fontSize: 15,
    marginBottom: 5,
    fontWeight:"bold"
    }
});

export default styles;