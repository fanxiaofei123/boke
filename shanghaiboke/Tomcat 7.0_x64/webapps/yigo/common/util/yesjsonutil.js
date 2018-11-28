YIUI.YesJSONUtil = (function () {
    var convertJSON = function(para){

        var json = {};
        if(para == null){
            json.value = null;
            json.dataType = -1;
        //}else if(para instanceof YIUI.JSONObject){
        //   json.value = para;
        //   json.dataType = 10;
        //}else if(para instanceof YIUI.JSONArray){
        //    json.value = para;
        //    json.dataType = 11;
        }else if(para instanceof YIUI.ItemData){
            json.value = para;
            json.dataType = 12;
        }else if(para instanceof DataDef.DataTable) {
            json.value = YIUI.DataUtil.toJSONDataTable(para);
            json.dataType = 9;
        }else if(para instanceof Decimal) {
            json.value = para;
            json.dataType = 4;
        }else if(typeof para == "boolean") {
            json.value = para;
            json.dataType = 6;
        }else if(typeof para == "string"){
            json.value = para;
            json.dataType = 2;
        }else if($.isNumeric(para)) {
            json.value = para;
            json.dataType = 7;
        }else if(para instanceof Date) {
            json.value = para.getTime();
            json.dataType = 3;
        }else {
            json.value = para;
            json.dataType = 2;
        }


        return json;

    };

    var Return = {
        toJSONArray: function (array) {
            if(!array){
                return null;
            }

            if (!$.isArray(array)){
                return null;
            }

            var jsonArray = new Array();
            for(var i = 0 ; i < array.length;i++){
                jsonArray[i] = convertJSON(array[i]);
            }

            return jsonArray;

        },
        toJSONObject: function (obj) {
            if(!obj){
                return null;
            }

            if ($.isEmptyObject(obj)){
                return null;
            }

            for (var key in obj) {
                obj[key] = convertJSON(obj[key]);
            }

            return obj;

        }
    };
    return Return;
})();