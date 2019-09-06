//of index js code
//service UUID
ACCELEROMETER_SERVICE = 'e95d0753-251d-470a-a062-fa1922dfa9a8';
LED_SERVICE = 'e95dd91d-251d-470a-a062-fa1922dfa9a8';

//SIG default services
DEVICE_INFORMATION_SERVICE = '0000180a-0000-1000-8000-00805f9b34fb';

//BlueST Service UUID
BLUEST_FEATUREDATA_SERVICE = '00000000-0001-11e1-9ab4-0002a5d5c51b';
BLUEST_EXTENEDDATA_SERVICE = '00000000-0002-11e1-9ab4-0002a5d5c51b';
BLUEST_DEBUG_SERVICE = '00000000-000e-11e1-9ab4-0002a5d5c51b';
BLUEST_CONTROL_SERVICE = '00000000-000f-11e1-9ab4-0002a5d5c51b';
//Characteristic UUIDS
ACCELEROMETER_DATA = 'e95dca4b-251d-470a-a062-fa1922dfa9a8';
LED_MATRIX_STATE = 'e95d7b77-251d-470a-a062-fa1922dfa9a8';
// MODEL_NUMBER_STRING = '00002a24-0000-1000-8000-00805f9b34fb';
LED_TEXT_VALUE = 'e95d93ee-251d-470a-a062-fa1922dfa9a8';
LED_SCROLLING_DELAY = 'e95d0d2d-251d-470a-a062-fa1922dfa9a8';

//ST featured sensor characteristic UUIDS
BLUEST_MOTIONSENSOR_DATA = '00e00000-0001-11e1-ac36-0002a5d5c51b';
//motion sensor value format
//LSB 01 2-7 8-13 14-19
//name TS ACC GYR MAG
//format xxxx XYZ XYZ XYZ
//signed16
BLUEST_ENVSENSOR_DATA = '001D0000-0001-11e1-ac36-0002a5d5c51b';//pht
BLUEST_ENVSENSOR_DATA_pt = '00140000-0001-11e1-ac36-0002a5d5c51b';//pt
//ENV sensor value format
//LSB 01 TBD
//
//
//
// BLUEST_ACC_EVENT = '00000400-0001-11e1-ac36-0002a5d5c51b';
// BLUEST_Switch_DATA = '20000000-0001-11e1-ac36-0002a5d5c51b';
BLUEST_MicLevel_DATA = '04000000-0001-11e1-ac36-0002a5d5c51b';

BLUEST_Proximity_DATA = '02000000-0001-11e1-ac36-0002a5d5c51b';
//0x7d312480
//FLI sensor value format
//LSB 01 2 3
//nam TS Distance
//

BLUEST_AI_featureAudioSceneClassificaiton = '00000003-0002-11e1-ac36-0002a5d5c51b';
BLUEST_AI_featureAILogging = '00000004-0002-11e1-ac36-0002a5d5c51b';
BLUEST_AI_featureActivity = '00000010-0001-11e1-ac36-0002a5d5c51b';
BLUEST_AI_featureAccelerationEvent = '00000400-0001-11e1-ac36-0002a5d5c51b';
BLUEST_AI_featureBattery = '00020000-0001-11e1-ac36-0002a5d5c51b';

BLUEST_AudioADPCM_DATA = '08000000-0001-11e1-ac36-0002a5d5c51b';
//payload : 20bytes length, w/o TS
BLUEST_AudioADPCMSync_DATA = '40000000-0001-11e1-ac36-0002a5d5c51b';
//payload : 2 bytes (int16) index + 4 bytes (int32) Predsample




class webblue_phaseOne {

