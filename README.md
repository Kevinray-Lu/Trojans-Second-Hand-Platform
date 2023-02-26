<img src="https://github.com/Kevinray-Lu/Trojans-Second-Hand-Platform/blob/main/publicAssets/logo-1024x1024.png" style="width:25%">

# Trojans Online Resource Exchange Platform

[Trojans Online Resource Exchange Platform](https://trojan2hp.uw.r.appspot.com/) is a web application designed to promote convenience on USC campus-wise second-hand product information sharing. It allows users to post and view second-hand items, manage their items, and track their status. It also provides useful USC links and a friendly user interface.

## Table of Contents

- [Trojans Online Resource Exchange Platform](#trojans-online-resource-exchange-platform)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Online Access & usage](#online-access-&-usage)
  - [Files](#files)
  - [License](#license)

## Features

- User validation (login/register)
- Item posting/viewing (with pictures and descriptions)
- Item management (repost/delete)
- Item tracking (status)
- Useful USC links
- Friendly user interface (self-designed web icon, welcome page, clear directions, etc.)

## Online Access & usage

1. Access the web application at [Offical Website](https://trojan2hp.uw.r.appspot.com/)

2. Usage:
- This app is not supposed to run without a local .env file for db connection. This is to protect online data access security.

## Files

- `app.js`: main backend file, skeleton code for all functional pages (e.g. buy/sell, etc), stores and validates session data.
- `auth.js`: file for user validation, interacts with app.js for checking registration and login credentials. Password hashing included for security.
- `db.js`: file for managing MongoDB database, interacts with app.js to send and store data with predefined data structures. Connects with online database with .env file.
- `views/*`: main frontend files, including .hbs file for every page for the platform, interacts with app.js for data ingestion and data output.
- `public/css/*`: file for styling the frontend


## License

This project is licensed under the MIT License - All rights reserved Trojans Second Hand Trading
