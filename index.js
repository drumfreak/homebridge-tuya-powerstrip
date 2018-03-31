"use strict";

const tuya = require('homebridge-tuyapi-extended');

var Accessory, 
    Service, 
    Characteristic, 
    UUIDGen;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-tuya-powerstrip", "TuyaPowerStrip", TuyaPowerStrip);
}

function TuyaPowerStrip(log, config) {
  this.log = log;
  this.name = config.name;
  this.config = config;
  this.debugPrefix = config.debugPrefix || '~~~   ';
  const debug = require('debug')('[Tuya Powerstrip - ' + this.name + ']  ');

  this.log.prefix = 'Tuya Powerstrip - ' + this.name;
  this.debugging = config.debug || false;
  this.deviceEnabled = (typeof config.deviceEnabled === 'undefined') ? true : config.deviceEnabled;

  this.dps = (config.dps === undefined) ? 1 : config.dps;
  this.devId = config.devId;
  this.powerState = false;

  this.refreshInterval = (config.refreshInterval !== undefined) ? config.refreshInterval : 60;  // Seconds

  this.apiMinTimeout = (config.apiMinTimeout === undefined) ? 100 : config.apiMinTimeout;
  this.apiMaxTimeout = (config.apiMaxTimeout  === undefined) ? 2000 : config.apiMaxTimeout;
  this.apiRetries = (config.apiRetries === undefined) ? 1 : config.apiRetries;
  this.apiDebug = config.apiDebug || false;

  if (config.ip != undefined  && this.deviceEnabled === true) {
    this.tuyaDebug('Tuya Powerstrip Outlet ' + this.dps + ' Ip is defined as ' + config.ip);
    this.tuyastrip = new tuya({type: 'outlet', ip: config.ip, id: config.devId, key: config.localKey, name: this.name, apiRetries: this.apiRetries, apiMinTimeout: this.apiMinTimeout, apiMaxTimeout: this.apiMaxTimeout, apiDebug: this.apiDebug, apiDebugPrefix: this.debugPrefix});
  } else if(this.deviceEnabled === true) {
    this.tuyaDebug('Tuya Powerstrip Outlet ' + this.dps + ' ' + this.name + ' IP is undefined, resolving Ids and this usually does not work, so set a static IP for your powerstrip and add it to the config...');
    this.tuyastrip = new tuya({type: 'outlet', id: config.devId, key: config.localKey, name: this.name, apiRetries: this.apiRetries, apiMinTimeout: this.apiMinTimeout, apiMaxTimeout: this.apiMaxTimeout, apiDebug: this.apiDebug, apiDebugPrefix: this.debugPrefix});
    this.tuyastrip.resolveIds();
  }

  if(this.debugging && this.apiDebug && this.deviceEnabled === true) {
    this.tuyaDebug('Tuya API Settings - Retries: ' + this.apiRetries + ' Debug: ' + this.apiDebug + ' Min Timeout: ' + this.apiMinTimeout + ' Max Timeout: ' + this.apiMaxTimeout, this.log);
  }

  setInterval(this.devicePolling.bind(this), this.refreshInterval * 1000);
}



TuyaPowerStrip.prototype.getOn = function(callback) {

  if(this.deviceEnabled === false) {
    this.log.warn('Device is disabled... Bailing out... ');
    return callback('Disabled');
  }

  this.tuyastrip.get(this, {schema: true}).then(status => {
    if(this.debugging) {
      this.tuyaDebug('TUYA STATUS ' + this.debugPrefix);
      this.tuyaDebug('Getting Tuya device status for ' + this.name + ' dps: ' + this.dps);
      this.tuyaDebug('Power state is: ' + this.dps + ' is ' + status.dps[this.dps]);
      this.tuyaDebug('END TUYA STATUS ' + this.debugPrefix);
    } else {
      this.log.info('Retrieved outlet power status as: ' + status.dps[this.dps]);
    }
    this.powerState =  status.dps[this.dps];
    return callback(null, status.dps[this.dps]);
  }).catch(error => {
    if(this.debugging) {
      this.tuyaDebug('TUYA GET OUTLET ERROR ' + this.debugPrefix);
      this.tuyaDebug('Got Tuya device error for ' + this.name + ' dps: ' + this.dps);
      this.tuyaDebug(error.message);
      this.tuyaDebug('END TUYA GET OUTLET ERROR ' + this.debugPrefix);
    } else {
      this.log.warn(error.message);
    }
    this.powerState = false;
    return callback(error, null);
  });
}

TuyaPowerStrip.prototype.setOn = function(on, callback) {
  if(this.deviceEnabled === false) {
    this.log.warn('Device is disabled... Bailing out...');
    return callback('Disabled');
  }

  var dpsTmp = {};
  dpsTmp[this.dps.toString()] = on;

  // TODO: Skip if the light is already on...
  this.tuyastrip.set(this, {'id': this.devId, 'dps' : dpsTmp}).then(result => {
    if(this.debugging) {
      this.tuyaDebug('TUYA SET OUTLET ' + this.debugPrefix);
      this.tuyaDebug('Setting ' + this.name + ' dps: ' + this.dps + ' device to: ' + on);
      this.tuyaDebug('END TUYA SET OUTLET ' + this.debugPrefix);
    } else {
      this.log('Outlet Power set to: ' + on);
    }
    this.powerState = on;
    return callback(null, on);
  }).catch(error => {
    if(this.debugging) {
      this.tuyaDebug('TUYA SET OUTLET ERROR ' + this.debugPrefix);
      this.tuyaDebug('Got Tuya device error for ' + this.name + ' dps: ' + this.dps);
      this.tuyaDebug(error.message);
      this.tuyaDebug('END TUYA SET OUTLET ERROR ' + this.debugPrefix);
    } else {
      this.log.warn(error.message);
    }
    this.powerState = false;
    return callback(error, null);
  });
}


// MARK: - Polling

TuyaPowerStrip.prototype.devicePolling = function() {

  this.log('Polling at interval... ' + this.refreshInterval + ' seconds');

  this.getOn(function(error, result) {
    if(error) {
      this.tuyaDebug('Error getting outlet status');
    }
  }.bind(this));

  if(this.config.superDebug) {
    this.tuyaDebug(JSON.stringify(this, null, 8));
  }

};



TuyaPowerStrip.prototype.getServices = function() {
  this.devicePolling();

   // Setup the HAP service
  this.tuyaDebug('Calling getServices()');

  var informationService = new Service.AccessoryInformation();

  informationService
        .setCharacteristic(Characteristic.Manufacturer, 'Tuya - github@drumfreak')
        .setCharacteristic(Characteristic.Model, 'Power Device')
        .setCharacteristic(Characteristic.SerialNumber, this.devId);

  var outletService = new Service.Outlet(this.name);

  outletService.getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));

  return [informationService, outletService];
}



TuyaPowerStrip.prototype.tuyaDebug = function(args) {
  if(this.debugging === true) {
      this.log.debug(this.debugPrefix, args);
  }
};

TuyaPowerStrip.prototype.identify = function (callback) {
  this.tuyaDebug(this.name + " was identified.");
  callback();
};