    constructor(name, realname) {
        this.name = name;
        this.realname = realname;
        this.scanObj = null;
        this.status_connected = 'status_connected' + this.name;
        this.status_discovered = 'status_discovered' + this.name;
        this.status_notifications = 'status_notifications' + this.name;
        this.charFeatureMotionSensorLable = 'charFeatureMotionSensor' + this.name;
        this.chardatanotification = 'chardatanotification' + this.name
        this.status_device_name = 'device_name' + this.name;
        // this.status_Punchmeter = 'status_Punchmeter' + this.name;
        this.device_name = 'NaN';
        this.btn_scan = 'btn_scan' + this.name;
        // this.onFeatureSensorData = 'onFeatureSensorData' + this.name;

        this.parsedJsonObj = new parseJson(null);

        this.connected = false;
        this.services_discovered = false;
        // this.motionSensorData = [];
        this.collectedData = [];
        // this.motionSensorData = []

        this.selected_device = null;
        this.connected_server = null;


        var charFeatureMicLevel;
        var charFeatureProximity;
        var charFeatureAIAudioScene;
        var charFeatureAILogging;
        var charFeatureAudioADPCM;
        var charFeatureAudioADPCMSync;

        //presence of services and characteristics
        this.has_accelerometer_service = false;
        this.has_accelerometer_data = false;

        this.has_led_service = false;
        this.has_led_matrix_state = false;

        this.has_led_text_value = false;
        this.has_led_scrolling_delay = false;


        this.has_device_information_service = false;
        this.has_model_name_string = false;

        this.has_stfeaturedata_service = false;
        this.has_char_MotionSensor = false;
        this.has_char_MicLevel = false;
        this.has_char_Proximity = false;

        this.has_stextendeddata_service = false;
        this.has_stextendeddata_data = false;

        this.has_stdebug_service = false;
        this.has_stdebug_data = false;

        this.has_stcontrol_service = false;
        this.has_stcontrol_data = false;

        this.has_char_Envsenso_data_pt = false;

        this.has_char_AIAudioScene = false;
        this.has_char_AILogging = false;
        this.has_char_AIfeatureActivity = false;
        this.has_char_AIfeatureAccEvent = false;
        this.has_char_AIfeatureBattery = false;

        this.has_char_AudioADPCMData = false;
        this.has_char_AudioADPCMSync = false;

        this.notification_enabled = false;

        this.selected_Service_uuid = "";
        this.selected_Char_uuid = [];
        this.selected_Char = [];

        this.has_selected_service = false;
        this.has_selected_Char = false;

        //for punch speed calculation
        this.maxSpeed = 0;
        this.vx = 0;
        this.recordedX = 0;
        this.recordedTS = 0;

        // this.AudioPCMData = [];

    }//webblue_phaseOne constructor

    makeObjJson = function (obj) {
        this.scanObj = obj;
        this.parsedJsonObj = new parseJson(obj);
        return this.parsedJsonObj;
    }

    getPrepaired(target) {
        var prefix = target.name.substring(0, 2);
        // for (var i in this.scanObj) {
        if (prefix == this.scanObj.namePrefix[0]) {
            this.selected_Service_uuid = this.scanObj.Service[0].UUID;
            for (var sel in this.scanObj.Char) {
                this.selected_Char_uuid.push(this.scanObj.Char[sel].UUID);
                // this.selected_Char_uuid.jump = null;
            }
        }
        // }
    }

    resetUI() {
        this.setConnectedStatus(false);
        this.setDiscoveryStatus(false);
        this.setNotificationStatus(false);
        // document.getElementById('model_number').innerHTML = "";
        // document.getElementById('accelerometer_data').innerHTML = "";
        //define charFeatureMotionSensor
        // console.log(this.charFeatureMotionSensor)
        document.getElementById(this.chardatanotification).innerHTML = "DONE!";
        // document.getElementById('charFeatureMotionSensor' + this.name).innerHTML = "DONE!";
        // document.getElementById('charFeatureMicLevel').innerHTML = "";
        // document.getElementById('charFeatureProximity').innerHTML = "";
        //motionSensorData = [];
        this.collectedData = [];
        console.log('ended resetUI');
    }//resetUI

    setNotificationStatus(status) {
        //motionSensorData = [];
        this.notification_enabled = status;
        document.getElementById(this.status_notifications).innerHTML = status;
    }//setNotificationStatus

    setConnectedStatus(status) {
        this.connected = status;
        document.getElementById(this.status_connected).innerHTML = status;
        if (status == true) {
            document.getElementById(this.btn_scan).innerHTML = "Disconnect_" + this.name;
            document.getElementById(this.status_device_name).innerHTML = this.device_name;
        } else {
            document.getElementById(this.btn_scan).innerHTML = "discoverDevices_" + this.name;
            document.getElementById(this.status_device_name).innerHTML = 'NaN';
        }
    }//setConnectedStatus

    setDiscoveryStatus(status) {
        this.has_selected_service = status;
        document.getElementById(this.status_discovered).innerHTML = status;
    }//setDiscoveryStatus

