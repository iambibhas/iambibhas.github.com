---
layout: post
type: post
status: publish
tags:
- bot
- irc
- php
- Technical
meta:
  slider_style: default.css
  _wpbitly: http://q.bibhas.in/H1xiCL
  slide_redirect_url: http://bibhas.in/blog/2010/11/build-your-own-irc-bot-in-php/
  _wp_old_slug: ""
  _syntaxhighlighter_encoded: "1"
  _edit_last: "1"
published: true
title: Build your own IRC bot in PHP
permalink: /blog/209/build-your-own-irc-bot-in-php/
---
I started using IRC about 2 months ago. I know its lame of me to get to that stuff so late. But from the very point I logged into a channel, the thing that caught most of my attention was a Bot that used to respond to user command. Now that seemed interesting. I dug some codes in Github, did some Googling and got the idea. Then found a sample snippet of how to create an IRC bot with PHP, at www.thegeeks.us which wasn't much functional to start with.. I started testing the code and thanks to Ben(spookz), one of the member(and most probably a co-founder too) of thegeeks.us, with some *inspiration* from him, I got this thing to work.

<!--more-->

I built quite a few commands for myself. But I'd rather not post them in a blog which is pretty much in Google's reach. :P

Am posting the code here so that you can customize it and build your own bot with it. The code itself is documented with comments. Still, if you have any type of doubt, don't hesitate to contact me.

    /*
    * PHP IRC Bot
    * Customized by Bibhas.
    * Get in touch at @bibhasdn in twitter
    */

    //Setting time limit off. We need to run the script until We ask it to exit.
    set_time_limit(0);
    //Open socket to server,port
    $socket = fsockopen("irc.freenode.net",6667);
    //Sends USER HOSTNAME IDENT :REAL NAME Change it as you wish.
    fputs($socket,"USER PHPBot bibhas.in PHP :The PHP Bot\n");

    //Sends the NICK to server. Choose a unique one or the script will fail.
    fputs($socket,"NICK php-bot-custom\n");

    //Enter the channel you want to use your bot on.
    fputs($socket,"JOIN #sample-channel\n");

    //Array of commands you can use. If you create a new command,
    //it must be enlisted here before it can be used.
    $commands = array (
    "!version",
    "!say",
    "!tw",
    "!g",
    "!answerme",
    "!restart1",
    "!exit1"
    );

    //Sends the script into an infinite loop
    while (1) {

    	//Recieves the data into $data in 128 bytes.
    	//The bot actually does nothing but receive data users enter in the channel and
    	//respond to it. So, we'll fetch all the texts entered in the channel and
    	//fetch our required data and respond to it.
    	while($data=fgets($socket,128)) {
    		//puts the data in an array by word
    		//this helps us to identify commands and parameters
    		$get = explode(' ', $data);
    		//Server Pinged us lets reply!
    		if ($get[0] == "PING") {
    			fputs ($socket, "PONG ".$get[1]."\n");
    		}
    		//When someone says somethign in the channel, its fetched in the $get array in the following format
    		//0=>:Zhe_Viking!~chatzilla@117.145.203.189 1=>PRIVMSG 2=>#test_field 3=>:!say 4=>Hello 5=>World.

    		//The following code sets $nick and $chan variables from the text last entered in the channel
    		if (substr_count($get[2],"#")) {
    			$nick = explode(':',$get[0]);
    			$nick = explode('!',$nick[1]);
    			$nick = $nick[0]; //User who entered the command
    			$chan = $get[2]; //the channel the bot is in
    			$num = 3; //If you observe the array format, actually text starts from 3rd index.
    			if ($num == 3) {
    				$split = explode(':',$get[3],2);
    				$text = rtrim($split[1]); //trimming is important. never forget.
    				//This is where we start processing the commands we entered in earlier
    				if (in_array($text,$commands)) {
    					//switch-case structure, each case sorresponds to each enlisted commands.
    					switch(rtrim($text)) {
    					case "!version":
    						//PRIVMSG sends our command to the correct channel.
    						fputs($socket,"PRIVMSG $chan : PHP Bot Developed mostly by Bibhas.\n");
    						break;
    					case "!tw": //A command developped by me that fetches the last tweet from the given username
    						$msg="";
    						$handle=$get[4];
    						$msg= get_last_tweet($handle);
    						$msg=html_entity_decode($msg, ENT_QUOTES);
    						fputs($socket,"PRIVMSG $chan :$msg\n");
    						unset($msg);
    						break;
    					case "!g": //Does some google search for you.
    						$arraysize = sizeof($get);
    						$count = 4;
    						$query=""; $result="";
    						while ($count <= $arraysize) { $query = $query." ".$get[$count]; $count++; } $result=from_google($query); $result=html_entity_decode($result, ENT_QUOTES); fputs($socket,"PRIVMSG $chan :$nick => $result\n");
    						unset($result);
    						break;
    					case "!say": //it usually repeats the stuff you give as parameter.
    						// but i used it to print the whole input array for testing purpose.
    						$arraysize = sizeof($get);
    						//1,2,3 are just nick and chan, 4 is where text starts
    						$count = 0;
    						$saytext="";
    						while ($count <= $arraysize) { $saytext = $saytext." " . $count . "=>".$get[$count];
    							$count++;
    						}
    						echo $saytext . "
    ";
    						$saytext = "Array Size $arraysize " . $saytext;
    						fputs($socket,"PRIVMSG $chan :$saytext\n");
    						unset($saytext);
    						break;
    					case "!answerme": //A Yahoo answers integration.
    						$arraysize = sizeof($get);
    						$count = 4;
    						$query=""; $result="";
    						while ($count <= $arraysize) {
    							$query = $query." ".$get[$count];
    							$count++;
    						}
    						$query=trim($query);
    						$result=trim(answerMe($query));
    						fputs($socket,"PRIVMSG $chan :$nick $result\n");
    						unset($result);
    						break;
    					}
    				}
    			}
    		}else if(substr_count($get[3],"#")){ //This is like the admin panel. You can /msg the bot to command it to exit.
    			//print_r($get);
    			$chan=trim(str_replace(":","",$get[3]));
    			$command=trim($get[4]);
    			switch ($command) {
    			case "!exit":
    				fputs($socket,"PRIVMSG $chan :Shutting Down PHPBot!\n");
    				fputs($socket,"QUIT Client Disconnected!\n");
    				//IMPORANT TO HAVE THE DIE(), this throws the script out of the infinite while loop!
    				exit;
    				break;
    			case '!restart': //only works if you're running the bot from browser.
    				echo "";
    				exit;
    				break;
    			}
    		}
    		//Shows the text in the browser as Time - Text
    		//this command logs the channel.
    		echo nl2br(date('G:i:s')."-".$data);

    		//Flush it out to the browser
    		flush();
    	}
    }
    function get_last_tweet($handle){
    	$url = "http://search.twitter.com/search.json?"
    	. "q=from:" . $handle;
    	// sendRequest
    	$ch = curl_init();
    	$msg="";
    	curl_setopt($ch, CURLOPT_URL, $url);
    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    	curl_setopt($ch, CURLOPT_REFERER, "http://asfd.in");
    	$body = curl_exec($ch);
    	curl_close($ch);

    	// now, process the JSON string
    	$json = json_decode($body);
    	// now have some fun with the results...
    	$result=object_to_array(get_object_vars($json));
    	if($result['results'][0]['text']!=""){
    		$msg="Twitter: http://twitter.com/{$result['results'][0]['from_user']} => " . $result['results'][0]['text'];
    		return $msg;
    	}else{
    		$msg="Twitter: Nothing!";
    		return $msg;
    	}
    	//return $result['results'][0]['text'];
    }
    function object_to_array($data) // Converts a Nested stdObject to a full associative Array
    { // Not used everywhere, because found this solution much later
    	if(is_array($data) || is_object($data)) //
    	{
    		$result = array();
    		foreach($data as $key => $value)
    		{
    			$result[$key] = object_to_array($value);
    		}
    		return $result;
    	}
    	return $data;
    }

    function from_google($query){
    	$query=urlencode($query);
    	$array=array();
    	$url = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&"
    	. "q=" . $query . "&rsz=large";
    	$ch = curl_init();
    	curl_setopt($ch, CURLOPT_URL, $url);
    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    	curl_setopt($ch, CURLOPT_REFERER, "http://forums.com");
    	$body = curl_exec($ch);
    	curl_close($ch);
    	$json = json_decode($body);
    	$array = object_to_array($json);
    	return $array['responseData']['results'][0]['titleNoFormatting'] . " => " . $array['responseData']['results'][0]['url'];
    }

    function answerMe($query){
    	$output_a=array();
    	$query=urlencode($query);
    	$url="http://answers.yahooapis.com/AnswersService/V1/questionSearch?"
    	. "appid=Ad1hrrPV34Fh3zYyVhTCvpQ9sTG6pq7lSTXl7xx1epJEGdcxux_e8Xb5Q9ao-"
    	. "&query=$query"
    	. "&type=resolved"
    	. "&search_in=question"
    	. "&output=json";
    	$output = file_get_contents($url);
    	$output_a=object_to_array(json_decode($output));
    	if($output_a['all']['count']>0){
    		$output_a=$output_a['all']['questions'];

    		//print_r($output_a);
    		return " *Possible Question:* " . $output_a[0]['Subject'] . " *Answer:* " . $output_a[0]['ChosenAnswer'] . " *Link:* " . $output_a[0]['Link'];
    		//return $output_a[0]['ChosenAnswer'];
    	}else{
    		return "Dont have any answer to that!";
    	}
    }

<strong>To run the bot:</strong>

You can run it from either command prompt with php and  Apache server installed or you can run it from a browser. For the later case, just execute the script file form the browser.

There you go. Leave comment if you have doubt. Or directly reach me at twitter or facebook. :)

> **:Note to myself:**
>
> The code looks like a mess. Clean it up.
