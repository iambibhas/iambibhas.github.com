$(function(){
    if($('#terminal')[0] !== undefined)
        $('#prompt').css('width', $('#terminal')[0].clientWidth);

    var Command = Backbone.Model.extend({
        defaults: function() {
            return {
                name: 'help',
                text: 'Welcome to my website.'
            };
        },
        initialize: function() {
            if (!this.get("name")) {
                this.set({"name": this.defaults().name});
            }
            if (!this.get("text")) {
                this.set({"text": this.defaults().text});
            }
        }
    });

    var Input = Backbone.Model.extend({
        defaults: function() {
            return {
                name: 'help',
                text: 'Welcome to my website.'
            };
        },
        initialize: function() {
            if (!this.get("name")) {
                this.set({"name": this.defaults().name});
            }
        }
    });

    var InputView = Backbone.View.extend({
        tagName: 'div',
        template: _.template($('#input-entered').html()),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var AppView = Backbone.View.extend({
        el: $("#app"),
        initialize: function() {
            this.input = this.$('#prompt');
        },
        events: {
            "keyup #prompt": "getOutput"
        },
        commands: {
            'help': 'I\'m currently moving my site from raw JS to Backbone.js. So few stuffs are missing. Sorry for the trouble. :( You can click the `posts` link on the sidebar and read my blog posts. :)'
        },
        history: [],
        getOutput: function(e) {
            if (e.keyCode == 13) {
                var view;
                var inp = this.input.val();
                var command = this.commands[inp];
                if(command === undefined) {
                    view = new InputView({
                        model: new Input({
                            name: inp,
                            text: 'Command not found'
                        })
                    });
                    this.$("#terminal").append(view.render().el);
                }else{
                    view = new InputView({
                        model: new Input({
                            name: inp,
                            text: this.commands[inp]
                        })
                    });
                    this.$("#terminal").append(view.render().el);
                }
                this.history.push(inp);
                this.input.val('');
            }else if (e.keyCode == 38) {
                var lastInput = this.history.pop();
                this.input.val(lastInput);
            }
            $('#terminal').scrollTop(99999);
        }
    });

    var App = new AppView;
});