---
id: quick-start
title: Quick Start（Web）
slug: quick-start
order: 1
---

OpenSumi is based on Node.js version `12.x +` and you need to make sure you have the correct version of Node.js installed locally. Also, OpenSumi relies on a number of Node.js Addons. To ensure that these Addons are compiled properly, it is recommended that you refer to the installation guide in [node-gyp](https://github.com/nodejs/node-gyp#installation) to set up your local environment.

![preview](https://img.alicdn.com/imgextra/i3/O1CN01uIRRRl1wmLkN9geV3_!!6000000006350-2-tps-2844-1830.png)

## Local Launch

> **Note: Since there are a lot of packages to download during the compiling process, and some of them require access to GitHub to download the source code, please keep your access to GitHub open. Many 404 Not Found issues are caused by network access failures.**

Run the following commands in sequence:

```bash
$ git clone git@github.com:opensumi/ide-startup.git
$ cd ide-startup
$ yarn					   # install dependency
$ yarn start		       # side-by-side Start the front end and back end in parallel
```

Open the browser  `http://127.0.0.1:8080` for preview or development.  

## Use Docker Image 

```bash
# Pull the image  
docker pull ghcr.io/opensumi/opensumi-web:latest

# run
docker run --rm -d  -p 8080:8000/tcp ghcr.io/opensumi/opensumi-web:latest
```

Open the browser `http://127.0.0.1:8080`for preview or development.  

## Start the Parameters:

The integration code in Startup is relatively simple, basically instantiating `ClientApp` and `ServerApp` respectively, inputing the appropriate parameters and starting it. The following lists some of the core startup parameters.  

For detailed startup parameters, see[integrated configuration](../universal-integrate-case/custom-config) document.  

## Custom IDE

OpenSumi supports customization of interface themes, built-in commands, menus, and other basic capabilities by means of modules. You can view more detailed customization content at:

- [Integration configuration](../universal-integrate-case/custom-config)
- [Custom Comand](../universal-integrate-case/custom-command)
- [Custom Config](../universal-integrate-case/custom-config)
- [Custom view](../universal-integrate-case/custom-view)