    discoverDevicesOrDisconnect() {
        console.log("discoverDevicesOrDisconnect");
        if (!this.connected) {
            this.discoverDevices();
        } else {
            this.selected_device.gatt.disconnect();
            // this.resetUI();
        }
    }//discoverDevicesOrDisconnect

    discoverDevices() {
        console.log("discoverDevices");
        var options = {
            filters: [
                { namePrefix: this.scanObj.namePrefix[0] },
                { services: [this.scanObj.Service[0].UUID] }
            ],
            optionalServices: [BLUEST_CONTROL_SERVICE, BLUEST_DEBUG_SERVICE]
        }
        // //scan and list all the devices in broadcasting
        //acceptAllDevices: true,

        // scan namePrefix specified devices in broadcasting
        // BBC ubit {BBC}
        // ST BlueMicrosystem {BM}
        // ST TAI (FP-AI-SENSING) {TAI, NAI, IAI, BAI}
        // ST ME (FP-SNS-MotENV) {ME}
        // ST AM (FP-SNS-ALLMEMs) {AM}
        // ST FL (FP-SNS-FLIGHT1) {FL}
        //filters: [{ namePrefix: 'BM' }],
        // filters: [
        //     { namePrefix: 'ME' },
        //     { namePrefix: 'AM' },
        //     { namePrefix: 'TAI' },
        //     { namePrefix: 'FL' },
        //     { namePrefix: 'BM' },
        //     { namePrefix: 'NAI' },
        //     { namePrefix: 'IAI' },
        //     { namePrefix: 'BAI' },
        //     { namePrefix: 'BBC' },
        //     {
        //         services:
        //             [BLUEST_FEATUREDATA_SERVICE, BLUEST_CONTROL_SERVICE, BLUEST_DEBUG_SERVICE]
        //     }
        // ],
        //optionServices listed below
        //note: optionalServices provided to the filtering to go specifically scan, without it, 1st time system could not got ST services and devices can not be obtained, so for any new services or devices to be add, better put it at least one here.
        // optionalServices: [BLUEST_EXTENEDDATA_SERVICE, ACCELEROMETER_SERVICE, LED_SERVICE]}


        navigator.bluetooth.requestDevice(options)
            .then(device => {
                console.log('> Name:           ' + device.name);
                console.log('> Id:             ' + device.id);
                console.log('> Connected:      ' + device.gatt.connected);
                this.selected_device = device;
                console.log(this.selected_device);
                this.getPrepaired(this.selected_device);
                this.connect();// this function will connect to the device
                this.device_name = device.name;
            })
            .catch(error => {
                alert('ERROR: ' + error);
                console.log('ERROR: ' + error);
            });

    }//discoverDevices

    // led_scrolling_delayFun(sDelay) {
    //     // sDelay = 1000;
    //     console.log("LED scrolling delay value set");
    //     //state validation

    //     if (!this.has_led_scrolling_delay) {
    //         alert("Error: The connected device does not contain the LED matrix state characteristic");
    //         return false;
    //     }

    //     var buffer = new Uint16Array([sDelay])
    //     this.led_scrolling_delay.writeValue(buffer.buffer)
    //         .then(_ => {
    //             console.log('LED srolling delay set');
    //         })
    //         .catch(error => {
    //             console.log('Error: ' + error);
    //             alert('Error: ' + error);
    //             return false;
    //         });
    //     return true;
    // }//led_scrolling_delayFun

    // readFeatureSensordata() {
    //     console.log("FeatureSensorData Readout");
    //     //state validation
    //     if (!this.connected) {
    //         alert("Error: Discover and connect to a device befofe using this function");
    //         return;
    //     }
    //     if (!this.has_selected_service) {
    //         alert("Error: Service discovery has not yet completed");
    //         return;
    //     }
    //     if (!this.has_stfeaturedata_service) {
    //         alert("Error: The connected device does not contatin the FeatureSensor service");
    //         return;
    //     }
    //     if (!this.has_char_Envsenso_data_pt) {
    //         alert("Error: The connected device does not contain the MotionSensor characteristic");
    //         return;
    //     }

    //     // var featureSesor_read_out = 0;

