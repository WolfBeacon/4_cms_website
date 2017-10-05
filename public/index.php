<?php

require '../vendor/autoload.php';

$CONST = array(
    'LIMIT'  => 500,
    'TARGETS' => array(
        "" => "Target",
        "all" => "All",
        "hackers" => "Hackers",
        "volunteers" => "Volunteers",
        "mentors" => "Mentors"
    ),
    'QUESTIONS' => array(
        "" => "Type",
        "tech" => "Hardware",
        "text"=>  "Short text",
        "textarea" => "Long text",
        "option"=> "Single option",
        "multioption"=> "Multiple option",
        "number"=> "Numeric",
        "date"=> "Single date and time",
        "multidate"=> "Multiple dates and times",
        "file"=> "File upload",
        "phone"=> "Phone number",
        "email"=> "Email address",
        "location"=> "Location",
        "url"=> "URL",
        "school"=> "University or school",
        "policy"=> "Agree to terms"
    ),
);

use Illuminate\Database\Capsule\Manager as Capsule;
use Auth0\SDK\Auth0;

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

// Auth0
$auth0 = new Auth0(json_decode(file_get_contents('../auth.json'), TRUE));

  if( !function_exists('apache_request_headers') ) {

    function apache_request_headers() {
      $arh = array();
      $rx_http = '/\AHTTP_/';
      foreach($_SERVER as $key => $val) {
        if( preg_match($rx_http, $key) ) {
          $arh_key = preg_replace($rx_http, '', $key);
          $rx_matches = array();
          // do some nasty string manipulations to restore the original letter case
          // this should work in most cases
          $rx_matches = explode('_', $arh_key);
          if( count($rx_matches) > 0 and strlen($arh_key) > 2 ) {
            foreach($rx_matches as $ak_key => $ak_val) $rx_matches[$ak_key] = ucfirst($ak_val);
            $arh_key = implode('-', $rx_matches);
          }
          $arh[ucfirst(strtolower($arh_key))] = $val;
        }
      }
      return( $arh );
    }
  }

