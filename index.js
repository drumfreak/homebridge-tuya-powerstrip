const tuya = require('homebridge-tuyapi-extended');
const debug = require('debug')('[Homebridge Tuya Powerstrip]  ');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-tuya-powerstrip", "TuyaPowerStrip", TuyaPowerStrip);
}

function TuyaPowerStrip(log, config) {
  this.log = log;
  this.name = config.name;
  this.dps = config.dps || 1;
  this.devId = config.devId;
  this.debugPrefix = config.debugPrefix || '~~~~~~~~~~~~~~~~~~~~~~~~~~ TUYA Power: ';
  this.debugPrefix += this.name + '   ';
  this.log.prefix = 'Homebridge Tuya Powerstrip';
  this.debug = config.debug || false;

  if (config.ip != undefined) {
    this.debugger(' Tuya Power Strip Outlet ' + this.dps + ' Ip is defined as ' + config.ip);
    this.tuyastrip = new tuya({type: 'outlet', ip: config.ip, id: config.devId, key: config.localKey});
  } else {
    this.debugger(' Tuya Power Strip Outlet ' + this.dps + ' ' + this.name + ' IP is undefined, resolving Ids and this usually does not work, so set a static IP for your powerstrip and add it to the config...');
    this.tuyastrip = new tuya({type: 'outlet', id: config.devId, key: config.localKey});
    this.tuyastrip.resolveIds();
  }

   // Setup the HAP service

  this.informationService = new Service.AccessoryInformation();

  this.informationService
        .setCharacteristic(Characteristic.Manufacturer, 'Tuya - github@drumfreak')
        .setCharacteristic(Characteristic.Model, 'Power Device')
        .setCharacteristic(Characteristic.SerialNumber, this.devId);

  this.outletService = new Service.Outlet(this.name);
  this.outletService.getCharacteristic(Characteristic.On)
        .on('set', this._setOn.bind(this))
        .on('get', this._getOn.bind(this));
}

TuyaPowerStrip.prototype._updateOutlet = function() {
  this._getOn(function(error, results) {
    this.debugger(' OUTLET ON STATUS IS: ' + results);
    this.outletService.characteristics[1].value = results;
    // TODO: how the fuck do you update the homekit Characteristic.on app from here?
  }.bind(this));
};

TuyaPowerStrip.prototype._setOn = function(on, callback) {
  this.tuyastrip.set({'id': this.devId, set: on, 'dps' : this.dps}).then(() => {
    this.debugger(' TUYA SET OUTLET ' + this.debugPrefix);
    this.debugger(' Setting ' + this.name + ' dps: ' + this.dps + ' device to: ' + on);
    this.debugger(' END TUYA SET OUTLET ' + this.debugPrefix);
    return callback(null, on);
  }).catch(error => {
    this.debugger(' TUYA SET OUTLET ERROR ' + this.debugPrefix);
    this.debugger(' Got Tuya device error for ' + this.name + ' dps: ' + this.dps);
    this.debugger(error);
    this.debugger(' END TUYA SET OUTLET ERROR ' + this.debugPrefix);
    return callback(error, null);
  });
}

TuyaPowerStrip.prototype._getOn = function(callback) {
  this.tuyastrip.get({schema: true}).then(status => {
    this.debugger(' TUYA STATUS ' + this.debugPrefix);
    this.debugger(' Getting Tuya device status for ' + this.name + ' dps: ' + this.dps);
    this.debugger(' Power state is: ' + status.dps[this.dps]);
    this.debugger(' END TUYA STATUS ' + this.debugPrefix);
    return callback(null, status.dps[this.dps]);
  }).catch(error => {
    this.debugger(' TUYA GET OUTLET ERROR ' + this.debugPrefix);
    this.debugger(' Got Tuya device error for ' + this.name + ' dps: ' + this.dps);
    this.debugger(error);
    this.debugger(' END TUYA GET OUTLET ERROR ' + this.debugPrefix);
    return callback(error, null);
  });
}

TuyaPowerStrip.prototype.getServices = function() {
  return [this.informationService, this.outletService];
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