    //     this.charFeatureEnvPT.readValue()
    //         .then(sensordata => {
    //             console.log('EnvSensor Data changed');
    //             var buffer = sensordata.buffer;
    //             console.log(buffer);
    //             var bytelenth = buffer.length;
    //             var byteOffset = 2;
    //             var data_wo_ts = new DataView(buffer, byteOffset, bytelenth);
    //             console.log(data_wo_ts);
    //             //                 var ts = dataview.getUint32(0, true);
    //             //                 var data_wo_ts = dataview.byteOffset(2).bytelenth;
    //             var Pressure_data = data_wo_ts.getUint32(0, true) / 1000;
    //             //                 var Humidity_data = data_wo_ts.getUint16(2, true) / 10;
    //             var Temperature1_data = data_wo_ts.getInt16(2, true) * 10;
    //             document.getElementById(this.charFeatureMotionSensorLable).innerHTML = '<' + Pressure_data + '-' + Temperature1_data + '>';
    //         })
    //         .catch(error => {
    //             console.log('Error: ' + error);
    //             alert('Error: ' + error);
    //             return;
    //         });
    // }//readFeatureSensorData

    // textLEDs() {
    //     console.log("LED text show");
    //     //state validation
    //     if (!this.connected) {
    //         alert("Error: Discover and connect to a device befofe using this function");
    //         return;
    //     }
    //     if (!this.has_selected_service) {
    //         alert("Error: Service discovery has not yet completed");
    //         return;
    //     }
    //     if (!this.has_led_service) {
    //         alert("Error: The connected device does not contatin the LED service");
    //         return;
    //     }
    //     if (!this.has_led_text_value) {
    //         alert("Error: The connected device does not contain the LED matrix state characteristic");
    //         return;
    //     }
    //     var led_scrolling_delay_value = 180;
    //     if (!this.led_scrolling_delayFun(led_scrolling_delay_value)) { return };

    //     var led_text_string = "what a day! HURRAY!";

    //     var led_out = new TextEncoder("utf-8").encode(led_text_string);

    //     this.led_text_value.writeValue(led_out.buffer)
    //         .then(_ => {
    //             console.log('LED matrix state changed');
    //         })
    //         .catch(error => {
    //             console.log('Error: ' + error);
    //             alert('Error: ' + error);
    //             return;
    //         });
    // }//textLEDs

    // randomLEDs() {
    //     console.log("randomLEDs");
    //     //state validation
    //     if (!this.connected) {
    //         alert("Error: Discover and connect to a device befofe using this function");
    //         return;
    //     }
    //     if (!this.has_selected_service) {
    //         alert("Error: Service discovery has not yet completed");
    //         return;
    //     }
    //     if (!this.has_led_service) {
    //         alert("Error: The connected device does not contatin the LED service");
    //         return;
    //     }
    //     if (!this.has_led_matrix_state) {
    //         alert("Error: The connected device does not contain the LED matrix state characteristic");
    //         return;
    //     }
    //     var led_array = [0, 0, 0, 0, 0];
    //     led_array[0] = Math.floor(Math.random() * 32);
    //     led_array[1] = Math.floor(Math.random() * 32);
    //     led_array[2] = Math.floor(Math.random() * 32);
    //     led_array[3] = Math.floor(Math.random() * 32);
    //     led_array[4] = Math.floor(Math.random() * 32);

    //     var led_matrix_data = new Uint8Array(led_array);

    //     this.led_matrix_state.writeValue(led_matrix_data.buffer)
    //         .then(_ => {
    //             console.log('LED matrix state changed');
    //         })
    //         .catch(error => {
    //             console.log('Error: ' + error);
    //             alert('Error: ' + error);
    //             return;
    //         });
    // }//randomLEDs

    // toggleAccelerometerNotifications() {
    //     console.log("BBC microbit toggleAccelerometerNotifications");
    //     //state validation
    //     if (!this.connected) {
    //         alert("Error: Discover and connect to a device before using this function");
    //         return;
    //     }
    //     if (!this.has_selected_service) {
    //         alert("Error: Service discovery has not yet completed");
    //         return;
    //     }
    //     if (!this.has_accelerometer_service) {
    //         alert("Error: The connected device does not contain the accelerometer service");
    //         return;
    //     }
    //     if (!this.has_accelerometer_data) {
    //         alert("Error: The connected device does not contain the accelerometer data characteristic");
    //         return;
    //     }

