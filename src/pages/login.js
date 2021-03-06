import React, { Component } from 'react';
import { Dimensions,AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import axios from 'axios';
import {inject,observer } from "mobx-react";
import {SERVER_ADDRESS} from '../../data/address'
import request from '../util/request'
import Toast from "../util/Toast";
import firestore, { firebase } from '@react-native-firebase/firestore';
import fire from '../util/Firebase'
import DefaultImage from '../../data/cover.jpg'
//var Dimensions = require('Dimensions');
var {width,height,scale} =Dimensions.get('window');
var iWidth=width-30;
//const {width,height,scale} = Dimensions.get('windows')

@inject('RootStore')
@observer
class loginView extends Component {

  state = {
    // 
    username: "18665711978",
    // 手机号码是否合法
    Password: 'Yujian',
    
    Email:'1234567@qq.com',

    Address:SERVER_ADDRESS,
    // 是否显示登录页面 
    showLogin: false,
    // 验证码输入框的值
    
  }



  LoginButton = async ()=>{
      // if(this.state.Password=='' || this.state.Email==''){

      // }
      //make request to the server
      //console.log(this.props)
      
      var url = `/front-end/login/validate`
      var result = await request.post(url,{Email:this.state.Email,Password:this.state.Password})
     
      console.log('login.js ',result.status)
      if(result.status=='success'){
        var user = await request.post(`/front-end/getUser`,{Email:this.state.Email})
            this.props.RootStore.setStatus(true)
            console.log('login user',user)
            //var image_uri =user.PhotoPath?user.PhotoPath:DEFAULT_IMAGE
            // this.props.RootStore.setImage(user.PhotoPath)
            // this.props.RootStore.setEmail(user.Email)
            // this.props.RootStore.setPassWord(user.Password)
           
            // this.props.RootStore.setUserId(user.UserId)
            // this.props.RootStore.setCity(user.City)
            // this.props.RootStore.setCountry(user.Country)
            // this.props.RootStore.setAge(user.Age)
            // this.props.RootStore.setUserName(user.UserName)
            // this.props.RootStore.clearKeywords()
            // for(var i=0;i<user.keywords.length;i++){
            //   console.log(i)
            //   this.props.RootStore.pushKeyword(user.keywords[i])
            // }
            this.props.RootStore.updateRoot(user)
            console.log('Root store is ',this.props.RootStore)
            AsyncStorage.setItem('UserInfo',JSON.stringify({
              'Email':this.state.Email,
              'PassWord':this.state.Password,
              'Status':true,
              'UserId':result.userid,
              'UserName':user.UserName,
              'Age':user.Age,
              'City':user.City,
              'Country':user.Country,
              'Keywords':user.keywords
            }))
            var checkResult = await fire.checkUser(result.userid)
            console.log('checkResult is ',checkResult)
            if(checkResult){
              let logout_result = await axios.post(`${SERVER_ADDRESS}/front-end/sendNotification`,{type:'logout',userid:result.userid})
              console.log('loutout result is ',logout_result['data'])
              if(logout_result['data'].status==true){
                fire.addUsers(result.userid)
              }
            }else{
              fire.addUsers(result.userid)
            }
              
            this.props.navigation.navigate("Root",{screen:"AddRequest"})
            
        
      }else{
        Toast.sad("wrong password or email", 2000, "center");
      }
 
      // ,{UserName:this.state.Email,PassWord:this.state.Password}
      
  }

  EmailChangeText = (Email)=>{
    this.setState({Email})
    
  }

  PasswordChangeText = (Password)=>{
    this.setState({Password})
   
  }

  AddressChangeText = (Address)=>{
    this.setState({Address})
  }

  toSignUp = ()=>{
    this.props.navigation.navigate("SignUp")
  }

  render() {
    const{Email, Password,Address} = this.state;
    return (
      <ScrollView>
      <View style={styles.container}>
        {/* 头像  */}
        <Image style={styles.headStyle} source={{uri:'head'}} />
        {/*  登录表单  */}
        <View style={styles.inputView}>
          <TextInput style={styles.inputStyle} placeholder={'Please type your email'} 
          underlineColorAndroid={'transparent'} keyboardType={'email-address'} 
          value={Email}
          onChangeText={this.EmailChangeText}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput style={styles.inputStyle} placeholder={'password'} secureTextEntry={true}
          value={Password}
          onChangeText={this.PasswordChangeText} />
        </View>

 
        {/*  触摸透明反馈  */}
        <TouchableOpacity activeOpacity={0.5} onPress={this.LoginButton}>
          <View style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>Log in</Text>
          </View>
        </TouchableOpacity>

        
        {/* <View style={styles.fuwutiaokuanView}>
          <Text style={styles.tongyi}>我已阅读并同意</Text>
          <TouchableOpacity activeOpacity={0.5}>
            <View>
              <Text style={styles.fuwutiaokuan}>服务条款</Text>
            </View>
          </TouchableOpacity>
        </View> */}
        <View style={styles.bottomBtn}>
          {/* <TouchableOpacity activeOpacity={0.5}>
            <Text style={styles.bottomBtnText}>Cannot log in?</Text>
          </TouchableOpacity> */}
          <TouchableOpacity activeOpacity={0.5} onPress={this.toSignUp}>
            <Text style={styles.bottomBtnText}>New User Sign Up</Text>
          </TouchableOpacity>

        </View>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#ecedf1',
    alignItems:'center'
  },
  headStyle:{
    width:88,
    height:88,
    borderWidth:3,
    borderColor:'#fff',
    borderRadius:88,
    marginTop:200,
    marginBottom:20
  },
  inputView:{
    width:width,
    height:44,
    backgroundColor:'#fff',
    marginBottom:10
  },
  inputStyle:{
    width:width-30,
    height:44,
    marginLeft:15,
    backgroundColor:'#fff',
  },
  loginBtn:{
    width:iWidth,
    height:40,
    backgroundColor:'#1fbaf3',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:15,
    marginTop:15,
    borderRadius:8
  },
  loginBtnText:{
    color:'#ffffff'
  },
  // fuwutiaokuanView:{
  //   width:iWidth,
  //   marginLeft:15,
  //   flexWrap:'wrap',
  //   flexDirection:'row',
  //   justifyContent:'flex-start',
  // },
  // fuwutiaokuan:{
  //   color:'#1fbaf3'
  // },
  // tongyi:{
  //   alignSelf:'flex-start'
  // },
  // bottomBtn:{
  //   width:iWidth,
  //   position:'absolute',
  //   bottom:15,
  //   marginLeft:15,
  //   flexDirection:'row',
  //   justifyContent:'space-between'
  // },
  bottomBtnText:{
    color:'#1fbaf3'
  }
 
});

module.exports=loginView;