$app = new \Slim\Slim(array(
    'debug' => true
));
$app->get('/', function() use ($auth0, $app) {
    readfile('index.html');
    $app->stop();
});
$app->get('/login', function() use ($app) {
    readfile('index.html');
    $app->stop();
});
$app->get('/logout', function() use ($app) {
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

function validate($obj, $CONST) {
    if (!array_key_exists("name", $obj) || !array_key_exists("desc", $obj) || !array_key_exists("logo", $obj) || !array_key_exists("type", $obj)
            || !array_key_exists("schoolTitle", $obj) || !array_key_exists("endDate", $obj) || !array_key_exists("startDate", $obj)
            || !array_key_exists("city", $obj) || !array_key_exists("floorplan", $obj) || !array_key_exists("links", $obj) || !array_key_exists("hardware", $obj)
            || !array_key_exists("address", $obj) || !array_key_exists("contact", $obj) || !array_key_exists("prizes", $obj) || !array_key_exists("timetable", $obj)
            || !array_key_exists("travel", $obj) || !array_key_exists("sponsors", $obj) || !array_key_exists("judges", $obj) || !array_key_exists("userData", $obj)
            || !array_key_exists("advancedQuestions", $obj) || !array_key_exists("advanced", $obj) || !array_key_exists("routes", $obj)
            || !array_key_exists("shippingAddress", $obj)) {
        return false;
    }

    if (!is_string($obj['name']) || strlen($obj['name']) < 3 || strlen($obj['name']) > 50) {
        return false;
    }
    if (!is_string($obj['schoolTitle']) || strlen($obj['schoolTitle']) < 3 || strlen($obj['schoolTitle']) > 100) {
        return false;
    }
    if (!is_string($obj['desc']) || strlen($obj['desc']) < 10 || strlen($obj['desc']) > 100) {
        return false;
    }
    if (!is_string($obj['logo']) || strpos($obj['logo'], "http") != 0 || strpos($obj['logo'], "imgur.com") < 0) {
        return false;
    }
    if (!is_array($obj['type'])  || !array_key_exists("university", $obj['type']) || !array_key_exists("company", $obj['type'])
            || !array_key_exists("school", $obj['type']) || !array_key_exists("other", $obj['type'])
            || !is_bool($obj['type']['university']) || !is_bool($obj['type']['school']) || !is_bool($obj['type']['company']) || !is_bool($obj['type']['other'])
            || (!$obj['type']['university'] && !$obj['type']['school'] && !$obj['type']['company'] && !$obj['type']['other'])) {
        return false;
    }
    if (!array_key_exists("hackersSize", $obj) || !is_int($obj['hackersSize']) || $obj['hackersSize'] <= 0) {
        return false;
    }
    if (!array_key_exists("mentorsSize", $obj) || !is_int($obj['mentorsSize']) || $obj['mentorsSize'] <= 0) {
        return false;
    }
    if (!array_key_exists("volunteersSize", $obj) || !is_int($obj['volunteersSize']) || $obj['volunteersSize'] <= 0) {
        return false;
    }
    if (!is_string($obj['contact']) || !filter_var($obj['contact'], FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    if (!is_string($obj['city']) || !is_string($obj['address']) || !is_bool($obj['travel']) || !is_bool($obj['advanced']) || !is_array($obj['floorplan'])
        || !is_string($obj['startDate']) || !is_string($obj['endDate']) || !is_array($obj['links']) || count($obj['links']) != 8 || !is_array($obj['userData'])) {
        return false;
    }
    if (!is_array($obj['judges']) || count($obj['judges']) > $CONST['LIMIT'] || count($obj['judges']) < 1
        || !is_array($obj['sponsors']) || count($obj['sponsors']) > $CONST['LIMIT'] || count($obj['sponsors']) < 1
        || !is_array($obj['prizes']) || count($obj['prizes']) > $CONST['LIMIT'] || count($obj['prizes']) < 1
        || !is_array($obj['hardware']) || count($obj['hardware']) > $CONST['LIMIT'] || count($obj['hardware']) < 1
        || !is_array($obj['timetable']) || count($obj['timetable']) > $CONST['LIMIT'] || count($obj['timetable']) < 1
        || !is_array($obj['routes']) || count($obj['routes']) > $CONST['LIMIT'] || count($obj['routes']) < 1
        || !is_array($obj['advancedQuestions']) || count($obj['advancedQuestions']) > $CONST['LIMIT'] || count($obj['advancedQuestions']) < 1) {
        return false;
    }

    foreach($obj['floorplan'] as $plan) {
        if (!is_string($plan) || strpos($plan, "http") != 0 || strpos($plan, "imgur.com") < 0) {
            return false;
        }
    }

    foreach($obj['links'] as $plan) {
        if (!is_array($plan) || !array_key_exists("required", $plan) || !is_bool($plan['required'])
                || !array_key_exists("value", $plan) || !is_string($plan['value'])  || ($plan['required'] && strlen($plan['value']) == 0)) {
            return false;
        }
    }
    $obj['links'] =  array_filter($obj['links'], function ($v) {
        return strlen($v['value']) > 0;
    });

    foreach($obj['prizes'] as $plan) {
        if (!is_array($plan) || !array_key_exists("winners", $plan) || !is_int($plan['winners']) || $plan['winners'] < 1
                || !array_key_exists("value", $plan)|| !is_int($plan['value']) || $plan['value'] < 0
                || !array_key_exists("name", $plan) || !is_string($plan['name'])
                || !array_key_exists("sponsor", $plan) || !is_string($plan['sponsor'])
                || !array_key_exists("description", $plan) || !is_string($plan['description']) ) {
            return false;
        }
    }
    $obj['prizes'] = array_filter($obj['prizes'], function ($v) {
        return strlen($v['name']) > 0;
    });

    foreach($obj['judges'] as $plan) {
        if (!is_array($plan) || !array_key_exists("name", $plan) || !is_string($plan['name'])
                || !array_key_exists("title", $plan) || !is_string($plan['title'])) {
            return false;
        }
    }
    $obj['judges'] = array_filter($obj['judges'], function ($v) {
        return strlen($v['name']) > 0;
    });

    foreach($obj['sponsors'] as $plan) {
        if (!is_array($plan) || !array_key_exists("rank", $plan) || !is_int($plan['rank'])  || $plan['rank'] < 0
                || !array_key_exists("organization", $plan) || !is_string($plan['organization'])) {
            return false;
        }
    }
    $obj['sponsors'] = array_filter($obj['sponsors'], function ($v) {
        return strlen($v['organization']) > 0;
    });

    foreach($obj['routes'] as $plan) {
        if (!is_array($plan)) {
            return false;
        }
        foreach ($plan as $plan2) {
            if (!array_key_exists("location", $plan) || !is_string($plan['location'])) {
                return false;
            }
        }
    }
    $obj['routes'] = array_filter(array_map(function ($v) {
        return array_filter($v, function($v2) {
            return strlen($v2['location']) > 0;
        });
    }, $obj['routes']), function($v) {
        return count($v) > 0;
    });

    foreach($obj['timetable'] as $plan) {
        if (!is_array($plan) || !array_key_exists("date", $plan) || !is_string($plan['date'])
                || !array_key_exists("description", $plan) || !is_string($plan['description'])
                || !array_key_exists("to", $plan) || !is_string($plan['to']) || strlen($plan['to']) != 5
                || !array_key_exists("from", $plan) || !is_string($plan['from']) || strlen($plan['from']) != 5) {
            return false;
        }
        $to = explode(":", $plan['to']);
        $from = explode(":", $plan['from']);
        if (count($to) != 2 || count($from) != 2 || !is_numeric($to[0]) || !is_numeric($to[1]) || !is_numeric($from[0]) || !is_numeric($from[1])) {
            return false;
        }
        if (intval($to[0]) < 0 || intval($to[0]) >= 24 || intval($from[0]) < 0 || intval($from[1]) >= 24
                || intval($to[1]) < 0 || intval($to[1]) >= 24 || intval($from[1]) < 0 || intval($from[1]) >= 24) {
            return false;
        }
    }
    $obj['timetable'] = array_filter($obj['timetable'], function ($v) {
        return strlen($v['description']) > 0;
    });

    foreach($obj['userData'] as $plan) {
        if (!is_array($plan) || !array_key_exists("target", $plan) || !is_string($plan['target'])
                || !array_key_exists($plan['target'], $CONST['TARGETS'])
                || !array_key_exists("fields", $plan) || !is_array($plan['fields'])
                || !array_key_exists("type", $plan) || !is_string($plan['type'])) {
            return false;
        }
        $plan['fields'] = array_filter($plan['fields'], function($v) {
            return is_array($v) && array_key_exists("value", $v) && is_bool($v['value']) && $v['value']
                    && array_key_exists("name", $v) && array_key_exists("type", $v) && is_string($v['name'])
                    && is_string($v['type']) && array_key_exists($v['type'], $CONST['QUESTIONS']);
        });
    }
    $obj['userData'] = array_filter($obj['userData'], function($v) {
        return count($v['fields']) > 0;
    });

    if (!obj['advanced']) {
        unset($obj['advancedQuestions']);
    } else {
        foreach($obj['advancedQuestions'] as $plan) {
            if (!is_array($plan)
                    || !array_key_exists("target", $plan) || !is_string($plan['target']) || !array_key_exists($plan['target'], $CONST['TARGETS'])
                    || !array_key_exists("name", $plan) || !is_string($plan['name'])
                    || !array_key_exists("type", $plan) || !is_string($plan['type'])|| !array_key_exists($plan['type'], $CONST['QUESTIONS'])) {
                return false;
            }
        }
        $obj['advancedQuestions'] = array_filter($obj['advancedQuestions'], function($v) {
            return strlen($v['name']) > 0;
        });
    }
    return true;
}

$app->post('/api/submitHackathon', function() use($auth0, $app, $config, $CONST) {
    $requestHeaders = apache_request_headers();
    if (!isset($requestHeaders['Authorization']) || $requestHeaders['Authorization'] == null) {
        $app->response->setStatus(401);
        $app->stop();
    }
    $authorizationHeader = $requestHeaders['Authorization'];

    $obj = json_decode($app->request->getBody(), TRUE);

    // Validation
    if (!validate($obj, $CONST)) {
        $app->response->setStatus(400);
        $app->stop();
    }
    $user = $auth0->getUser();

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
                'json' => [
                    'id' => $hackathon->id,
                    'uuid' => $hackathon->uuid,
                    'data' => $hackathon->data,
                    'userId' => $user['user_id']
                ],
                'headers' => [
                    'Authorization' => $authorizationHeader
                ]
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
