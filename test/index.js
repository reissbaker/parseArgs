var parseArgs = require('../index.js');

var fakeEmptyArg = [];
var fakeFullArg = [
  'hello',
  {},
  1,
  2,
  function(){}
];

describe('parseArgs', function() {
  describe('required', function() {
    it('should automatically parse the first argument', function() {
      parseArgs(fakeFullArg)
        .required('hello')
        .end
        .hello.should.equal('hello');
    });

    it('should automatically parse the next objects', function() {
      var args = parseArgs(fakeFullArg)
                  .required('hello')
                  .required('next')
                  .end;
      args.hello.should.equal('hello');
      args.next.should.equal(fakeFullArg[1]);
    });

    it('should not parse arguments that don\'t exist', function() {
      var test = parseArgs(fakeEmptyArg)
        .required('test')
        .end
        .test;
      (typeof test).should.equal('undefined');
    });
  });

  describe('optional', function() {
    it('should parse the first argument if it passes a type check', function() {
      parseArgs(fakeFullArg)
        .optional('hello', 'fail', {type: 'string'})
        .end
        .hello.should.equal('hello');
    });

    it('should assign the default if the argument fails a type check', function() {
      parseArgs(fakeFullArg)
        .optional('hello', 'fail', {type: 'function'})
        .end
        .hello.should.equal('fail');
    });

    it('should parse the argument if it passes an instance check', function() {
      parseArgs(fakeFullArg)
        .required('hello')
        .optional('obj', 'fail', {instance: Object})
        .end
        .obj.should.equal(fakeFullArg[1]);
    });

    it('should assign the default if the argument fails an instance check', function() {
      parseArgs(fakeFullArg)
        .required('hello')
        .optional('obj', {}, {instance: String})
        .end
        .obj.should.not.equal(fakeFullArg[1]);
    });

    it('should parse the first argument if it passes an arbitrary check function', function() {
      parseArgs(fakeFullArg)
        .optional('hello', 'fail', function(arg) { if(arg === 'hello') return true; return false;})
        .end
        .hello.should.equal('hello');
    });

    it('should assign the default if the argument fails an arbitrary check function', function() {
      parseArgs(fakeFullArg)
        .optional('hello', 'fail', function() { return false; })
        .end
        .hello.should.equal('fail');
    });
  });

  describe('many', function() {
    it('should parse multiple repeating arguments that pass the test', function() {
      parseArgs(fakeFullArg)
        .required('hello')
        .required('obj')
        .many('num', {type: 'number'})
        .end
        .num.should.eql([1, 2]);
    });

    it('should assign an empty array if no arguments pass the test', function() {
      parseArgs(fakeFullArg)
        .required('hello')
        .required('obj')
        .many('string', {type: 'string'})
        .end
        .string.should.eql([]);
    });

    it('should stop parsing as soon as the first element fails', function() {
      parseArgs(fakeFullArg)
        .required('hello')
        .required('obj')
        .required('num')
        .many('string', {type: 'string'})
        .end
        .string.should.eql([]);
    });

    it('should allow args following it to be parsed', function() {
      parseArgs(fakeFullArg)
        .required('hello')
        .required('obj')
        .many('nums', {type: 'number'})
        .optional('callback', 'fail', {type: 'function'})
        .end
        .callback.should.equal(fakeFullArg[4]);
    });
  });
});