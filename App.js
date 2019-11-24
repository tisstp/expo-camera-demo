import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


export default class App extends React.Component {

  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasPermission: status === 'granted'});
  }

  handleCameraType = () => {
    const {cameraType} = this.state;

    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    })
  };

  render() {
    const {hasPermission} = this.state;
    if (hasPermission === null) {
      return <View/>;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{flex: 1}}>
          <Camera style={{flex: 1}} type={this.state.cameraType}>
            <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 20}}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <Ionicons
                  name="ios-photos"
                  style={{color: "#fff", fontSize: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <FontAwesome
                  name="camera"
                  style={{color: "#fff", fontSize: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>this.handleCameraType()}
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <MaterialCommunityIcons
                  name="camera-switch"
                  style={{color: "#fff", fontSize: 40}}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
