import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


export default class App extends React.Component {

  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.back,
    imageUri: '',
  };

  async componentDidMount() {
    this.getCameraPermissionAsync();
    this.getCameraRollPermissionAsync();
  }

  getCameraPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  };

  getCameraRollPermissionAsync = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

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
      this.setState({imageUri: photo.uri});
      console.log(photo);
    }
  };

  clearImageUri = () => {
    this.setState({imageUri: ''});
  };

  pickImage = async () => {
    console.log('pickImage');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });
    if (!result.cancelled) {
      this.setState({imageUri: result.uri});
    }
    console.log(result);
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
          <View style={styles.container}>
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
                  onPress={() => this.pickImage()}
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
    height: "90%",
    width: "90%",
  },
  capturedPictureBoxText: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20
  },
  txtCaptured: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
