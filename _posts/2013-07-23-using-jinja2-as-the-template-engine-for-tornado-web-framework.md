---
layout: post
title: "Using Jinja2 as the Template Engine for Tornado Web Framework"
description: ""
category:
tags: ['tornado', 'jinja2']
permalink: /blog/using-jinja2-as-the-template-engine-for-tornado-web-framework/
---
 - What is Tornado?

From the [documentation](http://www.tornadoweb.org/en/stable/index.html) itself -

> Tornado is a Python web framework and asynchronous networking library, originally developed at FriendFeed. By using non-blocking network I/O, Tornado can scale to tens of thousands of open connections, making it ideal for long polling, WebSockets, and other applications that require a long-lived connection to each user.

It's basically a minimalistic web framework which supports non-blocking network operations. If you go through the [list of modules](http://www.tornadoweb.org/en/stable/documentation.html) it supports, you'll see that it has a lot of modules built in. But there is no proper tutorial of how to achieve most of the things. All the reference to the API is there though. So you must go ahead, read the API and figure out things yourself.

Anyway, I'm not going to write about what is good or bad about it. This post is about how you can replace Tornado's default template engine with Jinja2.

- What is [Jinja2](https://github.com/mitsuhiko/jinja2)?

> Jinja2 is a modern and designer friendly templating language for Python, modelled after Django’s templates. It is fast, widely used and secure with the optional sandboxed template execution environment:

Tornado's native template engine is good and really light-weight. But at the same time it lacks few features I wanted, which Jinja2 has. So I decided to replate tornado's template engine with Jinja2.

To do this, you need to write a base handler which all the other handlers will inherit from. This is what I wrote -

    import os
    import tornado.web
    from jinja2 import Environment, FileSystemLoader, TemplateNotFound


    class TemplateRendering:
        """
        A simple class to hold methods for rendering templates.
        """
        def render_template(self, template_name, **kwargs):
            template_dirs = []
            if self.settings.get('template_path', ''):
                template_dirs.append(
                    self.settings["template_path"]
                )

            env = Environment(loader=FileSystemLoader(template_dirs))

            try:
                template = env.get_template(template_name)
            except TemplateNotFound:
                raise TemplateNotFound(template_name)
            content = template.render(kwargs)
            return content


    class BaseHandler(tornado.web.RequestHandler, TemplateRendering):
        """
        RequestHandler already has a `render()` method. I'm writing another
        method `render2()` and keeping the API almost same.
        """
        def render2(self, template_name, **kwargs):
            """
            This is for making some extra context variables available to
            the template
            """
            kwargs.update({
                'settings': self.settings,
                'STATIC_URL': self.settings.get('static_url_prefix', '/static/'),
                'request': self.request,
                'xsrf_token': self.xsrf_token,
                'xsrf_form_html': self.xsrf_form_html,
            })
            content = self.render_template(template_name, **kwargs)
            self.write(content)

Now to use this base handler, you need to make few things sure that your application settings should have a `template_path` key pointing to the absolute path of the directory holding all the templates.

Now you can inherit this base handler and use jinja2 by default -

    class RegisterHandler(BaseHandler):
        def get(self, **kwargs):
            data = {
                'foo': 'bar'
            }
            return self.render2('auth/register.html', **data)

        def post(self, **kwargs):
            self.check_xsrf_cookie()
            pass

Now you can use the `foo` variable as `{{ "{{ foo " }}}}` in your jinja2 template.

Note: I took some help from [this blog post](http://aurigroup.wordpress.com/2011/02/21/a-good-start-with-google-app-engine-for-python/).
