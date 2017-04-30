<?php

class Hackathon extends Illuminate\Database\Eloquent\Model {

    protected $table = "hackathons";
    public $timestamps = false;
    
    // need to explicitly cast attributes of type Integer, Float, Boolean 
    
    public function getIdAttribute($value)
    {
        return (integer) $value;
    }
    
    
    
}