    //     //enable or disable notification
    //     if (!this.notification_enabled) {
    //         this.accelerometer_data.startNotifications()
    //             .then(_ => {
    //                 console.log('accelerometer notification started');
    //                 this.setNotificationStatus(true);
    //                 //when a noticiation for a characteristic is received, an event if fired with the characteristic value attached to it
    //                 //below is to register a funcction to handle this event
    //                 this.accelerometer_data.addEventListener('characteristicvaluechanged', this.onAccelerometerData.bind(this));
    //             })
    //             .catch(error => {
    //                 console.log('Error: ' + error);
    //                 alert('Error: ' + error);
    //                 return;
    //             });
    //     } else {
    //         this.accelerometer_data.stopNotifications()
    //             .then(_ => {
    //                 console.log('accelerometer notificaitons stopped');
    //                 this.setNotificationStatus(false);
    //                 //remove this event listener when we unsubscribe
    //                 this.accelerometer_data.removeEventListener('characteristicvaluechanged', this.onAccelerometerData);
    //             })
    //             .catch(error => {
    //                 console.log('Could not stop accelerometer_data notifications: ' + error);
    //             });
    //     }
    // }//toggleAccelerometerNotifications

    // //after discovering the BLUESTFeatureDataServices and MotionSensor Characteristics, let data exposed
    // toggleFeatureSensorNotifications() {
    //     console.log("toggleFeatureSensorNotifications");
    //     if (this.has_accelerometer_service) {
    //         this.toggleAccelerometerNotifications();
    //         return;
    //     }
    //     //state validation
    //     if (!this.connected) {
    //         alert("Error: Discover and connect to a device before using this function");
    //         return;
    //     }
    //     if (!this.has_selected_service) {
    //         alert("Error: Service discovery has not yet completed");
    //         return;
    //     }
    //     if (!this.has_stfeaturedata_service) {
    //         alert("Error: The connected device does not contain the StFeatureSensor service");
    //         return;
    //     }
    //     if (!this.has_char_MotionSensor) {
    //         alert("Error: The connected device does not contain the StFeatureSensor data characteristic");
    //         return;
    //     }

    //     //enable or disable notification
    //     if (!this.notification_enabled) {
    //         this.charFeatureMotionSensor.startNotifications()
    //             .then(_ => {
    //                 console.log(this.charFeatureMotionSensor + 'notification started');
    //                 this.setNotificationStatus(true);
    //                 //when a noticiation for a characteristic is received, an event if fired with the characteristic value attached to it
    //                 //below is to register a funcction to handle this event
    //                 //with the onFeatureSensorData.bind() to pass the this.name to the event
    //                 this.charFeatureMotionSensor.addEventListener('characteristicvaluechanged', this.onFeatureSensorData.bind(this));

    //                 // this.charFeatureMotionSensor.addEventListener('characteristicvaluechanged', onFeatureSensorData);
    //                 // this.motionSensorData.push(this.onFeatureSensorData);
    //             })
    //             .catch(error => {
    //                 console.log('Error: ' + error);
    //                 alert('Error: ' + error);
    //                 return;
    //             });
    //     } else {
    //         this.charFeatureMotionSensor.stopNotifications()
    //             .then(_ => {
    //                 console.log(this.charFeatureMotionSensor + 'notificaitons stopped');
    //                 console.log('saving data');
    //                 // this.collectedData = motionSensorData;
    //                 // saveData(this.collectedData, this.name + "my-dn-MotionSensor.json");
    //                 this.setNotificationStatus(false);
    //                 //remove this event listener when we unsubscribe
    //                 this.charFeatureMotionSensor.removeEventListener('characteristicvaluechanged', this.onFeatureSensorData);
    //             })
    //             .catch(error => {
    //                 console.log('Could not stop' + this.charFeatureMotionSensor + 'notifications: ' + error);
    //             });
    //     }
    // }//toggleFeatureSensorNotifications

    toggleCharacteristicNotifications() {
        console.log("toggleCharacteristicNotifications");
        //state validation
        if (!this.connected) {
            alert("Error: Discover and connect to a device before using this function");
            return;
        }
        if (!this.has_selected_service) {
            alert("Error: Service discovery has not yet completed");
            return;
        }

        this.selected_Char.forEach(sChars => {
            if (sChars == null) return;

            if (!this.notification_enabled) {
                sChars.startNotifications()
                    .then(_ => {
                        console.log(sChars + 'notification started');
                        this.setNotificationStatus(true);
                        sChars.addEventListener('characteristicvaluechanged', this.onSelectedCharData.bind(this));
                    })
                    .catch(error => {
                        console.log('Error: ' + error);
                        alert('Error: ' + error);
                        return;
                    });
            } else {
                sChars.stopNotifications()
                    .then(_ => {
                        console.log(sChars + 'notificaitons stopped');
                        console.log('saving data');
                        this.setNotificationStatus(false);
                        //remove this event listener when we unsubscribe
                        sChars.removeEventListener('characteristicvaluechanged', this.onSelectedCharData);
                    })
                    .catch(error => {
                        console.log('Could not stop' + sChars + 'notifications: ' + error);
                    });
            }
        });

    }//toggleCharisticNotifications

