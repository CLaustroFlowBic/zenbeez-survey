var config  =  {
    type: 'pie',
    data: {
        labels: ['Shock-Denial', 'Resentment', 'Guilt', 'Loneliness'],
        datasets: [{
            label: '# of Votes',
            data: [1, 1, 1, 1],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 2
        }]
    },
    options: {
        legend: {
            position: "top",
            labels: {
                fontColor: "#000"
            }
            
        },
        responsive : false,
        
    }
};
//stores the value of each question
var valueArray = [];
//keeps track of the survey's position
var counter = 0;
//the value tracker(not sure if neccassary)
var value = null;
questions = 
     [
        {
            "title": "I am just now starting to see how great my relationship was"
        },
        {
            "title": "There aren't many people that understand me completely"
        }, 
        {
            "title": "I feel bad for what my ex-partner is going through"
        }, 
        {
            "title": "I see all the flaws of my partner more clearly than ever"
        }, 
        {
            "title": "Without my partner I feel all empty and alone inside"
        },
        {
            "title": "I now feel ashmaed of myself for even being with my ex-partner"
        },
        {
            "title": "I should have done things differently"
        },
        {
            "title": "Most of the time since the breakup I don't even know what is it that I am feeling"
        }
     ];

$(document).ready(function () {
    $("#startSurvey").click(function(){init_survey();});
    
});


async function init_survey() {
    
    main_survey_transition();
    add_buttons();

    //get questions
    //var questions = [];
   // await fetch('http://localhost/questions.json')
   // .then(response => response.json())
   // .then(data => questions = data.questions );
    console.log(questions);
    
    
    //sets intial title text
    $("#title").text(questions[counter].title);

    //next button event
    $("#next").unbind("click").click(async function(){
        
        //checks if the user has selected a button
        if(value == null) {
            //if they haven't display an error
            $("#unselected-error").css('visibility','')
            return;
        }
        //set question value to value tracker
        valueArray[counter] = value;
        //remove the error
        $("#unselected-error").css('visibility','hidden')
        //handle the next button operation
        counter = handle_next(questions, value);
        if(!valueArray[counter]) {
            value = null;
        }
        
    });

    //back button event
    $("#back").click(function(){
        //hides the error message
        $("#unselected-error").css('visibility','hidden');
        //lower bounds checking
        if(counter - 1 < 0) {
            counter = 0;
        } else {
            //if we do decrement
            counter -= 1;
            //remove the submit button
            $("#submit").remove();
            //show the next button
            $("#next").show();
            //transition title back one place
            title_transition(questions)
            //decrement progress
            $("progress").attr("value", counter  * 10);
            //change button state
            change_button_state();
            //set value tracker to the set value
            value = valueArray[counter];
        }
        
    });

    //buttons events
    $(".button").click(function() {
        //wipes the active state from all buttons
        $(".button").each(function() {
            $(this).removeClass("active");
        });

        //adds the active state to clicked button
        $(this).addClass("active")
        //sets its value to value tracker (potentially not needed)
        value = parseInt($(this).text());
        //sets this questions value to the value tracker
        valueArray[counter] = value;
    });
    
}


//process results of the survey
//data = data from the survey (will have to chagne this when more questions are added)
//config = json for chartjs
function processResult(data, config) {
    var numbers = [];
    //formula on the sheet given by phil
    numbers.push(parseInt(data[0]) + parseInt(data[7]));
    numbers.push(parseInt(data[3]) + parseInt(data[5]));
    numbers.push(parseInt(data[2]) + parseInt(data[6]));
    numbers.push(parseInt(data[1]) + parseInt(data[4]));
    console.log(numbers);
    config.data.datasets[0].data = numbers;
    return config;
}

//handles the nexts button event
//questions = question array 
//value = value tracker
function handle_next(questions, value) {
    
    //if the next question is the last question
    if(counter + 1 == questions.length - 1) {
        //increment the counter
        counter += 1;
        //increment progress bar (should be full now)
        $("progress").attr("value", (counter + 1)  * 10);
        //add the submit button
        $("#survey-body").append("<button id=\"submit\" class = \"btn btn-success btn-lg \">Submit</button>");
        //hide the next button
        $("#next").hide();
        title_transition(questions)
        //change the button state (makes on active if you have already visited)
        change_button_state();
        //submit button handler
        $("#submit").click(function() {
            //TODO: send data to a backend

            //set this question from the value tracker
            valueArray[counter] = value;

            console.log(valueArray);
            //hide the survey
            $("#survey").hide();
            
            //add results into chartjs config
            config = processResult(valueArray, config)
            //get the highest value in the array 
            let i = config.data.datasets[0].data.indexOf(Math.max(...config.data.datasets[0].data));   
            //TODO:print correct messgae and link corresponding to what type of breakup 
            console.log(i); 
            
            //add the chart to the document
            var text = '<canvas id="myChart" width="300" height="300" ></canvas>';
            $('#chartWrap').html(text);
            $('#chartWrap').removeAttr('hidden');
            myChart = new Chart($('#myChart')[0].getContext('2d'), config);
            //change title to nexst question
        
            
            
        });
        return counter;
    
    } else {
        $("progress").attr("value", (counter + 1)  * 10);
        counter + 1 >= questions.length ? counter = questions.length - 1 : counter += 1;
        
        //$("#title").text(questions[counter].title);
       
        //title_transition(questions);
        //if the next element already has an element set value tracker to that
        if(valueArray[counter]) {
            value = valueArray[counter];
        } else {
            value = null;
        }
        //change title to nexst question
        title_transition(questions)
        //change the button state (makes on active if you have already visited)
        change_button_state();
        
        return counter;
    }
    
    
}

function add_buttons() {
    var tag = "";
    for(let i = 1; i < 9; i ++) {
        tag += "<button id= \"button\"class= \"button btn btn-outline-primary\">" + i + "</button>"
    }
    $("#buttons").html(tag);
    
}

async function main_survey_transition() {
    $("#inital").fadeOut(300);
    await sleep(300);
    $("#survey").hide();
    $("#survey").removeAttr('hidden');
    $("#survey").fadeIn(200);
    
}

async function title_transition(questions) {
    sem = 0;
    let time = 300;
    $("#title").fadeOut(time);
    await sleep(time - 25)
    $("#title").text(questions[counter].title);
    
    $("#title").fadeIn(time);
    
    sem = 1;
    
    
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function change_button_state() {
    //remove active state from all buttons
    $(".button").each(function() {
        $(this).removeClass("active");
    })
    //check if the current question has a set number
    if(valueArray[counter]){
        
        $(".button").each(function() {
            if((parseInt($(this).text())) == valueArray[counter]){
                $(this).addClass("active");
            }
        });
        

    }
}
