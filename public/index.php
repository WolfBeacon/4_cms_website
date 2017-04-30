<?php

require '../vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$capsule->addConnection(json_decode(file_get_contents('../db.json'), TRUE));

$config = json_decode(file_get_contents('../config.json'), TRUE);

// Set the event dispatcher used by Eloquent models... (optional)
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
$capsule->setEventDispatcher(new Dispatcher(new Container));

// Make this Capsule instance available globally via static methods... (optional)
$capsule->setAsGlobal();

// Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
$capsule->bootEloquent();

$app = new \Slim\Slim(array(
    'debug' => true
));
$app->get('/', function() use ($app) {
    readfile('index.html');
    $app->stop();
});

// Generate a V4 UUID
function gen_uuid_v4() {
    return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        // 32 bits for "time_low"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

        // 16 bits for "time_mid"
        mt_rand( 0, 0xffff ),

        // 16 bits for "time_hi_and_version",
        // four most significant bits holds version number 4
        mt_rand( 0, 0x0fff ) | 0x4000,

        // 16 bits, 8 bits for "clk_seq_hi_res",
        // 8 bits for "clk_seq_low",
        // two most significant bits holds zero and one for variant DCE1.1
        mt_rand( 0, 0x3fff ) | 0x8000,

        // 48 bits for "node"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
}

$app->post('/api/submitHackathon', function() use($app, $config) {
    $obj = json_decode($app->request->getBody(), TRUE);

    // Validation


    // Create object (do not save yet)
    $hackathon = new Hackathon;
    $hackathon->uuid = gen_uuid_v4();
    $hackathon->data = json_encode($obj);
    $hackathon->save();

    try {
        // POST to server
        $client = new GuzzleHttp\Client();
        // Create a POST request
        $res = $client->request(
            'POST',
            $config['hackathonUrl'],
            [
                'id' => $hackathon->id,
                'uuid' => $hackathon->uuid,
                'data' => $hackathon->data
            ]
        );

        // Respond
        if ($res->getStatusCode() >= 200 && $res->getStatusCode() < 300) {
            echo "OK";
            $app->stop();    
        } else {
            throw new Exception("Invalid request.");
        }
    } catch (Exception $e) {
        $hackathon->delete();
        echo "Error";
    }
});

/*
$app->get('/wolfbeacon-cms/hackathons/:id', function($id) use($app) {
    $hackathon = Hackathon::find($id);
    if (is_null($hackathon)) {
        $app->response->setStatus(404);
        $app->stop();
    }
    echo $hackathon->toJson();    
});

$app->get('/wolfbeacon-cms/hackathons', function() {
    $hackathons = Hackathon::all();
    echo $hackathons->toJson();
});

$app->put('/wolfbeacon-cms/hackathons/:id', function($id) use($app) {
    $body = $app->request->getBody();
    $obj = json_decode($body);
    $hackathon = Hackathon::find($id);
    if (is_null($hackathon)) {
        $app->response->setStatus(404);
        $app->stop();
    }
    
    $hackathon->id = $obj->{'id'};
    $hackathon->uuid = $obj->{'uuid'};
    $hackathon->data = $obj->{'data'};
    $hackathon->save();
    echo $hackathon->toJson();    
});

$app->delete('/wolfbeacon-cms/hackathons/:id', function($id) use($app) {
    $hackathon = Hackathon::find($id);
    if (is_null($hackathon)) {
        $app->response->setStatus(404);
        $app->stop();
    }
    $hackathon->delete();
    $app->response->setStatus(204);
});*/


$app->error(function(Exception $e) use ($app) {
    $app->response()->status(400);
});

$app->run();
