//of index js code

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
        this.device_name = 'NaN';
        this.btn_scan = 'btn_scan' + this.name;

        this.parsedJsonObj = new parseJson(null);

        this.connected = false;
        this.services_discovered = false;
        this.collectedData = [];

        this.selected_device = null;
        this.connected_server = null;

        this.notification_enabled = [];
        this.detected_services = [];//will collect all the detected services handle
        this.detected_Chars = [];//will collect all the detected characteristics handle

        this.selected_Service_uuid = "";

        this.parseObjJson_Char_uuid = [];//should collect all the characteristic uuid, note this uuid list comes from parsedJsonObj file, it not matching to selected_Char after the discovery process!

        this.selected_Char = []; //should collect all the selected characteristic handle

        this.updated_Char_choice_R = [];//should collect all the selected char with Readable confirmed
        this.updated_Char_choice_W = [];//should collect all the selected char with writable confirmed
        this.updated_Char_choice_N = [];//should collect all the selected char with Notifiable confirmed

        this.has_selected_service = false;
        this.has_selected_Char = false;

    }//webblue_phaseOne constructor

    disassembleEventDataOffset(uuid) {
        // var offset = this.parsedJsonObj.L2_Char_offset[this.parsedJsonObj.L2_Char.indexOf(uuid)];
        var offset = this.parsedJsonObj.L2_Char_offset[uuid];
        return offset;
    }

    disassembleEventDataValidEnd(uuid) {
        // var ValidEnd = this.parsedJsonObj.L2_Char_end[this.parsedJsonObj.L2_Char.indexOf(uuid)];
        var ValidEnd = this.parsedJsonObj.L2_Char_end[uuid];
        return ValidEnd;
    }

    makeObjJson = function (obj) {
        this.scanObj = obj; //this.scanObj is the Json.Parse() output result, which did not make data interpretion yet
        this.parsedJsonObj = new parseJson(obj); //this.parsedJsonObj is the parseJson() output result, which has been interpreted
        return this.parsedJsonObj;
    }

    getPrepared(target) {
        var prefix = target.name.substring(0, 2); //namePrefix matching var

        var index = this.scanObj.namePrefix.indexOf(prefix); //if the prefix in the scanObj.namePrefix then obtain all the char

        if (index > -1) {
            this.selected_Service_uuid = this.scanObj.Service[index].UUID;
            for (var sel in this.scanObj.Char) {
                this.parseObjJson_Char_uuid.push(this.scanObj.Char[sel].UUID);
            }
        }
    }//of getPrepared

    resetUI() {
        this.setConnectedStatus(false);
        this.setDiscoveryStatus(false);

        document.getElementById(this.chardatanotification).innerHTML = "DONE!";

        this.collectedData = [];
        console.log('ended resetUI');
    }//resetUI

    setNotificationStatus(index, status) {

        if (index == -1) { this.notification_enabled = []; }
        this.notification_enabled[index] = status;
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
        // var tmpFilter = [];
        // this.scanObj.namePrefix
        //     .forEach(element => {
        //         tmpFilter.push({ namePrefix: element });
        //     });
        // this.scanObj.Service
        //     .forEach(element => {
        //         tmpFilter.push({ services: [element.UUID] })
        //     });
        // var options = {
        //     filters:
        //         tmpFilter,
        //     optionalServices: [BLUEST_CONTROL_SERVICE, BLUEST_DEBUG_SERVICE]
        // }

        var tmpFilter = [];
        this.parsedJsonObj.L0_namePrefix
            .forEach(element => {
                tmpFilter.push({ namePrefix: element });
            });
        this.parsedJsonObj.L1_Service
            .forEach(element => {
                tmpFilter.push({ services: [element] })
            });
        var options = {
            filters:
                tmpFilter,
            optionalServices: []
        }

        navigator.bluetooth.requestDevice(options)
            .then(device => {
                console.log('> Name:           ' + device.name);
                console.log('> Id:             ' + device.id);
                console.log('> Connected:      ' + device.gatt.connected);
                this.selected_device = device;
                console.log(this.selected_device);
                this.getPrepared(this.selected_device);
                this.connect();// this function will connect to the device
                this.device_name = device.name;
            })
            .catch(error => {
                alert('ERROR: ' + error);
                console.log('ERROR: ' + error);
            });

    }//discoverDevices

    readDataview(uuid, buffer) {
        //TODO

        var dataType = this.parsedJsonObj.L2_Char_datatype[uuid];
        var byteOffset = this.parsedJsonObj.L2_Char_offset[uuid];
        var byteLength = this.parsedJsonObj.L2_Char_byteLength[uuid];
        if (byteLength > buffer.byteLength - byteOffset) byteLength = buffer.byteLength - byteOffset;
        var littleEndian = this.parsedJsonObj.L2_Char_littleEndian[uuid];
        var dataview = new DataView(buffer.buffer, byteOffset, byteLength);

        var bufferArray = [];

        if (dataType == "Int16") {
            // textencodeKey = "Int16";
            bufferArray = new Int16Array(dataview.buffer);
        }

        if (dataType == "Uint8") {
            // textencodeKey = "Uint8";
            bufferArray = new Uint8Array(dataview.buffer);
        }

        if (dataType == "Uint16") {
            // textencodeKey = "Uint16";
            bufferArray = new Uint16Array(dataview.buffer);
        }

        if (dataType == "Utf8") {
            // textencodeKey = "utf-8";
            bufferArray = new Uint8Array(dataview.buffer);
        }

        return bufferArray;
    }//readDataview

    commitCharacteristicRead() {
        //TODO
        console.log("CharacteristicReading");
        if (!(this.connectStatusValidated())) return;


        this.updated_Char_choice_R.forEach(sChars => {
            if (sChars == null) return;
            if ((this.updated_Char_choice_R.indexOf(sChars) < 0)) return;

            var index = this.selected_Char.indexOf(sChars);
            if ((index < 0)) return;

            sChars.readValue()
                .then(dataRcv => {
                    console.log("data read successfully" + dataRcv);

                    var dataReadout = this.readDataview(sChars.uuid, dataRcv);
                    console.log(dataReadout);
                    //TODO
                })
                .catch(error => {
                    console.log('Error: ' + error);
                    alert('Error: ' + error);
                    return;
                });

        });
    }

    getCharTextInput(uuid) {
        var buffer = document.getElementById("TTin" + uuid).value;
        return buffer;
    }

    commitCharacteristicWrite() {
        //TODO
        console.log("CharacteristicWriting");
        //state validation
        if (!(this.connectStatusValidated())) return;

        this.updated_Char_choice_W.forEach(sChars => {
            if (sChars == null) return;
            if ((this.updated_Char_choice_W.indexOf(sChars) < 0)) return;

            var index = this.selected_Char.indexOf(sChars);
            if ((index < 0)) return;

            var dataType = this.parsedJsonObj.L2_Char_datatype[sChars.uuid];
            var byteOffset = this.parsedJsonObj.L2_Char_offset[sChars.uuid];
            var littleEndian = this.parsedJsonObj.L2_Char_littleEndian[sChars.uuid];
            var textencodeKey = "";

            var strInput = this.getCharTextInput(sChars.uuid);
            var buffer = new ArrayBuffer(1);

            if (dataType == "Int16") {
                textencodeKey = "Int16";
                buffer = new Int16Array([parseInt(strInput)]);
            }

            if (dataType == "Uint8") {
                textencodeKey = "Uint8";
                buffer = new Uint8Array([parseInt(strInput)]);
            }

            if (dataType == "Uint16") {
                textencodeKey = "Uint16";
                buffer = new Uint16Array([parseInt(strInput)]);
            }

            if (dataType == "Utf8") {
                textencodeKey = "utf-8";
                buffer = new TextEncoder(textencodeKey).encode(strInput);
            }

            // var buffer = new TextEncoder(dataType).encode(this.getCharTextInput(sChars.uuid));
            // if (textencodeKey == "utf-8") buffer = new TextEncoder(textencodeKey).encode(strInput);
            // else buffer = new Uint16Array([parseInt(strInput)]);

            console.log("writing: " + buffer);

            sChars.writeValue(buffer.buffer)
                .then(_ => {
                    console.log("value writed");
                    //TODO to show accordingly
                })
                .catch(error => {
                    console.log('Error: ' + error);
                    alert('Error: ' + error);
                    return;
                });


        });

    }

    toggleCharacteristicNotifications() {
        console.log("toggleCharacteristicNotifications");

        if (!(this.connectStatusValidated())) return;

        this.updated_Char_choice_N.forEach(sChars => {
            if (sChars == null) return;

            var index = this.selected_Char.indexOf(sChars);

            if ((index < 0)) return;

            if (!this.notification_enabled[index]) {
                sChars.startNotifications()
                    .then(_ => {
                        console.log(sChars + 'notification started');
                        this.setNotificationStatus(index, true);
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
                        this.setNotificationStatus(index, false);
                        //remove this event listener when we unsubscribe
                        sChars.removeEventListener('characteristicvaluechanged', this.onSelectedCharData);
                    })
                    .catch(error => {
                        console.log('Could not stop' + sChars + 'notifications: ' + error);
                    });
            }
        });

    }//toggleCharisticNotifications

    connectStatusValidated = function () {
        //state validation
        if (!this.connected) {
            alert("Error: Discover and connect to a device before using this function");
            return false;
        }
        if (!this.has_selected_service) {
            alert("Error: Service discovery has not yet completed");
            return false;
        }
        return true;
    }//connectStatusValidated

    commitCharActions = function () {
        if ((this.updated_Char_choice_N.length > 0)) this.toggleCharacteristicNotifications();
        if ((this.updated_Char_choice_R.length > 0)) this.commitCharacteristicRead();
        if ((this.updated_Char_choice_W.length > 0)) this.commitCharacteristicWrite();
    }//commitCharActions

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

                    this.detected_services.push(service);//collect all the detected service handles


                    service.getCharacteristics().then(characteriscs => {
                        console.log('> Service: ' + service.uuid);
                        service_discovered++;
                        var characteriscs_discovered = 0;
                        var characterisc_count = characteriscs.length;

                        characteriscs.forEach(characterisc => {
                            characteriscs_discovered++;
                            console.log('>> Characteristic: ' + characterisc.uuid);

                            this.detected_Chars.push(characterisc);//collect all the discovered char handle

                            var index = this.parseObjJson_Char_uuid.indexOf(characterisc.uuid);//from parsedJson Obj, we shrink the range of selected_Char

                            // if (!(index < 0)) { this.selected_Char[index] = characterisc; }
                            if (!(index < 0)) {
                                this.selected_Char.push(characterisc);
                            }

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
        var uuid = event.currentTarget.uuid;

        var buffer = event.target.value.buffer;
        var dataview = new DataView(buffer);
        var TS = dataview.getUint16(0, true);

        var temp = '';
        //TODO, the indexCN method is stupid and waste, should find a better way.!
        var offset = node.disassembleEventDataOffset(uuid);
        // var offs = node.scanObj.Char[this.indexCN].offset;
        var ValidEnd = node.disassembleEventDataValidEnd(uuid);

        for (var i = offset; i < ValidEnd; i++) {
            temp = temp + ((256 + dataview.getInt8(i)).toString(16).substring(1));
            //make sure each byte has two digital restored into temp;
        } //make rawdata showed off


        console.log(temp);


        // document.getElementById(node.chardatanotification).innerHTML = event.currentTarget.uuid + ":" + temp + "=" + readoutData;
        // return temp;

        var readoutData = this.readDataview(uuid, dataview);
        document.getElementById(node.chardatanotification).innerHTML = event.currentTarget.uuid + ":" + readoutData;
        node.collectedData.push({ readoutData });
        // return motionSensorData;

    }//onSelectedChar

}//webblue-phaseOne
