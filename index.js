/**
 * parseArgs v0.0.1
 * Copyright (C) 2011 Matt Baker
 * http://github.com/reissbaker
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License at <http://www.gnu.org/licenses/> for 
 * details.
 */  


(function() {
  var checkArgument, parseArgs, undef;

  checkArgument = function(arg, index, args, check) {
    var passed = true;
    if(typeof check === 'function') {
      return check(arg, index, args);
    }
    if(check.hasOwnProperty('type'))
      passed = typeof arg === check.type;
    if(check.hasOwnProperty('instance'))
      passed = passed && arg instanceof check.instance;
    
    return passed;
  };

  parseArgs = function(argObject) {
    var nextToParse = 0;
    var argArray = Array.prototype.slice.call(argObject, 0);

    return {
      /**
       * the accessor for the parsed arguments.
       */

      args: {},

      /**
       * declares an optional argument.
       * takes a name, default value, and a checker hash 
       * or function.
       */

      optional: function(name, defaultValue, check) {
        var passed, curr, value;

        curr = argArray[nextToParse];
        value = defaultValue;
        passed = checkArgument(curr, nextToParse, argArray, check);

        if(passed) {
          nextToParse++;
          value = curr;
        }
        
        this.args[name] = value;
        return this;
      },

      /**
       * declares a required argument.
       * takes only a name -- nothing else is needed,
       * since the argument is always there.
       */

      required: function(name) {
        this.args[name] = argArray[nextToParse];
        nextToParse++;
        return this;
      },

      /**
       * declares a series of multiple, optional,
       * repeating arguments.
       * takes a name and a checker hash or function.
       * sets the named argument to an array containing
       * the passed-in arguments.
       */

      many: function(name, check) {
        var passed, curr, values;

        values = [];
        passed = true;

        while(passed && nextToParse < argArray.length) {
          curr = argArray[nextToParse];
          passed = checkArgument(curr, nextToParse, argArray, check);
          if(passed) {
            nextToParse++;
            values.push(curr);
          }
        }
        
        this.args[name] = values;
        return this;
      }
    };
  }; 

  /*
   * Exports
   * =======
   */

  if(exports !== undef && module !== undef && require !== undef) {
    module.exports = parseArgs;
  } else {
    (function() {
      var oldParseArgs = window.parseArgs;
      window.parseArgs = parseArgs;
      parseArgs.noConflict = function() {
        window.parseArgs = oldParseArgs;
        return parseArgs;
      };
    }());
  }
}());