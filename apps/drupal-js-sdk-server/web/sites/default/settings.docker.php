<?php

$host = "db";
$port = 3306;
$driver = "mysql";

$databases['default']['default']['database'] = "db";
$databases['default']['default']['username'] = "db";
$databases['default']['default']['password'] = "db";
$databases['default']['default']['host'] = $host;
$databases['default']['default']['port'] = $port;
$databases['default']['default']['driver'] = $driver;

$settings['hash_salt'] = '132eae275a6bd97c89e4a66995fcdabd428217ae196a6c41805b0580c8bc57e7';
// This will ensure the site can only be accessed through the intended host
// names. Additional host patterns can be added for custom configurations.
$settings['trusted_host_patterns'] = ['.*'];// Enable verbose logging for errors.
// https://www.drupal.org/forum/support/post-installation/2018-07-18/enable-drupal-8-backend-errorlogdebugging-mode
$config['system.logging']['error_level'] = 'verbose';
