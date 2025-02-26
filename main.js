/*
多个账号说明：
const varname = ["手机号","密码"];
MainAccont.push(account1[0]);//0账号
MainPassword.push(account1[1]);//1密码
WxName.push(account1[2]);//微信名称
account2 = ["账号", "密码", "微信用户名"];
account3 = ["账号", "密码", "微信用户名"];
*/

MainAccont = [];//全局账号数组
MainPassword = [];//全局密码数组
WxName = [];//添加微信名称以便发送
/* 如果加入账号 只需要添加下方内容
const varname = ["手机号","密码"];
MainAccont.push(account1[0]);//0账号
MainPassword.push(account1[1]);//1密码
WxName.push(account1[2]);//微信名称
*/
///第一个账号
const account1 = ["账号", "密码", "用户名"];
MainAccont.push(account1[0]);//0账号
MainPassword.push(account1[1]);//1密码
WxName.push(account1[2]);
///第一个账号

MainCount = MainAccont.length;
//检测无障碍是否开启
auto.waitFor();
//亮屏
readylight();
//启动程序并排除弹窗
back();
sleep(1000);
back();
//先登录后打卡
for (var i = 0; i < MainCount; i++) {
    sleep(2000);
    ChangeAccont(MainAccont[i], MainPassword[i]);
    startDaKa();
    SendPctWt(WxName[i]);
};
sleep(1000);
lockScreen();

//function
function readylight() {
    device.wakeUpIfNeeded();
    if (!device.isScreenOn()) {
        device.wakeUp();
        if (!device.isScreenOn()) {
            exit();
            toast("亮屏异常");
        };

    };
}


function startDaKa() {

    //RencentAty = currentActivity(); 
    waitForActivity("com.delicloud.app.smartoffice.ui.activity.MainActivity", 2000);
    sleep(5000);
    var Dakaready = "已在打卡范围内";
    var Findreadytext = id("tv_check_in_status").findOne().text();
    if (Findreadytext == Dakaready) {
        //设置随机数，防止打卡在一个时间点
        let RandomDaka = random(0, 10) * 1000 * 60;
        let MyTime = id("tv_today_check_in_time").findOne().text();
        toast(util.format("等待:%d分钟时间后开始打卡,现在打卡时间:%s", RandomDaka / 1000 / 60, MyTime));
        sleep(RandomDaka);
        //打卡
        id("iv_check_in_out").findOne().click();
        sleep(10000);
        //截图
        takeScreenshot();
        sleep(2000);
        back();
        sleep(2000);
        //下滑防止遮挡
        scrollDown();
        sleep(3000);
        //打卡结束跳到主界面
        //开始截图考勤记录
        //id("tv_app_name").findOne(2000).parent().click();
        let kaoqin = text("考勤记录").findOne().bounds();
        click(kaoqin.centerX(), kaoqin.centerY());
        sleep(10000);
        takeScreenshot();
        sleep(2000);
        back();
        sleep(2000);
    } else {
        exit();
        console.show();
        toast("网络或设备异常");
    };

};

//切换账号
function ChangeAccont(accont, password) {
    //先启动得力E+
    app.launchPackage("com.delicloud.app.smartoffice");
    //等待主界面
    waitForActivity("com.delicloud.app.smartoffice.ui.activity.MainActivity", 2000);
    let otheraccont = accont;
    let otherpassword = password;
    id("navigation_user_center").findOne().click();
    sleep(2000);
    id("tv_setting").findOne().click();
    sleep(2000);
    id("btn_logout").findOne().click();
    sleep(2000);
    id("tv_confirm").findOne().click();
    //等待 防止网络异常造成脚本卡顿
    sleep(10000);
    RencentAty = currentActivity();
    if (RencentAty != "com.delicloud.app.smartoffice.ui.activity.LoginContentActivity") { exit };
    setText(0, otheraccont);
    sleep(2000);
    input(1, otherpassword);
    sleep(2000);
    id("cb_agree").findOne().click();
    sleep(2000);
    id("btn_login").findOne().click();
};
//打卡后微信发送消息
function SendPctWt(Wxname) {
    sleep(3000);
    app.launchPackage("com.tencent.mm");
    sleep(2000);
    text("通讯录").findOne().parent().click();
    sleep(2000);
    //text("lvndmarkkk").findOne(2000).parent().parent().click();
    let Wxname = Wxname;
    //text(Wxname).findOne(2000).parent().parent().click();
    let Wxnamebounds = text(Wxname).findOne().bounds();
    click(Wxnamebounds.centerX(), Wxnamebounds.centerY());
    ///
    sleep(2000);
    text("发消息").findOne(2000).parent().click();
    sleep(2000);
    //点进去图片
    function Searchpct(x, y, z, w) {
        let x1 = x, y1 = y, z1 = z, w1 = w;
        descContains("更多功能按钮").findOne().click();
        sleep(2000);
        //text("相册").findOne().parent().click();
        let ptrxy = text("相册").findOne().bounds();
        click(ptrxy.centerX(), ptrxy.centerY());
        sleep(2000);
        click(x, y, z, w);
        sleep(2000);
        text("发送").findOne().click();
    };

    //第一张截图 bounds("(186,221,251,286)")
    Searchpct(186, 221, 251, 286);
    sleep(2000);
    //第二张截图     click(457, 221, 522, 286);
    Searchpct(457, 221, 522, 286);
    sleep(4000);
    //电量
    let NowBatteryValue = device.getBattery().toString();
    input(util.format("打卡成功，请查看截图,当前电量:%%%d", NowBatteryValue));
    sleep(4000);
    text("发送").findOne(2000).click();
    sleep(2000);
    //结束
    back();//返回聊天窗 发消息界面
    sleep(2000);
    back();//返回微信主界面
    sleep(1000);
    home();
};
