"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _get = function get(object, property, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

var SassDocError = (function (Error) {
  function SassDocError(message) {
    _get(Object.getPrototypeOf(SassDocError.prototype), "constructor", this).call(this, message);
    this.message = message;
  }

  _inherits(SassDocError, Error);

  _prototypeProperties(SassDocError, null, {
    name: {
      get: function () {
        return "SassDocError";
      },
      enumerable: true,
      configurable: true
    }
  });

  return SassDocError;
})(Error);

exports.SassDocError = SassDocError;
var Warning = (function (SassDocError) {
  function Warning(message) {
    _get(Object.getPrototypeOf(Warning.prototype), "constructor", this).call(this, message);
    this.message = message;
  }

  _inherits(Warning, SassDocError);

  _prototypeProperties(Warning, null, {
    name: {
      get: function () {
        return "Warning";
      },
      enumerable: true,
      configurable: true
    }
  });

  return Warning;
})(SassDocError);

exports.Warning = Warning;