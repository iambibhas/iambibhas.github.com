---
layout: post
title: "Tornado + WTForms = TypeError: formdata should be a multidict type wrapper ..."
description: ""
category: 
tags: []
permalink: /blog/tornado--wtforms--typeerror-formdata-should-be-a-multidict-type-wrapper/
---
If you're here from some search engine, that means you've been working with Tornado and WTForms, and you've face the same error - 

    (Pdb) form = SomeForm(self.request.arguments)
    *** TypeError: formdata should be a multidict-type wrapper that supports the 'getlist' method

The thing is, Tornado does provide a dictionary that contains the data like a MultiDict should do for GET/POST/others request arguments - 

    {'_xsrf': ['b2c0d0bebbf84516a8aa0462bb41ea0f'], 'password': ['password'], 'email': ['mail@gmail.com']}

But it sends it as a dictionary - 

    (Pdb) type(self.request.arguments)
    <type 'dict'>

And Python dictionaries don't have a `getlist()` method. And WTForms requires the arguments object have that method.

Workaround?

    class SimpleMultiDict(dict):
        def getlist(self, key):
            return self[key]

        def __repr__(self):
            return type(self).__name__ + '(' + dict.__repr__(self) + ')'

This simply makes a subclass of `dict` and adds the `getlist()` method. So, What did we gain?

    (Pdb) SimpleMultiDict(self.request.arguments)
    SimpleMultiDict({'_xsrf': ['b2c0d0bebbf84516a8aa0462bb41ea0f'], 'password': ['password'], 'email': ['mail@gmail.com']})
    (Pdb) arguments = SimpleMultiDict(self.request.arguments)
    (Pdb) dir(arguments)
    ['__class__', '__cmp__', '__contains__', '__delattr__', '__delitem__', '__dict__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__gt__', '__hash__', '__init__', '__iter__', '__le__', '__len__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__setitem__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'clear', 'copy', 'fromkeys', 'get', 'getlist', 'has_key', 'items', 'iteritems', 'iterkeys', 'itervalues', 'keys', 'pop', 'popitem', 'setdefault', 'update', 'values', 'viewitems', 'viewkeys', 'viewvalues']
    
    # Notice the getlist() method

    (Pdb) arguments.getlist('email')
    ['mail@gmail.com']
    (Pdb) form = LoginForm(arguments)
    (Pdb) form.email.data
    'mail@gmail.com'

Now there is a point to note here. Tornado sends the arguments data in a simple dictionary that has the values inside a list. Here is a pointer if you're using some framework that sends a simple dictionary, with the arguments *not* in list, and that also doesn't have a `getlist()` method, just change the `getlist()` method to this -

    class SimpleMultiDict(dict):
        def getlist(self, key):
            return self[key] if type(self[key]) == list else [self[key]]

        def __repr__(self):
            return type(self).__name__ + '(' + dict.__repr__(self) + ')'

This just turns the simgle values to a list, just what `getlist()` is supposed to do.