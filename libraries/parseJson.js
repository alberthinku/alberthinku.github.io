class parseJson {
    constructor(obj) {
        this.obj = obj;
        if (!(obj == null)) {
            this.layerOneLen = obj.Service.length;
            this.layerTwoLen = obj.Char.length;
            this.L0_namePrefix = [];
            this.L1_Service = [];
            this.L1_Service_name = [];
            this.L2_Char = [];
            this.L2_Char_name = [];
            this.L2_Char_offset = [];
            this.L2_Char_end = [];
            this.parseJsonTask(obj);
        }
    }

    reDrawLayerZero = function (params) {
        for (var i in params) {
            this.L0_namePrefix.push(params[i]);
        }
        return;
    }//service will be array, so i is the index of the service[];

    reDrawLayerOne = function (params) {
        for (var i in params) {
            this.L1_Service.push(params[i].UUID);
            this.L1_Service_name.push(params[i].name);
        }
        // return;
    }//service will be array, so i is the index of the service[];

    reDrawLayerTwo = function (params) {
        for (var i in params) {
            this.L2_Char.push(params[i].UUID);
            this.L2_Char_name.push(params[i].name);
            this.L2_Char_offset.push(params[i].offset);
            this.L2_Char_end.push(params[i].length + params[i].offset);
        }
        // return;
    }//char will be array, so i is the index of the char[];

    isValidJsonFile = function (params) {
        // var err = false;
        if (!(params.Service == null) && !(params.Char == null) && !(params.namePrefix == null)) return true;
        return false;
    }

    parseJsonTask = function (params) {
        if (!this.isValidJsonFile(this.obj)) { return console.log("error: invalid profile!"); }
        this.reDrawLayerZero(this.obj.namePrefix);
        this.reDrawLayerOne(this.obj.Service);
        console.log("reDrawlayerOne prepared");
        this.reDrawLayerTwo(this.obj.Char);
        console.log("reDrawlayerTwo prepared");
    }
}