---
layout: post
title: "Visualizing Networks with Python and Networkx"
description: ""
category:
tags: []
permalink: /blog/visualizing-networks-with-python-and-networkx/
---

Few days back I had an assignment to visualize a network of people who talk to each other. I needed to find the people who are contacted most. Drawing a network graph seemed like the best way to find it out visually.

So I looked around for tools that could help with it and came across [Networkx](https://networkx.github.io/). They have a nice [documentation](https://networkx.github.io/documentation/latest/overview.html) and a [Lot of examples](https://networkx.github.io/documentation/latest/examples/) on drawing different kinds of graphs. I decided to try it out. Here's how to draw a simple undirected graph with it -

    import networkx as nx
    import matplotlib.pyplot as plt

    def draw_graph(graph):
        # create networkx graph
        G=nx.Graph()

        # add edges
        for edge in graph:
            G.add_edge(edge[0], edge[1])

        # There are graph layouts like shell, spring, spectral and random.
        # Shell layout usually looks better, so we're choosing it.
        # I will show some examples later of other layouts
        graph_pos = nx.shell_layout(G)

        # draw nodes, edges and labels
        nx.draw_networkx_nodes(G, graph_pos, node_size=1000, node_color='blue', alpha=0.3)
        nx.draw_networkx_edges(G, graph_pos)
        nx.draw_networkx_labels(G, graph_pos, font_size=12, font_family='sans-serif')

        # show graph
        plt.show()

    # draw example
    # graph is a list of tuples of nodes. Each tuple defining the
    # connection between 2 nodes
    graph = [(20, 21),(21, 22),(22, 23), (23, 24),(24, 25), (25, 20)]

    draw_graph(graph)

And this is the image that's produced -

![](https://i.imgur.com/RBTArHs.png)

We can try adding some more edges and see how it looks. E.g. -

    graph = [
        (20, 21), (21, 22), (22, 23), (23, 24), (24, 25), (25, 20),
        (25, 21), (23, 20), (24, 22)
    ]

This generates -

![](https://i.imgur.com/Xqrlmlh.png)

Neat!

Directed Graph
---

But the above graph is undirected. I needed directed to know which node is receiving more connections from others. Then I found out that Networkx has a Graph class called DiGraph, which can be used to draw directed graphs. Let's try that -

    def draw_graph(graph):
        # create directed networkx graph
        G=nx.DiGraph()

        # add edges
        G.add_edges_from(graph)

        graph_pos = nx.shell_layout(G)

        # draw nodes, edges and labels
        nx.draw_networkx_nodes(G, graph_pos, node_size=1000, node_color='blue', alpha=0.3)
        # we can now added edge thickness and edge color
        nx.draw_networkx_edges(G, graph_pos, width=2, alpha=0.3, edge_color='green')
        nx.draw_networkx_labels(G, graph_pos, font_size=12, font_family='sans-serif')

        # show graph
        plt.show()

    # we can add more edges here as the direction is a factor now,
    # edges are added as (from_node, to_node) tuples
    # hence (22, 25) and (25, 22) are different. In undirected graph,
    # we couldn't have told the difference.
    graph = graph = [
            (20, 21), (21, 22), (22, 23), (23, 24), (24, 25), (25, 20),
            (25, 21), (23, 20), (24, 22), (21, 24), (20, 21)
        ]
    draw_graph(graph)

This generates -

![](https://i.imgur.com/w74fl2J.png)

That works great! But we're still missing one thing, a label for the edge.

    labels = range(len(graph))
    # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    edge_labels = dict(zip(graph, labels))
    # {(23, 20): 7, (22, 23): 2, (20, 21): 10, (24, 25): 4, (21, 22): 1, (25, 20): 5, (24, 22): 8, (25, 21): 6, (23, 24): 3, (21, 24): 9}

    nx.draw_networkx_edge_labels(G, graph_pos, edge_labels=edge_labels)

    # show graph
    plt.show()

Which generates -

![](https://i.imgur.com/k2KZvnz.png)

You can follow the same data structure and add any label you want to the edges.

### Layouts

Now let's try out the other layouts we mentioned -

#### Spring layout

    graph_pos = nx.spring_layout(G)

![](https://i.imgur.com/LqgtZWH.png)

#### Spectral layout

    graph_pos = nx.spectral_layout(G)

![](https://i.imgur.com/zr00Gad.png)

#### Random layout

    graph_pos = nx.random_layout(G)

![](https://i.imgur.com/CVdNbH7.png)

Overall, I am liking Networkx. There are many more types of graphs that can be drawn. Can't wait to try them.
