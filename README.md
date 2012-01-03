parseArgs
=========

A fluent Javascript DSL for parsing the arguments object. Allows for simple, concise
optional arguments and repeating numbers of arguments.

Replace your if-else statements today!

Example
-------

```javascript
var updateOrder = function() {
  var args = parseArgs(arguments)
              .required('name')
              .optional('discountCode', -1, {type: 'number'})
              .optional('referrer', null, {instance: User})
              .required('address')
              .end
  
  $('#orderField').text(
    'Name: ' + args.name + ', discount code: ' + args.discountCode +
    ', referrer: ' + args.referrer + ', address: ' + args.address
  );
}
```

API
---

To start the chain, call `parseArgs(arguments)`, with the `arguments` keyword literally
being passed into the function. You can then continue the chain with the following
methods:

* `required(name)`, where `name` is the name of the argument.
* `optional(name, defaultValue, checker)`, where `name` is the name of the argument,
`defaultValue` is a default value to assign to the argument if nothing gets passed in,
and `check` is either an object with a `type` or `instance` field or a function. If `check`
is an object, the optional argument will have its type checked against the string set in
the `type` field (if provided), and check whether it's an instance of the class set
in the `instance` field (if provided). If it's a function, the function should be of the form
`function(arg, index, args)`, where `arg` is the current argument being checked, `index` is
the index of that argument in the total number of arguments, and `args` the argument object
provided as an Array. If the function returns true, the argument will be considered to have
been passed in and the default value will not be set; if it returns false, the default value
will be set.
* `many(name, checker)`, where `name` is the name of the argument, and `checker` is the same
as the `checker` above. Stores the passed-in values in an array; if none are passed in, the
array will be empty.

Once the chain is done, just access the chain's `end` property to finish it off. The parsed
arguments will be stored in the returned object using the names given to each of the argument
parsing calls.