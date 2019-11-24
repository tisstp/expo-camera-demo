import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


export default class App extends React.Component {

  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.back,
    imageUri: '',
  };

  async componentDidMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasPermission: status === 'granted'});
  }

  handleCameraType = () => {
    console.log('handleCameraType');
    const {cameraType} = this.state;

    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    })
  };

  takePicture = async () => {
    if (this.camera) {
      console.log('takePicture');
      let photo = await this.camera.takePictureAsync();
      console.log(photo);
      this.setState({imageUri: photo.uri});
    }
  };

  clearImageUri = () => {
    this.setState({imageUri: ''});
  };

  render() {
    const {hasPermission} = this.state;
    if (hasPermission === null) {
      return <View/>;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      if (this.state.imageUri !== '') {
        return (
          <View style={{flex: 1}}>
            <Image
              source={{uri: this.state.imageUri}}
              style={styles.capturedPictureImage}
              resizeMode="contain"
            />
            <View style={styles.capturedPictureBoxText}>
              <TouchableOpacity
                onPress={() => this.clearImageUri()}
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <Text style={styles.txtCaptured}>ถ่ายซ้ำ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <Text style={styles.txtCaptured}>ใช้รูปภาพ</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      } else {
        return (
          <View style={{flex: 1}}>
            <Camera
              style={{flex: 1}}
              type={this.state.cameraType}
              ref={ref => { this.camera = ref; }}
            >
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
                  onPress={() => this.takePicture()}
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
                  onPress={() => this.handleCameraType()}
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

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturedPictureImage: {
    position: 'absolute',
    height: "100%",
    width: "100%",
    padding: 10,
  },
  capturedPictureBoxText: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20
  },
  txtCaptured: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
