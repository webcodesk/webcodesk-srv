<p align="center">
  <img src="https://raw.githubusercontent.com/webcodesk/webcodesk-srv/master/docs/hero.png" width="70%" alt="Webcodesk Screenshot" />
</p>

## Introduction

Read the article on Hackernoon about why Webcodesk was created:

* [I Developed A Visual Development Tool For Web Applications with React](https://hackernoon.com/i-developed-a-visual-development-tool-for-web-applications-with-react-gmbr3280)

The best way to tell about Webcodesk is to let you try it in action.
So I would recommend you to complete the tutorial in the online version of Webcodesk. 
Click on the link below.

* <a href="https://ide.webcodesk.com/?appDemo=https://wcd-todo-tutorial-demo.web.app/" target="_blank">Start Online Demo</a>

Here you can see the first part of creating a ToDo application in Webcodesk.

* [Timelapse Video](https://youtu.be/5b2MAk95W8s)

## To React developers

Your experience will tell you that you do not need any visual builders because they are limited in functionality, unreliable, and they all suck.

**Give Webcodesk a chance and try to create your own small single-page application, I assure you, you won't ever want to write a ton of extra code.**

* You don't have to learn anything new. Rather, you will not write any unnecessary code for Redux.

* Webcodesk does not generate code. It uses a small framework that is reliable. The proof of reliability is the fact that the framework is used inside Webcodesk itself.

## How it works

Each project for Webcodesk is bootstrapped by create-react-app. 
Additionally, [react-app-framework](https://github.com/webcodesk/react-app-framework), a library designed for Webcodesk, is added to the project code.

The project contains configuration files that are fed to the React App Framework. 
The Framework in its turn creates pages, routes, and makes containers for Redux from simple React components.

Then the Framework connects the containers into chains of actions, exactly as you do it using Redux actions.

The configuration of the Framework is complex enough to write it manually. 
So Webcodesk lets you create and edit it with visual editors:
* the page editor
* the flow diagram editor 

All you have to do is write the code of React components and functions. 

## Installation

* Run commands in the command line one by one.

```
> npx @webcodesk/install-webcodesk <new-project-name-dir>

> cd ./<new-project-name-dir>

> yarn wcd
```

* Open Webcodesk in the browser:

```
http://localhost:7070
```

* Choose any project on the market

* Now open the project's source code in your favorite IDE

> It is better to init a source code repository before you setup the project's workspace in the IDE. 
> For example, please read the instruction about how to do this for GitHub repo:
> [Adding an existing project to GitHub using the command line](https://help.github.com/en/github/importing-your-projects-to-github/adding-an-existing-project-to-github-using-the-command-line)

## Upgrade

* Go to the project dir and run commands in the command line one by one.

```
> yarn remove @webcodesk/webcodesk-srv

> yarn add @webcodesk/webcodesk-srv -D -E

```

## Documentation

In the User Guide, you will find technical details on how to create components and functions and how to use them to build an application.

 * [User Guide](docs/README.md)
 
## Contribution

I'm quite open to new feature requests, or any work you want to do. 
But let's discuss the feature in a new issue with the detailed description before creating new PR.

* [CODE OF CONDUCT](CODE_OF_CONDUCT.md)

## Community

If you need any help or want someone to set up the workspace with you and get you stepping through code in your IDE, 
don't be afraid to speak up!

You can ask questions or talk about Webcodesk at:
* [Spectrum chat](https://spectrum.chat/webcodesk)
* [Facebook group](https://www.facebook.com/groups/webcodesk) 
* [Webcodesk subreddit](https://www.reddit.com/r/webcodesk/).

## License

GNU GPLv3 

Copyright (c) 2019 Alex Pustovalov

* [COPYING](COPYING.txt)
