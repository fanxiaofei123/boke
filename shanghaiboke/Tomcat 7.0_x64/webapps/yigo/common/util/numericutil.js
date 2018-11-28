YIUI.NumericUtil = (function () {
    var chineseDigits = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    var Return = {
        getAmountInWords: function (amount) {
            if (amount.abs().comparedTo(new Decimal(999999999999999.99)) > 0) {
                alert("参数值超出允许范围 (-999999999999999.99 ～ 999999999999999.99)！");
                return;
            }
            var negative = amount.isNegative();
            amount = amount.abs();
            var temp = parseFloat(amount.toFixed(2, YIUI.NUMBEREDITOR_ROUNDINGMODE.HALF_UP)) * 100;
            var numFen = parseInt(temp % 10);
            temp = temp / 10;
            var numJiao = parseInt(temp % 10);
            temp = temp / 10;
            var parts = [], numParts = 0, part;
            for (var ci = 0; ; ci++) {
                if (temp == 0)
                    break;
                part = parseInt(temp % 10000);
                parts[ci] = part;
                numParts++;
                temp = temp / 10000;
            }
            var beforeWanIsZero = true, chineseStr = "", partChinese = "";
            for (var i = 0; i < numParts; i++) {
                partChinese = this.partTranslate(parts[i]);
                if (i % 2 == 0) {
                    beforeWanIsZero = (partChinese == "");
                }
                if (i != 0) {
                    if (i % 2 == 0) {
                        if (parts[i - 1] == 0 || parts[i - 1] >= 1000) {
                            chineseStr = "亿" + chineseStr;
                        } else {
                            chineseStr = "亿零" + chineseStr;
                        }
                    } else {
                        if (partChinese == "" && !beforeWanIsZero) {
                            chineseStr = "零" + chineseStr;
                        } else {
                            if (parts[i - 1] > 0 && parts[i - 1] < 1000) {
                                chineseStr = "零" + chineseStr;
                            } else if (parts[i - 1] < 1000 && parts[i - 1] != 0) {
                                chineseStr = "零" + chineseStr;
                            }
                            if (partChinese !== "") {
                                chineseStr = "万" + chineseStr;
                            }
                        }
                    }
                }
                chineseStr = partChinese + chineseStr;
            }
            if (chineseStr.length > 0) {
                chineseStr = chineseStr + "圆";
            } else {
                chineseStr += "零圆";
            }
            if (numFen == 0 && numJiao == 0) {
                chineseStr = chineseStr + "整";
            } else if (numFen == 0) {
                chineseStr = chineseStr + chineseDigits[numJiao] + "角整";
            } else {
                if (numJiao == 0)
                    chineseStr = chineseStr + "零" + chineseDigits[numFen] + "分";
                else
                    chineseStr = chineseStr + chineseDigits[numJiao] + "角" + chineseDigits[numFen] + "分";
            }
            if (negative)
                chineseStr = "负" + chineseStr;

            return chineseStr;

        },
        partTranslate: function (amount) {
            if (amount < 0 || amount > 10000) {
                alert("NumericUtil：参数必须是大于等于 0，小于 10000 的整数！");
                return;
            }
            var units = ["", "拾", "佰", "仟"], temp = parseInt(amount),
                amountStr = amount.toString(),
                amountStrLength = amountStr.length,
                lastIsZero = true, chineseStr = "";
            for (var i = 0; i < amountStrLength; i++) {
                if (temp == 0)
                    break;
                var digit = parseInt(temp % 10);
                if (digit == 0) {
                    if (!lastIsZero)
                        chineseStr = "零" + chineseStr;
                    lastIsZero = true;
                } else {
                    chineseStr = chineseDigits[digit] + units[i] + chineseStr;
                    lastIsZero = false;
                }
                temp = temp / 10;
            }
            return chineseStr;
        }
    };
    return Return;
})();