    connect() {
        if (this.connected == false) {
            console.log('connecting');
            this.selected_device.gatt.connect()
                .then(server => {
                    console.log('Connected to ' + server.device.id);
                    console.log('connected = ' + server.connected);
                    this.setConnectedStatus(true);
                    this.connected_server = server;
                    this.selected_device.addEventListener(
                        'gattserverdisconnected',
                        this.onDisconnected.bind(this));
                    // onDisconnected.bind(this));
                    this.discoverSvcsAndChars();
                })
                .catch(error => {
                    console.log('ERROR: could not connect -' + error);
                    alert('ERROR: could not connect -' + error);
                    this.setConnectedStatus(false);
                });
        }
    }//connect


    discoverSvcsAndChars() {
        console.log("discoverSvcsAndChars server=" + this.connected_server);
        this.connected_server.getPrimaryServices()
            .then(services => {

                this.has_selected_service = false;

                var service_discovered = 0;
                var service_count = services.length;
                console.log("Got" + this.service_count + " services");

                services.forEach(service => {

                    if (service.uuid == this.selected_Service_uuid) {
                        this.has_selected_service = true;
                    }

                    console.log('getting Characteristics for service' + service.uuid);

                    service.getCharacteristics().then(characteriscs => {
                        console.log('> Service: ' + service.uuid);
                        service_discovered++;
                        var characteriscs_discovered = 0;
                        var characterisc_count = characteriscs.length;

                        characteriscs.forEach(characterisc => {
                            characteriscs_discovered++;
                            console.log('>> Characteristic: ' + characterisc.uuid);
                            var index = this.selected_Char_uuid.indexOf(characterisc.uuid);
                            if (!(index < 0)) { this.selected_Char[index] = characterisc; }

                            if (service_discovered == service_count && characteriscs_discovered == characterisc_count) {
                                console.log("FINISHED DISCOVERY");
                                this.setDiscoveryStatus(true);
                            }
                        });
                    });
                });
            })
            .catch(error => {
                console.log('ERROR: getPrimaryservice -' + error);
                alert('ERROR: getPrimaryservice -' + error);
                this.setConnectedStatus(false);
            });
    }//discoverSvcsAndChars

    onDisconnected = function () {
        var tmp = this;
        console.log("onDisconnected");
        if (tmp.collectedData.length > 0) {
            saveData(tmp.collectedData, tmp.name + "my-dn-MotionSensor.json");
        }
        tmp.resetUI();
    }//onDisconnencted

    onSelectedCharData = function (event) {
        var node = this;
        // function onFeatureSensorData(event) {
        // console.log(node);

        var buffer = event.target.value.buffer;
        var dataview = new DataView(buffer);
        var TS = dataview.getUint16(0, true);
        // var presentTS = event.timeStamp;

        // var ST_ACC_X = dataview.getInt16(2, true) / 1000; //(2,true) means islittleEndian in this case [2]=L [3]=H, will be turned into HL as return value of this getInt16.
        // var ST_ACC_Y = dataview.getInt16(4, true) / 1000;
        // var ST_ACC_Z = dataview.getInt16(6, true) / 1000;
        // var ST_GYRO_X = dataview.getInt16(8, true) / 1000;
        // var ST_GYRO_Y = dataview.getInt16(10, true) / 1000;
        // var ST_GYRO_Z = dataview.getInt16(12, true) / 1000;
        // var ST_MAG_X = dataview.getInt16(14, true) / 1000;
        // var ST_MAG_Y = dataview.getInt16(16, true) / 1000;
        // var ST_MAG_Z = dataview.getInt16(18, true) / 1000;
        var temp = '';
        var offs = node.scanObj.Char[0].offset;
        var len = node.scanObj.Char[0].length + offs;
        for (var i = offs; i < len; i++) {
            temp = temp + ((256 + dataview.getUint8(i)).toString(16).substring(1));
        }
        // var temp = TS.toString();
        console.log(temp);
        document.getElementById(node.chardatanotification).innerHTML = temp;
        // return temp;
        node.collectedData.push(temp);
        // return motionSensorData;

    }//onSelectedChar

