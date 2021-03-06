import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
var {width,height,scale} =Dimensions.get('window');
var iWidth=width-30;

import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import {inject,observer } from "mobx-react";

@inject('RootStore')
@observer
class App extends Component{

    constructor(){
        super()
        this.state = {
            text: '',
            Membership:0,
        }
        this.onSelect = this.onSelect.bind(this)
    }

    onSelect(index, value){
        this.setState({
        text: `Selected index: ${index} , value: ${value}`,
        Membership:index
        })
    }

    render(){
        return(
            <View style={{flex: 1,justifyContent: 'center',alignSelf: 'stretch',}}>
            <Text style={styles.title}> Please select a membership level </Text>
              
                
                <RadioGroup
                    onSelect = {(index, value) => this.onSelect(index, value)}
                >
                   <RadioButton value={'item3'} style={{justifyContent: 'center',alignSelf:'flex-start'}}>
                        <Text style={[styles.option,{alignSelf:'flex-start'}]}>Free  $0/month</Text>
                        <Text style={styles.explain}>With 100 request per month</Text>
                    </RadioButton>

                  

                    <RadioButton value={'item2'} style={{justifyContent: 'center',alignSelf:'flex-start'}}>
                        <Text style={styles.option}>Golden  $10/month</Text>
                        <Text style={styles.explain}>With 200 request per month</Text>
                    </RadioButton>

                    <RadioButton value={'item1'} style={{justifyContent: 'center',alignSelf:'flex-start'}} >
                        <Text style={styles.option}>Diamond  $20/month</Text>
                        <Text style={styles.explain}>With unlimitied request per month</Text>
                    </RadioButton>

                   

                </RadioGroup>
                <Text>{this.state.Membership}</Text>

                <TouchableOpacity activeOpacity={0.5} onPress={()=>{
                  this.props.RootStore.setMembership(this.state.Membership)
                  this.props.navigation.navigate('Payment')

                  }}>
                    <View style={styles.EditBtn}>
                        <Text style={styles.EditBtnText}>Next</Text>
                     </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  title:{
    color:'#2B49C1',
    fontSize:22,
    fontWeight:'bold',
    textShadowColor:'#C0C0C0',
    textShadowRadius:2,
    textShadowOffset:{width:2,height:2},
    alignSelf:'center'
  },
  option:{
    alignSelf:'flex-start',
    fontSize:20,
    color: '#2B49C1'
  },
  explain:{
    fontSize:16,
  },
  EditBtn:{
    width:iWidth - 120,
    height:40,
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:15,
    marginTop:15,
    borderRadius:8,
    alignSelf:'center'
  },
  EditBtnText:{
    color:'#738EF5',
    fontSize: 20,
    fontWeight:'bold',
  },
})

module.exports = App