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
  this.outletServices = [];

  if (config.ip != undefined) {
    debug('Tuya Power Strip Outlet ' + this.dps + ' Ip is defined as ' + config.ip);
    this.tuyastrip = new tuya({type: 'outlet', ip: config.ip, id: config.devId, key: config.localKey});
  } else {
    debug('Tuya Power Strip Outlet ' + config.dps + ' ' + this.name + ' IP is undefined, resolving Ids and this usually does not work, so set a static IP for your powerstrip and add it to the config...');
    this.tuyastrip = new tuya({type: 'outlet', id: config.devId, key: config.localKey});
    this.tuyastrip.resolveIds();
  }

  // Setup the HAP service
  this._service = new Service.Outlet(this.name);
  this._service.getCharacteristic(Characteristic.On).on('set', this._setOn.bind(this));
  this._service.getCharacteristic(Characteristic.On).on('get', this._get.bind(this));
  this.outletServices.push(this._service);
  //debug(this.tuyastrip);
}

TuyaPowerStrip.prototype._setOn = function(on, callback) {
  this.tuyastrip.set({'id': this.devId, set: on, 'dps' : this.dps}).then(() => {
    debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TUYA SET OUTLET  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    debug('Setting ' + this.name + ' dps: ' + this.dps + ' device to: ' + on);
    debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END TUYA SET OUTLET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    return callback(null, on);
  }).catch(error => {
    debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TUYA SET OUTLET ERROR ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    debug('Got Tuya device error for ' + this.name + ' dps: ' + this.dps);
    debug(error);
    debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END TUYA SET OUTLET ERROR ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    return callback(error, null);
  });
}

TuyaPowerStrip.prototype._get = function(callback) {
  this.tuyastrip.get({schema: true}).then(status => {
    debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TUYA STATUS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    debug('Getting Tuya device status for ' + this.name + ' dps: ' + this.dps);
    debug(status.dps);
    debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END TUYA STATUS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    return callback(null, status.dps[this.dps]);
  }).catch(error => {
    debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TUYA GET OUTLET ERROR ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    debug('Got Tuya device error for ' + this.name + ' dps: ' + this.dps);
    debug(error);
    debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END TUYA GET OUTLET ERROR ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    return callback(error, null);
  });
}

TuyaPowerStrip.prototype.getServices = function() {
  return this.outletServices;
}

TuyaPowerStrip.prototype.identify = function (callback) {
  debug(_this.config.name + " was identified.");
  callback();
};
