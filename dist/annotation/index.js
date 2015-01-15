"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var annotations = require("./annotations");

var AnnotationsApi = (function () {
  function AnnotationsApi(env) {
    this.env = env;

    this.list = {
      _: { alias: {} } };

    this.addAnnotations(annotations);
  }

  _prototypeProperties(AnnotationsApi, null, {
    addAnnotation: {

      /**
       * Add a single annotation by name
       * @param {String} name - Name of the annotation
       * @param {Object} annotation - Annotation object
       */
      value: function addAnnotation(name, annotation) {
        var _this = this;
        annotation = annotation(this.env);

        this.list._.alias[name] = name;

        if (Array.isArray(annotation.alias)) {
          annotation.alias.forEach(function (aliasName) {
            _this.list._.alias[aliasName] = name;
          });
        }

        this.list[name] = annotation;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    addAnnotations: {

      /**
       * Add an array of annotations. The name of the annotations must be
       * in the `name` key of the annotation.
       * @param {Array} annotations - Annotation objects
       */
      value: function addAnnotations(annotations) {
        var _this2 = this;
        if (annotations !== undefined) {
          annotations.forEach(function (annotation) {
            _this2.addAnnotation(annotation().name, annotation);
          });
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return AnnotationsApi;
})();

module.exports = AnnotationsApi;