    // onFeatureSensorData = function (event) {
    //     var node = this;
    //     // function onFeatureSensorData(event) {
    //     console.log(node);
    //     var buffer = event.target.value.buffer;
    //     var dataview = new DataView(buffer);
    //     var TS = dataview.getUint16(0, true);
    //     var presentTS = event.timeStamp;
    //     // var TS_HH = Math.floor(TS / 360000);
    //     // var TS_MM = Math.floor(TS / 6000);
    //     // var TS_SS = Math.floor(TS / 100) % 60;
    //     // var TS_subS = TS % 100;
    //     var ST_ACC_X = dataview.getInt16(2, true) / 1000; //(2,true) means islittleEndian in this case [2]=L [3]=H, will be turned into HL as return value of this getInt16.
    //     var ST_ACC_Y = dataview.getInt16(4, true) / 1000;
    //     var ST_ACC_Z = dataview.getInt16(6, true) / 1000;
    //     var ST_GYRO_X = dataview.getInt16(8, true) / 1000;
    //     var ST_GYRO_Y = dataview.getInt16(10, true) / 1000;
    //     var ST_GYRO_Z = dataview.getInt16(12, true) / 1000;
    //     var ST_MAG_X = dataview.getInt16(14, true) / 1000;
    //     var ST_MAG_Y = dataview.getInt16(16, true) / 1000;
    //     var ST_MAG_Z = dataview.getInt16(18, true) / 1000;
    //     var temp = document.getElementById(node.charFeatureMotionSensorLable).innerHTML = "-host TS:" + presentTS + 'node' + node.name + "-node TS:" + TS + "  A< " + ST_ACC_X + "," + ST_ACC_Y + "," + ST_ACC_Z
    //         + " > G< " + ST_GYRO_X + "," + ST_GYRO_Y + "," + ST_GYRO_Z
    //         + " > M< " + ST_MAG_X + "," + ST_MAG_Y + "," + ST_MAG_Z + " >";
    //     console.log(temp);
    //     // return temp;
    //     node.collectedData.push(temp);
    //     // return motionSensorData;

    //     var dt = (TS - node.recordedTS) * 0.01; //in second
    //     node.vx += (ST_ACC_X + node.recordedX) / 2 * dt;
    //     var speed = Math.abs(node.vx);
    //     if (node.maxSpeed < speed) { node.maxSpeed = speed; document.getElementById(node.status_Punchmeter).innerHTML = speed; }
    //     node.recordedTS = TS;
    //     node.recordedX = ST_ACC_X;

    // }//onFeatureSensorData

    // onAccelerometerData = function (event) {
    //     var node = this;
    //     console.log("BBC microbit onAccelerometerData");
    //     var buffer = event.target.value.buffer;
    //     var presentTS = event.timeStamp;
    //     var dataview = new DataView(buffer);
    //     var X = dataview.getInt16(0, true) / 1000;
    //     var Y = dataview.getInt16(2, true) / 1000;
    //     var Z = dataview.getInt16(4, true) / 1000;
    //     // console.log("X = " + X + ", Y = " + Y + ", Z = " + Z);
    //     var temp = document.getElementById(node.charFeatureMotionSensorLable).innerHTML = "-host TS:" + presentTS + 'node' + node.name + "  A< " + X + ", " + Y + ", " + Z + " >";
    //     console.log(temp);
    //     node.collectedData.push(temp);
    //     // num_X = X;
    //     // num_Y = Y;
    //     // num_Z = Z;
    //     // RG.Effects.updateCanvas(draw);

    //     var dt = (presentTS - node.recordedTS) * 0.001; //in second
    //     node.vx += (X + node.recordedX) / 2 * dt;
    //     var speed = Math.abs(node.vx);
    //     if (node.maxSpeed < speed) { node.maxSpeed = speed; document.getElementById(node.status_Punchmeter).innerHTML = speed; }
    //     node.recordedTS = presentTS;
    //     node.recordedX = X;
    // }//onAccelerometerData

}//webblue-phaseOne
