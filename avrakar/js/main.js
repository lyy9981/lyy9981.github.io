var stage, choiceType, displayObjects = [], selectedDisplayObject, output;

function init() {
	stage = new createjs.Stage("mainCanvas");
	stage.enableMouseOver();
	
	startStepOne();
	
	createjs.Ticker.on("tick", tick);
	createjs.Ticker.setFPS(10);
	
	// UI code. Display selection result
	output = stage.addChild(new createjs.Text("", "14px monospace", "#000"));
	output.lineHeight = 15;
	output.textBaseline = "top";
	output.x = 10;
	output.y = stage.canvas.height-output.lineHeight*3-10;
				
	stage.update();
}

function startStepOne() {
	choiceType = "gender";
	
	var choiceGender1 = {
	    name: "male",
		src: "img/genderMaleSprite.png",
	    width: 200,
		height: 200,
		x: 100,
		y: 100
	};

	var choiceGender2 = {
	    name: "female",
		src: "img/genderFemaleSprite.png",
	    width: 200,
		height: 200,
		x: 400,
		y: 100
	};
	
	genderChoices = [choiceGender1, choiceGender2]; 

	createDisplayObjects(genderChoices);
}

function startStepTwo() {
	choiceType = "category";
	
	var choiceCategory1 = {
	    name: "terre",
		src: "img/genderMaleSprite.png",
	    width: 200,
		height: 200,
		x: 100,
		y: 100
	};

	var choiceCategory2 = {
	    name: "feu",
		src: "img/genderFemaleSprite.png",
	    width: 200,
		height: 200,
		x: 400,
		y: 100
	};

	var choiceCategory3 = {
	    name: "air",
		src: "img/genderFemaleSprite.png",
	    width: 200,
		height: 200,
		x: 100,
		y: 400
	};
	
	var choiceCategory4 = {
	    name: "eau",
		src: "img/genderFemaleSprite.png",
	    width: 200,
		height: 200,
		x: 400,
		y: 400
	};
		
	categoryChoices = [choiceCategory1, choiceCategory2, choiceCategory3, choiceCategory4]; 

	createDisplayObjects(categoryChoices);
}

function startStepThree() {
	choiceType = "race";
	
	var choiceRace1 = {
	    name: "race1",
		src: "img/genderMaleSprite.png",
	    width: 200,
		height: 200,
		x: 300,
		y: 100
	};

	var choiceRace2 = {
	    name: "race2",
		src: "img/genderFemaleSprite.png",
	    width: 200,
		height: 200,
		x: 100,
		y: 400
	};

	var choiceRace3 = {
	    name: "race3",
		src: "img/genderFemaleSprite.png",
	    width: 200,
		height: 200,
		x: 400,
		y: 400
	};
	
	raceChoices = [choiceRace1, choiceRace2, choiceRace3]; 

	createDisplayObjects(raceChoices);
}

function createDisplayObjects(choiceObjects) {
	displayObjects.length = 0; // empty array
	
	for (var i in choiceObjects) {
		var choiceObject = choiceObjects[i];
		var sprite = new Image();
	    sprite.src = choiceObject["src"];

		var sheet = new createjs.SpriteSheet({
		    images: [sprite], 
		    frames: {width: choiceObject["width"], height: choiceObject["height"], regX: choiceObject["width"]/2, regY: choiceObject["height"]/2}, 
		    animations: {	
			    walk: [0, 9, "walk"]
		    }
	    });
		
		displayObject = new createjs.Sprite(sheet);	
	    displayObject.name = choiceObject["name"];
	    displayObject.x = choiceObject["x"];
	    displayObject.y = choiceObject["y"];
	    displayObject.scaleX = 0;
	    displayObject.scaleY = 0;
	
		var tweenMoveIn = createjs.Tween.get(displayObject, {loop:false})
		                         .to({scaleX:1.0, scaleY:1.0}, 1500, createjs.Ease.bounceOut);
		
	    stage.addChild(displayObject);
	
		displayObject.on("click", handleClickEvent);
		displayObject.on("mouseover", handleMouseOverEvent);
		displayObject.on("mouseout", handleMouseOutEvent);
		
		displayObjects.push(displayObject); // Add displayObject to array for later use
	}
}

function handleMouseOverEvent(evt) {
	selectedDisplayObject = evt.target;
}

function handleMouseOutEvent(evt) {
	selectedDisplayObject = null;
}

function handleClickEvent(evt) {
	var choiceValue = evt.target.name;
	
	createCookie(choiceType, choiceValue, 365);
	output.text = ("Wah ha ha ha ! Tu as choisi " + readCookie(choiceType) + ".");
	
	for (var i in displayObjects) { 
		var displayObject = displayObjects[i];
		var tweenMoveOut;
		var random = Math.random() + 1; // a random between between 1 and 2. Eg: 1.9622915333602577
		var yDestination = stage.canvas.height * random;
		
		// Animate objects off stage and call handleComplete.
		if(i==0) {
			// We onlly want to call handleComplete once
			tweenMoveOut = createjs.Tween.get(displayObject, {loop:false})
			                         .to({y:yDestination}, 1500, createjs.Ease.quartOut).wait(10).call(handleComplete);
		} else {
			tweenMoveOut = createjs.Tween.get(displayObject, {loop:false})
			                         .to({y:yDestination}, 1500, createjs.Ease.quartOut);
		}

	}
}

function handleComplete() {
	if(choiceType == "gender") {
		startStepTwo();
	} else if(choiceType == "category") {
		startStepThree();
	}
}

function tick(event) {
	for (var i in displayObjects) { 
		var displayObject = displayObjects[i];
		
		// Pause the mouse over object, continue to animate the rest
		if (selectedDisplayObject != displayObject) {
			displayObject.play(); 
		} else {
			displayObject.stop(); 
		}
	}
	
	stage.update(event); 
}

function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}