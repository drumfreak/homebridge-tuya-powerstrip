"use strict";

const tuya = require('homebridge-tuyapi-extended');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-tuya-powerstrip", "TuyaPowerStrip", TuyaPowerStrip);
}

function TuyaPowerStrip(log, config) {
  this.log = log;
  this.name = config.name;
  this.debugPrefix = config.debugPrefix || '~~~   ';
  const debug = require('debug')('[Tuya Powerstrip - ' + this.name + ']  ');

  // this.debugPrefix += this.name + '   ';
  this.log.prefix = 'Tuya Powerstrip - ' + this.name;
  this.debug = config.debug || false;
  this.deviceEnabled = (typeof config.deviceEnabled === 'undefined') ? true : config.deviceEnabled;

  this.dps = (config.dps === undefined) ? 1 : config.dps;
  this.devId = config.devId;

  this.apiMinTimeout = (config.apiMinTimeout === undefined) ? 100 : config.apiMinTimeout;
  this.apiMaxTimeout = (config.apiMaxTimeout  === undefined) ? 2000 : config.apiMaxTimeout;
  this.apiRetries = (config.apiRetries === undefined) ? 1 : config.apiRetries;
  this.apiDebug = config.apiDebug || false;

  if (config.ip != undefined  && this.deviceEnabled === true) {
    this.debugger('Tuya Powerstrip Outlet ' + this.dps + ' Ip is defined as ' + config.ip);
    this.tuyastrip = new tuya({type: 'outlet', ip: config.ip, id: config.devId, key: config.localKey, name: this.name, apiRetries: this.apiRetries, apiMinTimeout: this.apiMinTimeout, apiMaxTimeout: this.apiMaxTimeout, apiDebug: this.apiDebug, apiDebugPrefix: this.debugPrefix}, log);
  } else if(this.deviceEnabled === true) {
    this.debugger('Tuya Powerstrip Outlet ' + this.dps + ' ' + this.name + ' IP is undefined, resolving Ids and this usually does not work, so set a static IP for your powerstrip and add it to the config...');
    this.tuyastrip = new tuya({type: 'outlet', id: config.devId, key: config.localKey, name: this.name, apiRetries: this.apiRetries, apiMinTimeout: this.apiMinTimeout, apiMaxTimeout: this.apiMaxTimeout, apiDebug: this.apiDebug, apiDebugPrefix: this.debugPrefix}, log);
    this.tuyastrip.resolveIds();
  }

  if(this.debug && this.apiDebug && this.deviceEnabled === true) {
    this.debugger('Tuya API Settings - Retries: ' + this.apiRetries + ' Debug: ' + this.apiDebug + ' Min Timeout: ' + this.apiMinTimeout + ' Max Timeout: ' + this.apiMaxTimeout, this.log);
  }

  this.services = this.getServices();

  this.updateOutlet(); // Possible heartbeat later?

}

TuyaPowerStrip.prototype.getServices = function() {

   // Setup the HAP service
  var informationService = new Service.AccessoryInformation();

  informationService
        .setCharacteristic(Characteristic.Manufacturer, 'Tuya - github@drumfreak')
        .setCharacteristic(Characteristic.Model, 'Power Device')
        .setCharacteristic(Characteristic.SerialNumber, this.devId);

  var outletService = new Service.Outlet(this.name);

  outletService.getCharacteristic(Characteristic.On)
        .on('set', this._setOn.bind(this))
        .on('get', this._getOn.bind(this));

  return [informationService, outletService];
}

// Initial update, or an alternative heartbeat of some sort...
TuyaPowerStrip.prototype.updateOutlet = function() {
  this._getOn(function(error, results) {
    if(results) {
      this.services[1].setCharacteristic(Characteristic.On, results); // bool
      if(this.debug) {
        this.debugger('OUTLET ON STATUS IS: ' + results);
        this.debugger('OUTLET Characteristics: ' + JSON.stringify(this.services[1].characteristics, null, 10));
      } else {
        this.log.info('Updated outlet power status to: ' + results);
      }
      return {};
    } else {
      this.services[1].setCharacteristic(Characteristic.On, false); // bool
      return {};
    }
    // TODO: how the fuck do you update the homekit Characteristic.on app from here?
  }.bind(this));
};


TuyaPowerStrip.prototype._getOn = function(callback) {

  if(this.deviceEnabled === false) {
    this.log.warn('Device is disabled... Bailing out... ');
    return callback('Disabled', null);
  }

  this.tuyastrip.get({schema: true}).then(status => {
    if(this.debug) {
      this.debugger('TUYA STATUS ' + this.debugPrefix);
      this.debugger('Getting Tuya device status for ' + this.name + ' dps: ' + this.dps);
      this.debugger('Power state is: ' + status.dps[this.dps]);
      this.debugger('END TUYA STATUS ' + this.debugPrefix);
    } else {
      this.log.info('Retrieved outlet power status as: ' + status.dps[this.dps]);
    }
    return callback(null, status.dps[this.dps]);
  }).catch(error => {
    if(this.debug) {
      this.debugger('TUYA GET OUTLET ERROR ' + this.debugPrefix);
      this.debugger('Got Tuya device error for ' + this.name + ' dps: ' + this.dps);
      this.debugger(error.message);
      this.debugger('END TUYA GET OUTLET ERROR ' + this.debugPrefix);
    } else {
      this.log.warn(error.message);
    }
    return callback(error, null);
  });
}

TuyaPowerStrip.prototype._setOn = function(on, callback) {
  if(this.deviceEnabled === false) {
    this.log.warn('Device is disabled... Bailing out...');
    return callback('Disabled', null);
  }

  this.tuyastrip.set({'id': this.devId, set: on, 'dps' : this.dps}).then(() => {
    if(this.debug) {
      this.debugger('TUYA SET OUTLET ' + this.debugPrefix);
      this.debugger('Setting ' + this.name + ' dps: ' + this.dps + ' device to: ' + on);
      this.debugger('END TUYA SET OUTLET ' + this.debugPrefix);
    } else {
      this.log('Outlet Power set to: ' + on);
    }
    return callback(null, on);
  }).catch(error => {
    if(this.debug) {
      this.debugger('TUYA SET OUTLET ERROR ' + this.debugPrefix);
      this.debugger('Got Tuya device error for ' + this.name + ' dps: ' + this.dps);
      this.debugger(error.message);
      this.debugger('END TUYA SET OUTLET ERROR ' + this.debugPrefix);
    } else {
      this.log.warn(error.message);
    }
    return callback(error, null);
  });
}


TuyaPowerStrip.prototype.debugger = function(args) {
  if(this.debug === true) {
      this.log.debug(this.debugPrefix, args);
  }
};

TuyaPowerStrip.prototype.identify = function (callback) {
  this.debugger(_this.config.name + " was identified.");
  callback();
};
