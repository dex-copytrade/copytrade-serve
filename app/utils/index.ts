export const getMoney = (money) => {
    if (!money) return;
    let moneyArr = parseFloat(money).toFixed(2).split("."); // 转成字符串；分割整数和小数
    money = moneyArr[0]
      ?.replace(/\b(0+)/g, "")
      .split("")
      .reverse(); //整数部分： 去掉头部的0, 000130130 => 130130；传成数组；倒置
    const digit = moneyArr[1]?.replace(/(0+)\b/g, "").split(""); //小数部分： 去掉后面的0, 20 => 2；传成数组；
  
    let resMoney: any = 0;
  
    const dic = {
      0: "零",
      1: "壹",
      2: "贰",
      3: "叁",
      4: "肆",
      5: "伍",
      6: "陆",
      7: "柒",
      8: "捌",
      9: "玖",
    };
  
    const dicUnit = {
      0: "",
      1: "拾",
      2: "佰",
      3: "仟",
    };
  
    const digitDicUnit = {
      0: "角",
      1: "分",
    };
  
    // 处理仟、佰、拾； ['1', '0', '0', '1'] => 叁仟零零壹
    const getInfo = (item) => {
      if (!item || item.length > 4) return;
  
      return item
        .map((subItem, index) => {
          if (subItem === "0") {
            return dic[0];
          }
          return `${dic[subItem]}${dicUnit[index]}`;
        })
        .reverse()
        .join("")
        .replace(/(零+)$/g, ""); //反转回来；拼接成字符串；去掉尾部的 零
    };
  
    // 处理整数部分
    switch (true) {
      case money.length < 5:
        resMoney = getInfo(money);
        break;
      case money.length < 9:
        resMoney = `${getInfo(money.slice(4, money.length))}万${getInfo(
          money.slice(0, 4)
        )}`;
        break;
      case money.length < 13:
        resMoney = `${getInfo(money.slice(8, money.length))}亿${getInfo(
          money.slice(4, 8)
        )}万${getInfo(money.slice(0, 4))}`;
        break;
    }
  
    resMoney = `${resMoney.replace(/零零零/g, "零").replace(/零零/g, "零")}`;
  
    let digitMoney;
    // 处理小数部分
    if (digit) {
      digitMoney = digit
        .map((digitItem, index) => {
          if (digitItem === "0") {
            return;
          }
          return `${dic[digitItem]}${digitDicUnit[index]}`;
        })
        .join("");
    }
  
    !!digitMoney
      ? (resMoney = `${resMoney ? `${resMoney}元` : resMoney}${digitMoney}`)
      : (resMoney = `${resMoney}元整`);
  
    return resMoney;
  };