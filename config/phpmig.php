<?php

use \Phpmig\Adapter,
    \Pimple,
    \Illuminate\Database\Capsule\Manager as Capsule;

$container = new Pimple();

$container['config'] = json_decode(file_get_contents('db.json'), TRUE);

$container['schema'] = $container->share(function($container) {
    /* Bootstrap Eloquent */
    $capsule = new Capsule;
    $capsule->addConnection($container['config']);
    $capsule->setAsGlobal();
    /* Bootstrap end */

    return Capsule::schema();
});

$container['phpmig.adapter'] = $container->share(function() use ($container) {
    $capsule = new Capsule;
    $capsule->addConnection($container['config']);
    $capsule->setAsGlobal();
    return new Adapter\Illuminate\Database($capsule, 'migrations');
});

$container['phpmig.migrations_path'] = __DIR__ . DIRECTORY_SEPARATOR . 'migrations';

return $container;
