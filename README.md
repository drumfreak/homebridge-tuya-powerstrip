Tuya Powerstrip Support for Homebridge
===================================

Example `config.json` for power strip with 4 outlets and USB:

    "accessories": [

        {
            "accessory": "TuyaPowerStrip",
            "name": "Rooster Shrine",
            "description" : "Tuya Power Strip Outlet 1",
            "ip": "192.168.104.8",
            "devId": "0XXXXXXXXXXXXXXXX8",
            "localKey": "2XXXXXXXXXXXXXXX5",
            "apiMinTimeout" : 100,
            "apiMaxTimeout" : 1000,
            "apiRetries": 1,
            "apiDebug" : false,
            "refreshInterval" : 120,
            "debugPrefix" : "~~~!~~~ ",
            "debug" : false,
            "deviceEnabled" : true
        },

        {
            "accessory": "TuyaPowerStrip",
            "name": "Porch Fan",
            "description" : "Tuya Power Strip Outlet 2",
            "ip": "192.168.104.8",
            "devId": "0XXXXXXXXXXXXXXXX8",
            "localKey": "2XXXXXXXXXXXXXXX5",
            "dps" : 2,
            "apiMinTimeout" : 100,
            "apiMaxTimeout" : 1000,
            "apiRetries": 1,
            "apiDebug" : false,
            "refreshInterval" : 120,
            "debugPrefix" : "~~~!~~~ ",
            "debug" : false,
            "deviceEnabled" : true
        },

        {
            "accessory": "TuyaPowerStrip",
            "name": "Porch Fan",
            "description" : "Tuya Power Strip Outlet 3",
            "ip": "192.168.104.8",
            "devId": "0XXXXXXXXXXXXXXXX8",
            "localKey": "2XXXXXXXXXXXXXXX5",
            "dps" : 3,
            "apiMinTimeout" : 100,
            "apiMaxTimeout" : 1000,
            "apiRetries": 1,
            "apiDebug" : false,
            "refreshInterval" : 120,
            "debugPrefix" : "~~~!~~~ ",
            "debug" : false,
            "deviceEnabled" : true
        },

        {
            "accessory": "TuyaPowerStrip",
            "name": "Porch Accent Lights",
            "description" : "Tuya Power Strip Outlet 4",
            "ip": "192.168.104.8",
            "devId": "0XXXXXXXXXXXXXXXX8",
            "localKey": "2XXXXXXXXXXXXXXX5",
            "dps" : 4,
            "apiMinTimeout" : 100,
            "apiMaxTimeout" : 1000,
            "apiRetries": 1,
            "apiDebug" : false,
            "refreshInterval" : 120,
            "debugPrefix" : "~~~!~~~ ",
            "debug" : false,
            "deviceEnabled" : true
        },

        {
            "accessory": "TuyaPowerStrip",
            "name": "Power Strip USB",
            "description" : "Tuya Power Strip USB Ports",
            "ip": "192.168.104.8",
            "devId": "0XXXXXXXXXXXXXXXX8",
            "localKey": "2XXXXXXXXXXXXXXX5",
            "dps" : 5,
            "apiMinTimeout" : 100,
            "apiMaxTimeout" : 1000,
            "apiRetries": 1,
            "apiDebug" : false,
            "refreshInterval" : 120,
            "debugPrefix" : "~~~!~~~ ",
            "debug" : false,
            "deviceEnabled" : true
        },

        {
            "accessory": "TuyaPowerStrip",
            "name": "Power Strip Master Switch",
            "description" : "Tuya Power Strip Master Power Button",
            "ip": "192.168.104.8",
            "devId": "0XXXXXXXXXXXXXXXX8",
            "localKey": "2XXXXXXXXXXXXXXX5",
            "dps" : 6,
            "apiMinTimeout" : 100,
            "apiMaxTimeout" : 1000,
            "apiRetries": 1,
            "apiDebug" : false,
            "refreshInterval" : 120,
            "debugPrefix" : "~~~!~~~ ",
            "debug" : false,
            "deviceEnabled" : true
        }
    ]


This plugin also works with single power outlets that are Tuya based.

Example `config.json` for Tuya based single power outlet:

    "accessories": [
        {
            "accessory": "TuyaPowerStrip",
            "name": "Power Outlet",
            "description" : "Single Power Outlet",
            "ip": "192.168.104.9",
            "devId": "0XXXXXXXXXXXXXXXX8",
            "localKey": "2XXXXXXXXXXXXXXX5",
            "dps" : 1,
            "apiMinTimeout" : 100,
            "apiMaxTimeout" : 1000,
            "apiRetries": 1,
            "apiDebug" : false,
            "refreshInterval" : 120,
            "debugPrefix" : "~~~!~~~ ",
            "debug" : false,
            "deviceEnabled" : true
        }
    ]


This was originally derived from the [homebridge-tuya-outlet](https://github.com/codetheweb/homebridge-tuya-outlet) plugin and modified to utilize the 'dps' in the Tuya api for managing multiple devices.

Carefully read and review the procedures to obtain the Tuya api device ID (hint: it has the MAC address in it) and the localKey. It's quite a procedure, but it's easy once learned: [Tuya API Sniffing Procedures](https://github.com/codetheweb/tuyapi/blob/master/docs/SETUP.md)

This plugin requires a modified version of the tuyapi that I extended found here: [homebridge-tuyapi-extended](https://github.com/drumfreak/homebridge-tuyapi-extended)

See [tuyapi](https://github.com/codetheweb/tuya-device) for original inspiration.

Tested on the following power strip (Non affiliated links following:)
* [Tonbux Wifi Smart Surge Protector with 4 USB Charging Ports and 4 Smart AC Outlets](https://www.amazon.com/gp/product/B0779Q3F6L/)

Tested on the following single power outlets:
* [KOYIDA Wifi Smart Switch Mini Receptacle - Intelligent Outlet](https://www.amazon.com/gp/product/B078X93ZC4)

This plugin should work with any power outlets / power strips that can be added to the Tuya Smart app.

Helpful things to note:

1. I found it is best to assign a static IP address through DHCP on my router to each device. Add that IP address to the config file in homebridge when setting up your outlets / strips. The power strips will only have a single LAN IP regardless of how may outlets. A single power outlet will also have a single IP. So each unique physical device should have it's own static ip.  Even though this is not required in the original [tuyapi](https://github.com/codetheweb/tuya-device) and [homebridge-tuya-outlet](https://github.com/codetheweb/homebridge-tuya-outlet), I found that there is a potential hang in homebridge while waiting on the IP address to be obtained. By adding it static, it reduced the wait time and lag when accessing these devices.

2. At this time, until the [homebridge-tuyapi-extended](https://github.com/drumfreak/homebridge-tuyapi-extended) is updated, if you add a device and it is in your config file, but unplugged, this may cause your homebridge to crash or hang. This is being worked out, and a reason for the fork of the original tuyapi.

3. While using power strips, note that the "dps" values for each outlet, and even the master switch of the power strip are required in the config.  You may need to experiment, but you can view the available dps values in the log files when you configure the outlet. If you are using a single outlet, just put "dps" : 1  in your config.  Watch the log files and you'll see the other options for each outlet on your strip.

4. On the Tonbux brand power strip I listed above, my dps values are listed in the config as an example.  In my homebridge, I do not add the master switch because it's easy to turn off the entire power strip.

