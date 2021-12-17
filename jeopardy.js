// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
const numCategories = 6;
const numQuestionPerCat = 5;
const board = $("#game");
let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getCategoryIds(catIds) {
    
    let randomId = _.sampleSize(catIds.data, numCategories);
    let categoryId = [];
    
    for (let cat of randomId) {
        categoryId.push(cat.id);
    }
    return categoryId;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

function getCategory(catId) {
    let cat = catId.data;
    let hints = _.sampleSize(cat, numQuestionPerCat);
    let catData = {
        title: cat[0].category.title ,
        hints: []
    };

    hints.map((arr)=> {
        let hintsArr = {
            question: arr.question,
            answer: arr.answer,
            showing: null
        };
        catData.hints.push(hintsArr);
    });
    categories.push(catData);
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    let titles = categories.map((title)=>{return title.title;});

    $("thead").add("tr");
    for(let x = 0; x < numCategories; x++){
        const header = document.createElement("th");
        header.innerText = titles[x];
        $("thead").append(header);
    }
    categories.forEach((category) => {
        const row = document.createElement("tr");
        category.hints.forEach((hint) =>{
            const cell = document.createElement("td");
            cell.innerHTML = `<div id=x-y>${hint.question}</div>`;
            row.append(cell);
            console.log(hint);
        })
        board.append(row);

    })
    
    
    
    
    
    

    //console.log(categories);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let x = evt.target.id[0];
    let y = evt.target.id[2];
    
    if (evt.target.classList.contains("answer")) {
        return;
    }
    else if(evt.target.classList.contains("question")){
        evt.target.innerText = categories[x].hints[y].answer; 
        evt.target.classList.remove("question"); 
        evt.target.classList.add("answer"); 
    }
    else{
        evt.target.innerText = categories[x].clues[y].question;
        evt.target.classList.add("question");
    }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    const resCategories = await axios.get("http://jservice.io/api/categories", {
        params: {
            count: 100
        }
    });
    let catIds = getCategoryIds(resCategories);
    //console.log(resCategories);

    for(let id of catIds){
        const resTitles = await axios.get("http://jservice.io/api/clues",{
            params: {
                category: id
            }
        });
        getCategory(resTitles);
        //console.log(resTitles);
    }
    fillTable();
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
$("#restart").on("click", function() {
	location.reload();
});

$(document).ready(function() {
	setupAndStart();
	$("#jeopardy").on("click", "div", handleClick);
});