class refreshLayer {
    constructor(obj) {
        this.textG = document.getElementById("GATTShow");
        this.textG.innerHTML = "";
        // document.getElementById
        this.L1_tagPre = "L1_Svc";
        this.L2_tagPre = "L2_Chr";
        if (!(obj == null)) {
            this.obj = obj;
            //obj is the parsedJson which contains fully info of the profile!
            this.textGATT = this.textG;
            this.textGATT.appendChild(document.createElement("hr"));
            // this.textGATT = document.createElement("form");
            // this.textGATT.setAttribute("class", "form-inline");
            // this.textG.appendChild(this.textGATT);


            //L1
            this.L1_Service_Status = [];
            this.L1_Service_Show(obj.L1_Service, obj.L1_Service_name);
            //L2
            this.L2_Char_Status = [];
            this.L2_Char_Show(obj.L2_Char, obj.L2_Char_name);
            //L0
            this.L0_button = "";
            this.L0_namePrefix_Show(obj.L0_namePrefix);
        }
    }

    L1_Service_refresh(dev, obj) {
        // if (this.L1_Service_Status[0].checked) console.log("read!");
        // this.textGATT.appendChild(this.L1_Service_Status[0]);
        var status = false;
        for (var i = 0; i < this.L1_Service_Status.length; i++) {
            status = document.getElementById(this.L1_tagPre + i + "ckbox_R").checked;
            if (status) console.log("Service " + obj.L1_Service_name[i] + ">reading");
            status = document.getElementById(this.L1_tagPre + i + "ckbox_W").checked;
            if (status) console.log("Service " + obj.L1_Service_name[i] + ">writing");
            status = document.getElementById(this.L1_tagPre + i + "ckbox_N").checked;
            if (status) console.log("Service " + obj.L1_Service_name[i] + ">notifying");

        }
    }

    L2_Char_refresh(dev, obj) {
        var status;
        for (var i = 0; i < this.L2_Char_Status.length; i++) {
            // if dev.selected_Char[i].property
            try {
                var selected_Char = dev.selected_Char[i].properties;
                status = document.getElementById(this.L2_tagPre + i + "ckbox_R");
                if (status.checked && selected_Char.read) { console.log("Char " + obj.L2_Char_name[i] + ">reading"); }
                else if (status.checked) { alert(obj.L2_Char_name[i] + ":Char is not readable!"); status.checked = false; }

                status = document.getElementById(this.L2_tagPre + i + "ckbox_W");
                if (status.checked && selected_Char.write) { console.log("Char " + obj.L2_Char_name[i] + ">writing"); }
                else if (status.checked) { alert(obj.L2_Char_name[i] + ":Char is not writable!"); status.checked = false; }

                status = document.getElementById(this.L2_tagPre + i + "ckbox_N");
                if (status.checked && selected_Char.notify) { console.log("Char " + obj.L2_Char_name[i] + ">notifying"); }
                else if (status.checked) { alert(obj.L2_Char_name[i] + ":Char not notifyable!"); status.checked = false; }
            }
            catch (error) {
                console.log(error);
                alert(error);
                this.RWN_boxclear(i);
            }
        }
    }
    RWN_boxclear = function (i) {
        document.getElementById(this.L2_tagPre + i + "ckbox_R").checked = false;
        document.getElementById(this.L2_tagPre + i + "ckbox_W").checked = false;
        document.getElementById(this.L2_tagPre + i + "ckbox_N").checked = false;
    }
    refreshSelf = function (connected_dev) {
        this.L1_Service_refresh(connected_dev, this.obj);
        this.L2_Char_refresh(connected_dev, this.obj);
    }


    L0_namePrefix_Show(subj) {
        this.L0_button = document.createElement("BUTTON");
        this.L0_button.innerHTML = "namePrefix" + subj + "to be reached";
        this.textGATT.appendChild(this.L0_button);
        var line = document.createElement("lable");
        // line.insertAdjacentText("afterend", "hr");
        this.textGATT.appendChild(line);
    }

    RWN_placement(RWNlable, tag) {
        var newLable = document.createElement("lable");
        newLable.setAttribute("class", "container");

        var checkinput = document.createElement("input");
        // checkinput.setAttribute("name", RWNlable);
        checkinput.setAttribute("id", tag);
        checkinput.setAttribute("type", "checkbox");
        // checkinput.setAttribute("checked", "checked");
        var tmp = document.createElement("span");
        tmp.setAttribute("class", "checkmark");

        var strRWN = RWNlable;
        tmp.append(strRWN);
        // tmp.append(checkinput);
        // newLable.insertAdjacentText("afterbegin", "&" + RWNlable);


        newLable.appendChild(checkinput);
        newLable.appendChild(tmp);

        this.textGATT.appendChild(newLable);

    }

    RWN_checkbox = function (RWN_tag) {
        this.RWN_placement("R", RWN_tag + "ckbox_R");
        this.RWN_placement("W", RWN_tag + "ckbox_W");
        this.RWN_placement("N", RWN_tag + "ckbox_N");
    }

    L1_Service_Show(subj, subj_name) {
        for (var i in subj) {
            var newLable = document.createElement("lable");
            // var L1_Service_info = document.createTextNode("text");
            var L1_Service_info = "";
            // L1_Service_info.nodeName = "L1node" + i;
            L1_Service_info = "Service Name - " + subj_name[i] + " > UUID : " + subj[i];
            // L1_Service_info.
            newLable.insertAdjacentText("beforeend", L1_Service_info);

            // this.textGATT.appendChild(L1_Service_info);

            this.textGATT.appendChild(newLable);
            this.RWN_checkbox(this.L1_tagPre + i.toString());

            this.L1_Service_Status.push(L1_Service_info);

            // var L1_tag = document.createElement("");
            var line = document.createElement("hr");
            // line.style.width = "20px";
            // line.style.height = "3px";
            // line.style.position = "relative";
            // line.style.top = "6px";
            // line.style.left = 1 + "px";
            // line.style.backgroundColor = "red";
            this.textGATT.appendChild(line);//Display the line
        }
    }

    L2_Char_Show(subj, subj_name) {
        for (var i in subj) {
            var newLable = document.createElement("lable");
            var L2_Char_info = ">>Char name - " + subj_name[i] + " > UUID : " + subj[i];

            newLable.insertAdjacentText("beforeend", L2_Char_info);
            this.textGATT.appendChild(newLable);

            this.RWN_checkbox(this.L2_tagPre + i.toString());

            this.L2_Char_Status.push(L2_Char_info);

            var line = document.createElement("hr");
            this.textGATT.appendChild(line);
        }
    }
}

