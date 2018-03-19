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
            "dps" : 1
        },

        {
            "accessory": "TuyaPowerStrip",
            "name": "Porch Fan",
            "description" : "Tuya Power Strip Outlet 2",
            "ip": "192.168.104.8",
            "devId": "0XXXXXXXXXXXXXXXX8",
            "localKey": "2XXXXXXXXXXXXXXX5",
            "dps" : 2
        },

        {
            "accessory": "TuyaPowerStrip",
            "name": "Porch Fan",
            "description" : "Tuya Power Strip Outlet 3",
            "ip": "192.168.104.8",
            "devId": "0XXXXXXXXXXXXXXXX8",
            "localKey": "2XXXXXXXXXXXXXXX5",
            "dps" : 3
        },

        {
            "accessory": "TuyaPowerStrip",
            "name": "Porch Accent Lights",
            "description" : "Tuya Power Strip Outlet 4",
            "ip": "192.168.104.8",
            "devId": "0XXXXXXXXXXXXXXXX8",
            "localKey": "2XXXXXXXXXXXXXXX5",
            "dps" : 4
        },

        {
            "accessory": "TuyaPowerStrip",
            "name": "Power Strip USB",
            "description" : "Tuya Power Strip USB Ports",
            "ip": "192.168.104.8",
            "devId": "0XXXXXXXXXXXXXXXX8",
            "localKey": "2XXXXXXXXXXXXXXX5",
            "dps" : 5
        },

        {
            "accessory": "TuyaPowerStrip",
            "name": "Power Strip Master Switch",
            "description" : "Tuya Power Strip Master Power Button",
            "ip": "192.168.104.8",
            "devId": "0XXXXXXXXXXXXXXXX8",
            "localKey": "2XXXXXXXXXXXXXXX5",
            "dps" : 6
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
            "dps" : 1
        }
    ]


This was originally derived from the [homebridge-tuya-outlet] (https://github.com/codetheweb/homebridge-tuya-outlet) plugin and modified to utilize the 'dps' in the Tuya api for managing multiple devices. 

Carefully read and review the procedures to obtain the Tuya api device ID (hint: it has the MAC address in it) and the localKey. It's quite a procedure, but it's easy once learned: https://github.com/codetheweb/tuyapi/blob/master/docs/SETUP.md

This plugin requires a modified version of the tuyapi that I extended found here: [homebridge-tuyapi-extended](https://github.com/drumfreak/homebridge-tuyapi-extended)

See [tuyapi](https://github.com/codetheweb/tuya-device) for original inspiration.
