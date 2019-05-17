import { Alert, NativeEventEmitter, NativeModules, PermissionsAndroid, Platform } from "react-native";
import { delay } from "../utils";

import BleManager from 'react-native-ble-manager';
import { observable, action } from "mobx";


const IS_ANDROID = Platform.OS === "android";
const FLUX_ID = "00:1E:C0:65:D7:ED"

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class BleStore {

  @observable device = {
    info: null
  }

  @action.bound
  async requestPermissions() {
    if (!IS_ANDROID) return;

    const resultCheck = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);

    if (resultCheck) {
      console.log("Permission is OK");
      return;
    }

    const resultPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);

    if (resultPermission) {
      console.log("User accept");
      return;
    }

    throw new Error("User refused Bluetooth Permission");
  }



  async connectToDevice() {
    try {
      //ask user permissions to use bluetooth
      this
        .requestPermissions()
        .then(() => {
          //force check state
          BleManager.checkState();
        })
        .catch(error => {
          //let user know that they refused and don't start scan
          Alert.alert("Permissions refused");
          console.log(error);
        })

      //start the manager
      BleManager.start({ showAlert: false });

      // se connecte au device avec l'id
      await BleManager.connect(FLUX_ID)

      // attend un peu pour eviter de faire trop derequetes
      await delay()

      // recupere les info du device
      this.device.info = await BleManager.retrieveServices(FLUX_ID);

      // this.device => correspond au observable du Store
      console.log("Connected Success");
      BleManager.disconnect(FLUX_ID)
      return this.device.info;
    } catch (error) {
      console.log('Connection to FLUX failed');
      console.log(error);
      Alert.alert("Connection to FLUX failed");

    }
  }

  removeHandlers() {
    this.handlerBleManagerDidUpdate.remove();
    this.handlerDiscover.remove();
    this.handlerStop.remove();
  }
}



export default new BleStore();
