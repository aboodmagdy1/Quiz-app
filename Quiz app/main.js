// هحط عدد الاسئله ف الكونت
let count = document.querySelector(".count span")
let bolletsSpanContainer = document.querySelector(".bullets .spans")
let bullets = document.querySelector(".bullets")
let QuestionArea = document.querySelector(".quiz-area ")
let answerArea = document.querySelector(".quiz-anwser")
let theCategory = document.querySelector(".quiz-category span")
let submitBtn = document.querySelector(".submit-button")
let resultContainer = document.querySelector(".results")
let countDown = document.querySelector(".count-down")
let exams = document.querySelector(".exams")
// set options 
// to make the next question 
let currentIndex =0 ;
let rightAnswers = 0 ;
let countdownInterval ;

// جبت الاسئله من ال جوسن 
function getQuestions ()
{
    let myrequest = new XMLHttpRequest();
    myrequest.onreadystatechange = function()
    {
        if (this.readyState ===4 && this.status ===200)
        {
            let QuestionsObject = JSON.parse(this.responseText)
            let qCount = QuestionsObject.length
            creatBullets(qCount)
            addQuestionsData(QuestionsObject[currentIndex],qCount)
            // start countdown
            countdown(4,qCount)
            // click on submit 
            submitBtn.onclick = ()=>
            {
                // get the right answer
                let theRightAnswer = QuestionsObject[currentIndex].right_answer
                // increase the current index to go to the next question
                currentIndex++;
                // check the answer
                checkAnswer(theRightAnswer,qCount)
                // make the quiz area empty to load the new quesiton data 
                QuestionArea.innerHTML = ""
                answerArea.innerHTML = ""
                addQuestionsData(QuestionsObject[currentIndex],qCount)
                // handel the bullets calsses
                handerBullets()
                // start countdown
                clearInterval(countdownInterval)
                countdown(4,qCount)
                showResults(qCount)
            };
        }
    }
    myrequest.open("Get","/projects/New folder/Qustions.json",true)
    myrequest.send()
        
}
getQuestions()


function creatBullets(num)
{
    count.innerHTML = num
    for(let i =0 ;i<num ;i++)
    {
        // creat bullets
        let theBollet = document.createElement('span')
        // check if we in the frist span
        if(i === 0 )
        {
            theBollet.className = "on"
        }
        bolletsSpanContainer.appendChild(theBollet)
        
    }

}

// funciton to add data to the page 
// the 1st parameter to get the info of the obj 
// the 2nd parameter to make the funciton creat a number of question should be created 
function addQuestionsData(qobj,qCount)
{
// index(0,1,2,3)  < length (4)
if(currentIndex<qCount)
{
        // creat h2  as question title
        let questionTitle =document.createElement("h2")
        // create question text
        let qtitle = document.createTextNode(qobj.title)
        qtitle.calssList=""
        questionTitle.appendChild(qtitle)
        QuestionArea.appendChild(questionTitle)
    
        // creat the answer 
        
        for(let i = 0 ; i<4;i++)
        {
    
            // main answer div
            let mainDiv = document.createElement("div")
            mainDiv.className = 'answer'
            // creat radio input 
            let radioInput = document.createElement("input")
            radioInput.type = "radio"
            radioInput.name = `question`
            radioInput.id = `answer-${i+1}`
            radioInput.dataset.answer = qobj.answers[i]
    
            // creat lable 
            let theLable = document.createElement("label")
            theLable.htmlFor =`answer-${i+1}`
            // lable text 
            let lableText = document.createTextNode(qobj.answers[i])
            theLable.appendChild(lableText)
            mainDiv.appendChild(radioInput)
            mainDiv.appendChild(theLable)
            answerArea.appendChild(mainDiv);
            if(i===0)
            {
                radioInput.checked = true
            }
        }
}

}

function checkAnswer(rAnswer , count)
{
    let answers = document.getElementsByName("question")
    let selectedAnswer ;
    for(let i = 0 ; i<answers.length; i++)
    {
        if(answers[i].checked)
        {
            selectedAnswer = answers[i].dataset.answer
        }


    }
    if(rAnswer ===selectedAnswer)
    {
        rightAnswers++;
    }
}
function handerBullets()
{
    let  bulletsSpans = document.querySelectorAll(".spans span")
    let arrayOfSpans = Array.from(bulletsSpans)
    arrayOfSpans.forEach((span,index)=>
    {
        if(currentIndex===index)
        {
            span.className ="on"
        }
    })
}
function showResults(count)
{
    let theResults;
    // when the question area and answers area are empyt 
    if(currentIndex === count)
    {
        QuestionArea.remove()
        answerArea.remove()
        submitBtn.remove()
        bullets.remove()
        
        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
          } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
          } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
          }

        resultContainer.innerHTML=theResults
        resultContainer.style.padding="10px"
        resultContainer.style.backgroundColor="white"
        resultContainer.style.marginTop="white"

    }
}
function countdown(duration ,count )
{
if(currentIndex<count)
{
    let minutes ,sconds;
    countdownInterval= setInterval(() => {
        minutes = parseInt(duration/60)
        sconds = parseInt(duration%60)
        minutes = minutes<10?`0${minutes}`:minutes
        sconds = sconds<10?`0${sconds}`:sconds

countDown.innerHTML = `${minutes}:${sconds}`
if(--duration<0)
{
    clearInterval(countdownInterval)
    submitBtn.click()
}
    }, 1000);
}
}
