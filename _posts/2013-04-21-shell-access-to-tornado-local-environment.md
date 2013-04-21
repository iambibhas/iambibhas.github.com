---
layout: post
title: "Shell Access to Tornado Local Environment"
description: ""
category: 
tags: []
permalink: /blog/shell-access-to-tornado-local-environment/
---
I've been working on [Tornado](http://www.tornadoweb.org/en/stable/) for last few days and I really needed a shell access to the local virtual environment of my Tornado app so that I can test few things out. Exactly like Django has `./manage.py shell`. But as we all know Tornado lacks a good documentation. Most of the things except the use of the native classes, require a lot of trial and error(at least for me, I'm not so bright). So I looked around and found how [Flask](http://flask.pocoo.org/) [has a way](http://flask.pocoo.org/snippets/23/) of having an interactive shell access to the environment. And I just replicated it.

Create a file called `shell.py`(or whatever you like) on the root of your project and put these codes in it - 

    #!/usr/bin/env python

    import os
    import readline
    from pprint import pprint

    # Your app file
    from app import * 

    # These project specific. But I need these to run my project
    from config import *
    from settings import *

    # This is the main part
    os.environ['PYTHONINSPECT'] = 'True'

From Python documentation - 

> PYTHONINSPECT  
> If this is set to a non-empty string it is equivalent to specifying the `-i` option.  
> This variable can also be modified by Python code using os.environ to force inspect mode on program termination.

And the `-i` option - 

> -i  
> When a script is passed as first argument or the -c option is used, enter interactive mode after executing the script or the command, even when sys.stdin does not appear to be a terminal. The PYTHONSTARTUP file is not read.  
> This can be useful to inspect global variables or a stack trace when a script raises an exception.